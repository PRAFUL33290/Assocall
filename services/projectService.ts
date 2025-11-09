import { Project } from '../types';

const PROJECTS_KEY = 'assoCall-userProjects';

/**
 * Saves the user's project list to the browser's localStorage.
 * @param projects The list of projects to save.
 */
export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Échec de la sauvegarde des projets :", error);
  }
};

/**
 * Loads the user's project list from localStorage.
 * Returns an empty array if none is found or if there's an error.
 */
export const loadProjects = (): Project[] => {
  try {
    const projectsJSON = localStorage.getItem(PROJECTS_KEY);
    if (projectsJSON) {
      return JSON.parse(projectsJSON);
    }
  } catch (error)
 {
    console.error("Échec du chargement des projets :", error);
  }
  return [];
};