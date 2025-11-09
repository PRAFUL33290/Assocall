import { UserDocument } from '../types';

const DOCUMENTS_KEY = 'assoCall-userDocuments';

/**
 * Saves the user's document list to the browser's localStorage.
 * @param documents The list of documents to save.
 */
export const saveDocuments = (documents: UserDocument[]): void => {
  try {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
  } catch (error) {
    console.error("Échec de la sauvegarde des documents :", error);
  }
};

/**
 * Loads the user's document list from localStorage.
 * Returns an empty array if none is found or if there's an error.
 */
export const loadDocuments = (): UserDocument[] => {
  try {
    const documentsJSON = localStorage.getItem(DOCUMENTS_KEY);
    if (documentsJSON) {
      return JSON.parse(documentsJSON);
    }
  } catch (error) {
    console.error("Échec du chargement des documents :", error);
  }
  return [];
};