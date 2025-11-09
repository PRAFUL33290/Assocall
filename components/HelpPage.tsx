import React from 'react';
import { ArrowUpRightIcon } from './icons';

interface HelpLink {
    label: string;
    url: string;
}

interface HelpItem {
    title: string;
    links: HelpLink[];
    remarks: string;
}

const helpData: { category: string; items: HelpItem[] }[] = [
    {
        category: "Formulaires de Candidature",
        items: [
            {
                title: "DC1 – Lettre de candidature",
                links: [
                    { label: "PDF officiel (economie.gouv.fr)", url: "https://www.economie.gouv.fr/files/files/directions_services/daj/marches_publics/formulaires/DC/dc1.pdf?utm_source=chatgpt.com" },
                    { label: "Modèle DOC (economie.gouv.fr)", url: "https://www.economie.gouv.fr/files/directions_services/daj/marches_publics/formulaires/DC/imprimes_dc/DC1-2019.doc?utm_source=chatgpt.com" }
                ],
                remarks: "Modèle officiel DAJ (Min. Économie)."
            },
            {
                title: "DC2 – Déclaration du candidat",
                links: [
                    { label: "Modèle DOC (economie.gouv.fr)", url: "https://www.economie.gouv.fr/files/directions_services/daj/marches_publics/formulaires/DC/imprimes_dc/DC2-2019.doc?utm_source=chatgpt.com" },
                    { label: "Notice PDF", url: "https://www.economie.gouv.fr/files/directions_services/daj/marches_publics/formulaires/DC/notices_dc/notice-dc2-2019.pdf?utm_source=chatgpt.com" }
                ],
                remarks: "Modèle officiel DAJ."
            },
             {
                title: "Déclaration de sous-traitance (DC4)",
                links: [
                    { label: "Modèle DOCX (2023+)", url: "https://www.economie.gouv.fr/files/files/directions_services/daj/marches_publics/formulaires/DC/imprimes_dc/DC4_2023_Duree_contrat_sous_traitance.docx?utm_source=chatgpt.com" },
                    { label: "Notice PDF", url: "https://www.economie.gouv.fr/files/files/directions_services/daj/marches_publics/formulaires/DC/notices_dc/20190313-NoticeDC4-maj20231027.pdf?utm_source=chatgpt.com" }
                ],
                remarks: "Nouveau modèle (2023+)."
            },
        ]
    },
    {
        category: "Formulaires d'Attribution",
         items: [
            {
                title: "Acte d’engagement (ATTRI1)",
                links: [
                    { label: "Modèle DOC (economie.gouv.fr)", url: "https://www.economie.gouv.fr/files/files/directions_services/daj/marches_publics/formulaires/ATTRI/imprimes_attri/ATTRI1-2019.doc?utm_source=chatgpt.com" },
                    { label: "Notice PDF", url: "https://www.economie.gouv.fr/files/files/directions_services/daj/marches_publics/formulaires/ATTRI/notices_attri/notice-attri1-2019.pdf?utm_source=chatgpt.com" }
                ],
                remarks: "Utilisé par l’acheteur pour conclure le marché."
            },
            {
                title: "Acte spécial présenté au dépôt de l’offre (ATTRI2)",
                links: [
                    { label: "Page officielle DAJ (economie.gouv.fr)", url: "https://www.economie.gouv.fr/daj/les-formulaires-dattribution-des-marches?utm_source=chatgpt.com" }
                ],
                remarks: "Modèle officiel DAJ."
            }
        ]
    },
     {
        category: "Justificatifs & Attestations",
        items: [
             {
                title: "Déclaration sur l’honneur de non-exclusion",
                links: [
                    { label: "Inclus dans le formulaire DC1", url: "https://www.economie.gouv.fr/files/files/directions_services/daj/marches_publics/formulaires/DC/dc1.pdf?utm_source=chatgpt.com" }
                ],
                remarks: "Si demandé séparément : attestation libre possible selon R2143-6."
            },
            {
                title: "Kbis / justificatif d’habilitation",
                links: [
                    { label: "Obtenir un Kbis (Infogreffe)", url: "https://infogreffe.fr/kbis-documents/extrait-kbis?utm_source=chatgpt.com" },
                    { label: "Infos RNE/INPI", url: "https://www.inpi.fr/ressources/formalites-dentreprises/documents-justifiant-lexistence-dune-entreprise?utm_source=chatgpt.com" }
                ],
                remarks: "Le Kbis s’obtient via Infogreffe (désormais raccordé au RNE/INPI)."
            },
            {
                title: "Attestation URSSAF (vigilance < 6 mois)",
                links: [
                    { label: "Page officielle (urssaf.fr)", url: "https://www.urssaf.fr/accueil/attestation-vigilance.html?utm_source=chatgpt.com" }
                ],
                remarks: "À télécharger dans votre espace (indépendant/entreprise)."
            },
            {
                title: "Attestation de régularité fiscale",
                links: [
                    { label: "Formulaire 3666-SD (impots.gouv.fr)", url: "https://www.impots.gouv.fr/formulaire/3666-sd/attestation-de-regularite-fiscale?utm_source=chatgpt.com" },
                    { label: "Tutoriel Espace Pro", url: "https://www.impots.gouv.fr/professionnel/questions/comment-obtenir-une-attestation-de-regularite-fiscale?utm_source=chatgpt.com" }
                ],
                remarks: "Si IS+TVA, disponible en ligne via espace pro."
            },
             {
                title: "SIRET / SIREN (preuve d’immatriculation)",
                links: [
                    { label: "Avis de situation Sirene (insee.fr)", url: "https://avis-situation-sirene.insee.fr/?utm_source=chatgpt.com" }
                ],
                remarks: "Gratuit, téléchargeable en PDF."
            },
            {
                title: "Numéro de TVA intracommunautaire",
                links: [
                    { label: "Infos (impots.gouv.fr)", url: "https://www.impots.gouv.fr/professionnel/questions/lattribution-dun-numero-de-tva-intracommunaire-est-elle-payante?utm_source=chatgpt.com" },
                    { label: "Vérification VIES (UE)", url: "https://ec.europa.eu/taxation_customs/vies/?utm_source=chatgpt.com" }
                ],
                remarks: "Attribué par votre SIE (gratuit)."
            },
             {
                title: "RIB",
                links: [],
                remarks: "À télécharger depuis votre banque / espace client. Pas de modèle officiel public."
            }
        ]
    },
    {
        category: "Pièces du Dossier de Réponse",
        items: [
            {
                title: "Mémoire technique",
                links: [
                    { label: "Guide bonnes pratiques DAJ (PDF)", url: "https://www.economie.gouv.fr/files/files/directions_services/daj/marches_publics/conseil_acheteurs/guides/guide-bonnes-pratiques-mp.pdf?utm_source=chatgpt.com" },
                    { label: "Fiche pratique (marche-public.fr)", url: "https://www.marche-public.fr/Marches-publics/Definitions/Entrees/Memoire-technique.htm?utm_source=chatgpt.com" }
                ],
                remarks: "Le cadre est souvent fourni dans le DCE (CMT/CRT)."
            },
            {
                title: "Références professionnelles / capacités",
                links: [
                     { label: "Repères DAJ (marche-public.fr)", url: "https://www.marche-public.fr/Marches-publics/Definitions/Entrees/Memoire-technique.htm?utm_source=chatgpt.com" }
                ],
                remarks: "Pas de modèle officiel (fournir tableau maison). Joindre contacts/attestations si possible."
            },
            {
                title: "Chiffre d’affaires & effectifs",
                links: [],
                remarks: "Pas de modèle officiel (extrait bilan/compte de résultat). Souvent à indiquer dans DC2 + annexes."
            },
            {
                title: "Bordereau de prix (BPU), DQE, DPGF",
                links: [
                    { label: "Guide du prix DAJ (PDF)", url: "https://www.economie.gouv.fr/files/files/directions_services/daj/marches_publics/oecp/guide_prix/Guideprix2023_20230929_VF_chap2.pdf?utm_source=chatgpt.com" },
                    { label: "Fiches BPU/DQE (marche-public.fr)", url: "https://www.marche-public.fr/Marches-publics/Definitions/Entrees/BPU.htm?utm_source=chatgpt.com" }
                ],
                remarks: "Les modèles sont fournis par l’acheteur dans le DCE."
            }
        ]
    },
     {
        category: "Pièces du Marché (fournies par l'acheteur)",
        items: [
             {
                title: "Cahier des charges (RC, CCAP, CCTP)",
                links: [
                    { label: "Pages officielles CCAG (economie.gouv.fr)", url: "https://www.economie.gouv.fr/daj/commande-publique/reglementation-de-la-commande-publique/cahiers-des-clauses-administratives?utm_source=chatgpt.com" }
                ],
                remarks: "Les RC/CCAP/CCTP sont propres au marché et fournis dans le DCE."
            }
        ]
    },
    {
        category: "Obligations Spécifiques (Marchés de Travaux...)",
        items: [
            {
                title: "Liste des salariés étrangers",
                links: [
                    { label: "Base légale (legifrance.gouv.fr)", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000046078939?utm_source=chatgpt.com" }
                ],
                remarks: "Modèle souvent fourni par l’acheteur ; à défaut, attestation/liste sur votre papier-entête."
            },
            {
                title: "Attestation de visite (si exigée)",
                links: [],
                remarks: "Fourni par l’acheteur dans le DCE / via la plateforme de consultation. À faire signer/viser le jour de la visite."
            }
        ]
    }
];

const HelpItemCard: React.FC<{ item: HelpItem }> = ({ item }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md flex flex-col">
        <h3 className="font-poppins font-bold text-asso-blue">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-700 flex-grow">{item.remarks}</p>
        {item.links.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                {item.links.map((link, index) => (
                    <a 
                        key={index}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-gray-800 font-semibold hover:text-asso-blue group"
                    >
                        {link.label} 
                        <ArrowUpRightIcon className="h-4 w-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                ))}
            </div>
        )}
    </div>
);


const HelpPage: React.FC = () => {
    return (
        <div className="bg-white">
            <section className="bg-light-gray py-20 text-center">
                <div className="container mx-auto px-6 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-800">
                        Aide et Ressources
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Retrouvez ici la liste des documents et formulaires officiels fréquemment demandés lors des candidatures, avec des liens directs pour les obtenir.
                    </p>
                </div>
            </section>
            
            <section className="container mx-auto px-6 py-20">
                <div className="space-y-12">
                    {helpData.map((section, index) => (
                        <div key={index}>
                            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-gray-800 mb-6 pb-2 border-b-2 border-asso-blue/50">
                                {section.category}
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {section.items.map((item, itemIndex) => (
                                    <HelpItemCard key={itemIndex} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="mt-20 text-center bg-blue-50 p-8 rounded-lg border border-blue-200">
                    <h3 className="font-poppins font-bold text-xl text-gray-800">Note Importante</h3>
                    <p className="mt-2 text-gray-700 max-w-3xl mx-auto">
                        Cette liste est un aide-mémoire et n'est pas exhaustive. Référez-vous toujours au Règlement de Consultation (RC) et au Dossier de Consultation des Entreprises (DCE) de chaque appel d'offres pour connaître la liste exacte des pièces exigées.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HelpPage;