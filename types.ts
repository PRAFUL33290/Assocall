// Fix: Import `ReactElement` and use it for the icon type to resolve the 
// "Cannot find namespace 'JSX'" error in .ts files.
import type { ReactElement } from 'react';

export enum DashboardView {
  MY_PROJECTS,
  RESEARCH_ASSISTANT,
  MY_DOCUMENTS,
  SUBSCRIPTION,
  PROFILE,
  TENDER_RESPONSES,
  MUNICIPALITIES,
}

export enum UserRole {
  ASSOCIATION = 'association',
  ENTREPRISE = 'entreprise',
  MAIRIE = 'mairie',
  ADMIN = 'administrateur',
}

export enum SubscriptionPlan {
  FREE = 'free',
  ESSENTIAL = 'essential',
  PRO = 'pro',
}

// Fix: Added PaymentMethod enum to resolve type errors.
export enum PaymentMethod {
    STRIPE = 'stripe',
}

export interface NavItem {
  id: DashboardView;
  label: string;
  icon: ReactElement;
}

export interface OfficialDocument {
  name: string;
  description: string;
  url: string;
}

export interface Project {
  id: string; // Using string for UUIDs
  title: string;
  summary: string;
  specifications: string;
  materials: string;
  budget: string;
  generatedImage?: string; // base64 string
  uploadedImage?: string; // base64 string for user-uploaded image
  originalTender?: PublicProject; // Store the context of the original tender
  officialDocuments?: OfficialDocument[];
  cerfa?: {
    objectifs: string;
    description: string;
    indicateurs: string;
  };
  dossierContent?: string; // To store the result from the dossier generator
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GroundingChunk {
  web?: {
    // Fix: Made uri and title optional to match the library's type.
    uri?: string;
    title?: string;
  };
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface Municipality {
  commune: string;
  adresse: string;
  telephone: string;
  email: string;
  siteWeb: string;
}

export interface FunderContact {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export enum StructureType {
  ASSOCIATION = 'Association',
  ENTREPRISE = 'Entreprise',
  MAIRIE = 'Mairie/Collectivité',
  AUTRE = 'Autre',
}

export interface PublicProject {
  id: string; // UUID generated on the client
  issuingBody: string; // Organisme émetteur
  title: string;
  theme: string;
  grantAmount: string; // Montant de la subvention (texte libre)
  deadline: string; // Date limite (YYYY-MM-DD)
  region: string;
  status: 'Ouvert' | 'Clôturé';
  summary: string;
  objectives: string;
  eligibility: string; // Conditions d'éligibilité
  requiredSkills?: string; // Compétences requises
  requiredDocuments: string[]; // Pièces à fournir
  officialLink: string;
  funderContact?: FunderContact;
  eligibleStructures?: StructureType[];
}

// --- User Document Library ---
export interface UserDocument {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadDate: string;
}

// --- Organization Data Vault Types ---

export interface FinancialData {
  annee: number;
  chiffreAffaires: number;
  resultatNet: number;
}

export interface Reference {
  id: string; // UUID
  client: string;
  montant: number;
  annee: number;
  description: string;
}

export interface HumanResources {
    benevoles: number;
    volontaires: number;
    salaries: number;
    emploisAides: number;
    etpt: number;
    personnelsDetaches: number;
    adherents: number;
}

export interface OrganizationProfile {
  denomination: string;
  siret: string;
  representantLegal: string;
  adresse: string;
  email: string;
  telephone: string;
  references: Reference[];
  financials: FinancialData[];
  humanResources: HumanResources;
  administrativeMotivationBlock?: string;
}

// --- Dossier Generator Types ---

export enum DocumentStatus {
  NOT_STARTED = 'Non commencé',
  IN_PROGRESS = 'À compléter',
  COMPLETED = 'Terminé',
}

export enum DocumentType {
  MANDATORY = 'Obligatoire',
  COMPLEMENTARY = 'Complémentaire',
}

export interface ManagedDocument {
  id: string;
  name: string;
  status: DocumentStatus;
  type: DocumentType;
  icon: string; // emoji
}

export interface Dossier {
    id: string;
    tenderName: string;
    status: 'en cours' | 'soumis' | 'archivé';
    completionPercentage: number;
    deadline: string;
    lastUpdated: string;
    documents: ManagedDocument[];
}