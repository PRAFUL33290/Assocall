// Adding interfaces for better type safety
export interface FormField {
    label: string;
    type: string;
    mode?: string[];
    required?: boolean;
    placeholder?: string;
    ai_generate?: boolean;
    options?: string[] | Record<string, any>;
    multiple?: boolean;
    start_label?: string;
    end_label?: string;
    columns?: string[];
    rows_default?: number;
    style?: string;
    action?: string;
    auto_today?: boolean;
    // For duration slider
    min?: number;
    max?: number;
    default?: number;
}

export interface FormSection {
    id: string;
    title: string;
    fields: FormField[];
}

export interface FormSchema {
    module: string;
    version: string;
    description: string;
    sections: FormSection[];
}


export const spontaneousApplicationForm: FormSchema = {
  "module": "Candidature Spontanée",
  "version": "1.0",
  "description": "Formulaire complet pour générer et envoyer une candidature à un appel à projet ou une subvention.",
  "sections": [
    {
      "id": "infos_generales",
      "title": "Informations Générales",
      "fields": [
        { "label": "Photo", "type": "image", "mode": ["upload", "ia_generate"], "required": false },
        { "label": "Nom de la structure", "type": "text", "placeholder": "Ex : Association Praful Studio", "required": true },
        { "label": "Nom du représentant légal", "type": "text", "placeholder": "Ex : Julien Guerrier", "required": true },
        { "label": "Adresse complète", "type": "text", "placeholder": "Ex : 15 rue de la Paix, 33290 Parempuyre", "required": true },
        { "label": "Téléphone", "type": "tel", "placeholder": "Ex : 06 00 00 00 00", "required": true },
        { "label": "Email", "type": "email", "placeholder": "Ex : contact@praful-studio.fr", "required": true },
        { "label": "SIRET / RNA", "type": "text", "placeholder": "Ex : 123 456 789 00012", "required": true },
        { "label": "Année de création", "type": "number", "placeholder": "Ex : 2017" },
        { "label": "Domaine d’activité", "type": "select", "options": ["Culture", "Éducation", "Sport", "Environnement", "Inclusion", "Numérique"], "multiple": true },
        { "label": "Site web", "type": "url", "placeholder": "Ex : www.praful-design.fr" },
        { "label": "Réseaux sociaux", "type": "textarea", "placeholder": "Ex : Facebook, Instagram, X" }
      ]
    },
    {
      "id": "presentation_projet",
      "title": "Présentation du Projet",
      "fields": [
        { "label": "Titre du projet", "type": "text", "placeholder": "Ex : Le Monde de l'Égalité", "required": true },
        { "label": "Slogan", "type": "text", "placeholder": "Ex : Un projet qui relie les enfants du monde" },
        { "label": "Résumé du projet", "type": "textarea", "ai_generate": true, "placeholder": "Description brève du projet (3-4 phrases)" },
        { "label": "Objectifs du projet", "type": "list", "ai_generate": true, "placeholder": "Liste d’objectifs concrets" },
        { "label": "Public ciblé", "type": "select", "options": ["Enfants", "Jeunes", "Familles", "Seniors", "Public mixte"], "multiple": true },
        { "label": "Durée du projet (en mois)", "type": "duration_slider", "min": 1, "max": 36, "default": 12 }
      ]
    },
    {
      "id": "budget_financement",
      "title": "Budget et Financement",
      "fields": [
        { "label": "Coût total estimé (€)", "type": "number", "placeholder": "Ex : 3500", "required": true },
        { "label": "Financements déjà obtenus (€)", "type": "number", "placeholder": "Ex : 1500" },
        { "label": "Montant sollicité (€)", "type": "number", "placeholder": "Ex : 2000" },
        {
          "label": "Détail des dépenses principales",
          "type": "table",
          "columns": ["Poste de dépense", "Montant (€)", "Description"],
          "rows_default": 3
        },
        {
          "label": "Texte automatique de demande de financement",
          "type": "textarea",
          "ai_generate": true,
          "placeholder": "Ex : Nous sollicitons un financement de ..."
        }
      ]
    },
    {
      "id": "conditions_delais",
      "title": "Conditions et Délais",
      "fields": [
        { "label": "Date limite de candidature", "type": "date" },
        { "label": "Conditions particulières", "type": "textarea", "placeholder": "Ex : Répondre avant le 31 décembre 2025, projet démarrant sous 6 mois" },
        {
          "label": "Engagement de respect des conditions",
          "type": "checkbox",
          "options": ["J’accepte et je m’engage à respecter les conditions de l’appel à projet."]
        }
      ]
    },
    {
      "id": "impact_evaluation",
      "title": "Impact et Évaluation",
      "fields": [
        {
          "label": "Méthodes d’évaluation",
          "type": "textarea",
          "ai_generate": true,
          "placeholder": "Ex : Nombre de participants, satisfaction, retour public..."
        },
        {
          "label": "Objectifs mesurables",
          "type": "list",
          "placeholder": "Ex : 100 enfants participants, 3 spectacles réalisés, 1 podcast produit"
        }
      ]
    },
    {
      "id": "partenaires_soutiens",
      "title": "Partenaires et Soutiens",
      "fields": [
        { "label": "Partenaires", "type": "list", "placeholder": "Ex : École Arc-en-Ciel, Ville de Parempuyre, Centre Culturel" },
        { "label": "Logo des partenaires", "type": "image_list", "mode": ["upload", "url"] }
      ]
    },
    {
      "id": "documents_joins",
      "title": "Pièces Jointes",
      "fields": [
        { "label": "Logo de l’association", "type": "image", "mode": ["upload", "url"] },
        { "label": "Statuts ou Kbis", "type": "file", "mode": ["upload"] },
        { "label": "Attestation d’assurance", "type": "file", "mode": ["upload"] },
        { "label": "Mémoire technique", "type": "textarea", "ai_generate": true },
        { "label": "Autres documents", "type": "file_list", "mode": ["upload"] }
      ]
    },
    {
      "id": "signature",
      "title": "Signature et Engagement",
      "fields": [
        { "label": "Nom du signataire", "type": "text", "placeholder": "Nom et prénom du représentant légal" },
        { "label": "Date de signature", "type": "date", "auto_today": true },
        { "label": "Signature", "type": "image", "mode": ["upload", "draw"] }
      ]
    },
    {
      "id": "export_envoi",
      "title": "Export & Envoi",
      "fields": [
        {
            "label": "Choisir la mairie destinataire",
            "type": "select_mairie",
            "placeholder": "Sélectionnez une mairie pour l'envoi",
            "required": true
        },
        {
          "label": "Exporter en PDF",
          "type": "action_button",
          "style": "secondary",
          "action": "generate_pdf"
        },
        {
          "label": "Exporter en PDF et Envoyer",
          "type": "action_button",
          "style": "primary",
          "action": "generate_pdf_and_send"
        }
      ]
    }
  ]
};