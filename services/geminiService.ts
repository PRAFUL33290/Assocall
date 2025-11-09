import { GoogleGenAI, Chat, GenerateContentResponse, Modality, Part, Type } from "@google/genai";
import { GroundingMetadata, PublicProject, OrganizationProfile, Project, FinancialData, Reference, Municipality, FunderContact } from '../types';

if (!process.env.API_KEY) {
  throw new Error("La variable d'environnement API_KEY n'est pas définie");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatInstance: Chat | null = null;

const getChatInstance = (): Chat => {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "Vous êtes AssoCall AI, l'assistant amical de la plateforme AssoCall. Vous aidez les utilisateurs (associations, entreprises) et les pouvoirs publics (mairies, etc.). Soyez serviable, concis et professionnel. Répondez directement sans phrases d'introduction.",
      },
    });
  }
  return chatInstance;
};

export const sendMessageToChatStream = (message: string) => {
  const chat = getChatInstance();
  return chat.sendMessageStream({ message });
};

export const generateProjectContent = async (
  prompt: string,
  // Fix: Add 'gemini-2.5-flash-image' to the list of accepted models
  // to support image generation and fix the type error.
  model: 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-2.5-flash-image',
  file?: File
): Promise<string> => {
  try {
    const fullPrompt = `${prompt}. Réponds directement avec le texte généré, sans introduction, préambule ou formatage Markdown comme des astérisques.`;
    const parts: Part[] = [{ text: fullPrompt }];
    
    if (file) {
      const filePart = await fileToGenerativePart(file);
      parts.push(filePart);
    }

    const isImageModel = model === 'gemini-2.5-flash-image';

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: parts }],
      // Fix: Add responseModalities config when generating an image.
      ...(isImageModel && { config: { responseModalities: [Modality.IMAGE] } }),
    });

    // Fix: Handle image model response by extracting base64 data.
    if (isImageModel) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
      return "Erreur: Aucune image n'a été générée.";
    }

    return response.text;
  } catch (error) {
    console.error("Erreur lors de la génération du contenu du projet :", error);
    return "Une erreur est survenue lors de la génération du contenu. Veuillez réessayer.";
  }
};

export const editImageWithPrompt = async (base64Image: string, mimeType: string, prompt: string): Promise<string | null> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la modification de l'image :", error);
    return null;
  }
};

export const getGroundedAnswer = async (prompt: string): Promise<{ text: string, metadata: GroundingMetadata | null }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    const metadata = response.candidates?.[0]?.groundingMetadata || null;
    return { text: response.text, metadata };
  } catch (error) {
    console.error("Erreur avec la recherche ancrée :", error);
    return { text: "Une erreur est survenue lors de la récupération des informations. Veuillez réessayer.", metadata: null };
  }
};

export const getMunicipalityDetails = async (
    name: string,
    userLocation: { latitude: number; longitude: number; } | null
): Promise<Partial<Municipality>> => {
    try {
        const prompt = `Pour la mairie de "${name}", fournis les informations suivantes au format "Clé: Valeur", une par ligne. Ne renvoie que ces lignes, sans texte supplémentaire, ni formatage markdown.
Adresse: [Adresse postale complète]
Téléphone: [Numéro de téléphone]
Email: [Email de contact]
Site Web: [URL du site officiel]`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                ...(userLocation && {
                    toolConfig: {
                        retrievalConfig: {
                            latLng: {
                                latitude: userLocation.latitude,
                                longitude: userLocation.longitude,
                            }
                        }
                    }
                })
            },
        });

        const text = response.text;
        const details: Partial<Municipality> = {};
        
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.toLowerCase().startsWith('adresse:')) details.adresse = line.substring('adresse:'.length).trim();
            else if (line.toLowerCase().startsWith('téléphone:')) details.telephone = line.substring('téléphone:'.length).trim();
            else if (line.toLowerCase().startsWith('email:')) details.email = line.substring('email:'.length).trim();
            else if (line.toLowerCase().startsWith('site web:')) details.siteWeb = line.substring('site web:'.length).trim();
        }

        return details;

    } catch (error) {
        console.error(`Erreur avec la recherche Maps pour ${name}:`, error);
        throw new Error(`Impossible de récupérer les informations pour ${name}.`);
    }
};

export const getFunderContactDetails = async (
    organizationName: string
): Promise<Partial<FunderContact>> => {
    try {
        const prompt = `Pour l'organisme "${organizationName}", trouve les informations de contact suivantes au format "Clé: Valeur", une par ligne. Ne retourne que ces lignes, sans texte supplémentaire, ni formatage markdown. Si une information n'est pas disponible, ne l'inclus pas.
Nom: [Nom d'un contact pertinent, si disponible]
Email: [Email de contact général ou pour les subventions]
Téléphone: [Numéro de téléphone principal]
Adresse: [Adresse postale complète]`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const details: Partial<FunderContact> = {};
        
        const lines = text.split('\n');
        for (const line of lines) {
            if (line.toLowerCase().startsWith('nom:')) details.name = line.substring('nom:'.length).trim();
            else if (line.toLowerCase().startsWith('email:')) details.email = line.substring('email:'.length).trim();
            else if (line.toLowerCase().startsWith('téléphone:')) details.phone = line.substring('téléphone:'.length).trim();
            else if (line.toLowerCase().startsWith('adresse:')) details.address = line.substring('adresse:'.length).trim();
        }

        return details;

    } catch (error) {
        console.error(`Erreur avec la recherche pour ${organizationName}:`, error);
        throw new Error(`Impossible de récupérer les informations pour ${organizationName}.`);
    }
};

export const findPublicProjects = async (
    query: string,
    onProjectFound: (project: PublicProject) => void
): Promise<void> => {
    try {
        const prompt = `La date actuelle est le 3 novembre 2025. Utilise cette date comme référence pour toutes tes analyses.

En tant qu'assistant expert dans la recherche d'opportunités de financement en France, ta mission est de trouver des appels à projets ou des appels d'offres publics basés sur la requête de l'utilisateur : "${query}".

Analyse les résultats de recherche web pour identifier les opportunités pertinentes. Pour chaque opportunité, extrais les informations et retourne-les sous la forme d'un objet JSON.
- **Règle de sortie cruciale :** Retourne chaque opportunité comme un objet JSON complet sur sa propre ligne (format JSONL). N'inclus rien d'autre, pas d'introduction, pas de \`\`\`json, juste les objets JSON ligne par ligne.
- **Filtre temporel crucial :** Recherche activement des offres dont la date limite est POSTÉRIEURE à novembre 2025. Priorise les offres valides.
- **Statut :** Détermine le statut ('Ouvert' ou 'Clôturé') en te basant STRICTEMENT sur la date du jour (3 novembre 2025). Si la date limite est passée, marque l'offre comme 'Clôturé'.
- **Structures Éligibles :** Analyse les conditions d'éligibilité pour déterminer les types de structures qui peuvent postuler (ex: 'Association', 'Entreprise', 'Mairie/Collectivité', 'Autre'). Si les conditions sont larges (ex: "tous les acteurs locaux"), inclus les types les plus pertinents. Si ce n'est pas explicitement mentionné, fais une recommandation basée sur le contexte de l'appel à projet.
- **Contact du subventionneur :** Si des informations de contact (nom, email, téléphone) sont **immédiatement visibles** sur la page de l'appel à projet, extrais-les. Ne passe pas de temps supplémentaire à chercher ces informations si elles ne sont pas évidentes. Si rien n'est trouvé, omet simplement l'objet 'funderContact'.
- Si une information n'est pas disponible, utilise 'Non spécifié' pour les champs de type chaîne, ou omet le champ si possible.
- Fournis des liens directs vers les pages officielles, pas des liens de résultats de moteur de recherche.
- Synthétise les objectifs, les critères d'éligibilité et les documents requis de manière claire et concise.
- Trouve jusqu'à 5 résultats pertinents et récents, en priorisant les plus adéquats. Ne retourne que des projets uniques.`;

        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        let buffer = '';
        for await (const chunk of responseStream) {
            buffer += chunk.text;
            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                const line = buffer.substring(0, newlineIndex).trim();
                buffer = buffer.substring(newlineIndex + 1);

                if (line) {
                    try {
                        const projectData = JSON.parse(line);
                        const projectWithId: PublicProject = {
                            ...projectData,
                            id: crypto.randomUUID(),
                        };
                        onProjectFound(projectWithId);
                    } catch (e) {
                        console.warn("Impossible d'analyser la ligne JSON du flux :", line, e);
                    }
                }
            }
        }

        if (buffer.trim()) {
            try {
                const projectData = JSON.parse(buffer.trim());
                const projectWithId: PublicProject = {
                    ...projectData,
                    id: crypto.randomUUID(),
                };
                onProjectFound(projectWithId);
            } catch (e) {
                console.warn("Impossible d'analyser le tampon JSON restant :", buffer.trim(), e);
            }
        }

    } catch (error) {
        console.error("Erreur lors de la recherche d'appels à projets :", error);
        throw new Error("Une erreur est survenue lors de la recherche. L'IA n'a peut-être pas pu formater la réponse correctement.");
    }
};


export const generateChecklist = async (projectContext: PublicProject): Promise<{ name: string; type: 'Obligatoire' | 'Complémentaire' }[]> => {
    try {
        const prompt = `La date actuelle est le 3 novembre 2025. Ta mission est de générer une checklist structurée de pièces à fournir pour répondre à un appel à projets.
Le projet est : "${projectContext.title}".
Voici la liste des pièces déjà requises par l'appel d'offres : "${projectContext.requiredDocuments.join(', ')}".

Ta tâche :
1.  Analyse la liste des pièces requises.
2.  Complète cette liste en recherchant les pièces justificatives standards et obligatoires pour une demande de subvention en France (ex: formulaire CERFA n°12156*06, statuts, RIB, rapports, etc.).
3.  Retourne le résultat final sous la forme d'un tableau JSON d'objets. Chaque objet doit contenir deux clés:
    - "name" (string, le nom complet du document)
    - "type" (string, avec la valeur "Obligatoire" ou "Complémentaire").
4.  **Classification :**
    - Classe TOUS les documents de la liste fournie initialement comme "Obligatoire".
    - Classe les documents administratifs de base que tu ajoutes (Statuts, RIB, Kbis, Liste des dirigeants) comme "Obligatoire".
    - Classe les autres documents standards que tu ajoutes (rapport d'activité, budget prévisionnel de la structure, etc.) comme "Complémentaire".
5.  Le format de sortie doit être UNIQUEMENT un JSON valide, et rien d'autre. Pas de texte d'introduction, pas de \`\`\`json.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        
        let jsonText = response.text.trim();
        // Defensively strip markdown fences if they exist
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.slice(7, -3).trim();
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.slice(3, -3).trim();
        }
        
        const parsedData = JSON.parse(jsonText);

        if (Array.isArray(parsedData)) {
            return parsedData.filter(item => typeof item.name === 'string' && (item.type === 'Obligatoire' || item.type === 'Complémentaire'));
        }
        
        throw new Error("La réponse de l'IA n'est pas un tableau JSON valide.");


    } catch (error) {
        console.error("Erreur lors de la génération de la checklist :", error);
        // Fallback with a default structured list
        return [
            // Fix: Corrected typo 'Oblatoire' to 'Obligatoire' to match type definition.
            { name: "Statuts de l'association", type: 'Obligatoire' },
            // Fix: Corrected typo 'Oblatoire' to 'Obligatoire' to match type definition.
            { name: "Liste des personnes chargées de l'administration", type: 'Obligatoire' },
            // Fix: Corrected typo 'Oblatoire' to 'Obligatoire' to match type definition.
            { name: "Relevé d'Identité Bancaire (RIB)", type: 'Obligatoire' },
            { name: "Dernier rapport d'activité approuvé", type: 'Complémentaire' },
            { name: "Comptes annuels du dernier exercice clos", type: 'Complémentaire' },
            { name: "Budget prévisionnel de l'association", type: 'Complémentaire' },
            // Fix: Corrected typo 'Oblatoire' to 'Obligatoire' to match type definition.
            { name: "(Si applicable) Récépissé de déclaration de création", type: 'Obligatoire' },
        ];
    }
};

export const generateOfficialDocumentContent = async (
  documentName: string,
  project: Project,
  profile: OrganizationProfile
): Promise<string> => {
  const prompt = `Tu es un expert en rédaction de dossiers de réponse aux appels d'offres et demandes de subvention pour des structures (associations, entreprises) en France.
Ta mission est de rédiger le contenu textuel pour un document spécifique : **"${documentName}"**.

Le texte doit être professionnel, clair, concis et directement utilisable.
Base-toi EXCLUSIVEMENT sur les informations fournies ci-dessous.
Ta réponse doit être UNIQUEMENT le texte généré, sans aucune phrase d'introduction, conclusion, titre ou formatage markdown (pas d'astérisques, de #, etc.).

---
### BLOC 1 : INFORMATIONS SUR LA STRUCTURE (LE CANDIDAT) ###
---
- **Nom de la structure :** ${profile.denomination}
- **SIRET :** ${profile.siret}
- **Représentant Légal :** ${profile.representantLegal}
- **Adresse :** ${profile.adresse}
- **Contact :** ${profile.email}, ${profile.telephone}
- **Ressources Humaines (N-1) :** ${profile.humanResources.salaries} salariés, ${profile.humanResources.benevoles} bénévoles.
- **Informations administratives et motivation générales (fournies par l'utilisateur) :**
  """
  ${profile.administrativeMotivationBlock || "Non renseigné."}
  """

---
### BLOC 2 : INFORMATIONS SUR LE PROJET ###
---
- **Titre du projet :** ${project.title}
- **Résumé :** ${project.summary}
- **Spécifications / Déroulement :** ${project.specifications}
- **Budget prévisionnel :** ${project.budget}
- **Objectifs (style CERFA) :** ${project.cerfa?.objectifs || "Non renseigné."}
- **Description (style CERFA) :** ${project.cerfa?.description || "Non renseigné."}
- **Indicateurs d'évaluation (style CERFA) :** ${project.cerfa?.indicateurs || "Non renseigné."}

---
### TA MISSION ###
---
Rédige maintenant le contenu pour le document : **"${documentName}"**. Adapte ton style en fonction du document demandé (ex: un Mémoire Technique sera plus détaillé et technique qu'une lettre de motivation). Si le nom du document est 'DC1', génère une lettre de candidature. Si c'est 'DC2', synthétise les informations de déclaration du candidat. Si c'est 'Mémoire Technique', détaille la réponse technique au besoin en se basant sur les informations du projet.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Erreur lors de la génération du contenu pour ${documentName}:`, error);
    return "Une erreur est survenue lors de la génération du contenu. Veuillez réessayer.";
  }
};

export const generateExampleContent = async (
  fieldType: 'administrativeMotivationBlock' | 'projectSummary' | 'projectSpecifications' | 'projectMaterials' | 'projectBudget' | 'cerfaObjectives' | 'cerfaDescription' | 'cerfaIndicators'
): Promise<string> => {
  let prompt = '';
  const suffix = " Réponds directement avec le texte, sans introduction, sans conclusion, et sans formatage markdown comme des astérisques.";

  switch (fieldType) {
    case 'administrativeMotivationBlock':
      prompt = "Génère un exemple de bloc de texte 'Informations administratives et motivation' pour une structure fictive française (association ou PME). Inclus son nom (fictif), SIRET (fictif), adresse, contact, une brève description de ses activités, et quelques phrases sur sa motivation pour répondre à des marchés publics. Le ton doit être professionnel et complet.";
      break;
    case 'projectSummary':
      prompt = "Génère un exemple de résumé de projet pour une structure (association ou entreprise). Le projet est fictif, par exemple un festival culturel local ou le développement d'un logiciel. Le résumé doit être concis et percutant, en 2-3 phrases.";
      break;
    case 'projectSpecifications':
      prompt = "Génère un exemple de spécifications et de déroulement pour un projet fictif (associatif ou commercial), par exemple des ateliers numériques pour seniors. Décris les étapes clés et les livrables de manière claire et structurée.";
      break;
    case 'projectMaterials':
        prompt = "Génère une liste d'exemple de matériels et moyens nécessaires pour un projet fictif (associatif ou commercial), par exemple une kermesse de quartier.";
        break;
    case 'projectBudget':
        prompt = "Génère un exemple de budget prévisionnel simple pour un projet fictif (associatif ou commercial), par exemple un tournoi sportif pour jeunes. Sépare les postes de dépenses et de recettes de manière claire.";
        break;
    case 'cerfaObjectives':
        prompt = "Génère un exemple d'objectifs d'action pour un formulaire de demande de subvention CERFA, pour un projet fictif. Les objectifs doivent être clairs, mesurables et réalistes.";
        break;
    case 'cerfaDescription':
        prompt = "Génère un exemple de description détaillée d'une action pour un formulaire de demande de subvention CERFA. Le projet est fictif. La description doit être complète et engageante.";
        break;
    case 'cerfaIndicators':
        prompt = "Génère un exemple d'indicateurs d'évaluation (quantitatifs et qualitatifs) pour un formulaire de demande de subvention CERFA, pour un projet fictif.";
        break;
    default:
        return "Type de champ non reconnu.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt + suffix,
    });
    return response.text;
  } catch (error) {
    console.error(`Erreur lors de la génération de l'exemple pour ${fieldType}:`, error);
    return "Une erreur est survenue lors de la génération de l'exemple.";
  }
};

export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const base64FromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                // Return the full data URL for use in <img> src
                resolve(reader.result);
            } else {
                reject(new Error('Échec de la lecture du fichier en chaîne base64.'));
            }
        };
        reader.onerror = error => reject(error);
    });
};

// --- Helpers for generateDossierJustifications ---
const formatFinancialsForPrompt = (financials: FinancialData[]) => {
    return financials.map(f => `Année ${f.annee}: ${f.chiffreAffaires.toLocaleString('fr-FR')}€`).join('; ');
};

const formatReferencesForPrompt = (references: Reference[]) => {
    return references.slice(0, 3).map(r => `- ${r.description} (Client: ${r.client}, Année: ${r.annee}, Montant: ${r.montant.toLocaleString('fr-FR')}€)`).join('\n');
};

export const generateDossierJustifications = async (
  marketRequirements: {
    formType: 'DC2' | 'CERFA 12156*06' | 'Autre';
    minimalRequirements: string;
    projectNature: string;
  },
  candidateProfile: OrganizationProfile
): Promise<string> => {
    const prompt = `
Tu es un expert administratif, spécialisé dans la rédaction des sections de justification de candidature pour le **Formulaire DC2 (ou CERFA de Subvention)**. Ta sortie doit être factuelle, concise et directement utilisable pour remplir les champs d'un formulaire.

**BLOC A : EXIGENCES DU MARCHÉ**
---
*   **Type de Formulaire à remplir :** ${marketRequirements.formType}
*   **Exigences Minimales OBLIGATOIRES (Éliminatoires) :** ${marketRequirements.minimalRequirements}
*   **Nature du Projet / Objet du Marché :** ${marketRequirements.projectNature}

**BLOC B : DONNÉES DU CANDIDAT (La Structure)**
---
*   **Dénomination :** ${candidateProfile.denomination}
*   **SIRET :** ${candidateProfile.siret}
*   **Chiffres d'Affaires Annuels (3 derniers ans) :** ${formatFinancialsForPrompt(candidateProfile.financials)}
*   **Références les plus Pertinentes (Max 3) :**
${formatReferencesForPrompt(candidateProfile.references)}

**BLOC C : TÂCHES DE REMPLISSAGE ET RÉDACTION**
---
Produis le contenu pour les trois sections administratives suivantes. Chaque section doit démontrer formellement la conformité au BLOC A, en utilisant les données du BLOC B.
Le résultat doit être en Markdown, avec un titre pour chaque section pour faciliter le copier-coller.
Ne fournis AUCUN texte d'introduction ou de conclusion, seulement les sections demandées.

**SECTION 1 : JUSTIFICATION DES CAPACITÉS FINANCIÈRES (Champ du DC2/CERFA)**
*   **Instruction :** Rédige un paragraphe unique. Affirme que l'exigence minimale de Chiffre d'Affaires est respectée. Si une moyenne ou un seuil minimum est exigé, utilise les données réelles du Candidat pour prouver mathématiquement le respect de cette exigence. Si l'exigence est 'CA minimum 80.000€', la réponse doit affirmer 'La structure X dispose d'un CA moyen de [Calculer la moyenne] sur les trois derniers exercices, respectant l'exigence minimale de 80.000€.'

**SECTION 2 : PRÉSENTATION DES RÉFÉRENCES (Champ du DC2/CERFA)**
*   **Instruction :** Génère un texte d'introduction à la liste des références. Ce texte doit lier les **Références les plus Pertinentes** directement à la **Nature du Projet** (BLOC A), en utilisant un langage qui met en valeur l'expérience de la structure sur le même type de prestation ou d'ampleur.

**SECTION 3 : DESCRIPTION SOMMAIRE DES MOYENS (Champ du DC2/CERFA - 'Moyens Humains et Techniques')**
*   **Instruction :** Si le Formulaire exige une description des moyens humains ou de l'organisation pour ce projet, utilise les données du Candidat pour affirmer de manière factuelle : 'L'exécution du présent projet sera assurée par les moyens humains et techniques de la structure.'
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Erreur lors de la génération des justifications de dossier :", error);
        return "Une erreur est survenue lors de la génération du contenu. Veuillez vérifier votre prompte et réessayer.";
    }
};