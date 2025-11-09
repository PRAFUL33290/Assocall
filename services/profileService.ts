import { OrganizationProfile } from '../types';

const PROFILE_KEY = 'assoCall-organizationProfile';

/**
 * Provides a default, empty structure for a new organization profile.
 */
const getDefaultProfile = (): OrganizationProfile => {
    const currentYear = new Date().getFullYear();
    return {
        denomination: '',
        siret: '',
        representantLegal: '',
        adresse: '',
        email: '',
        telephone: '',
        references: [],
        financials: [
            { annee: currentYear - 1, chiffreAffaires: 0, resultatNet: 0 },
            { annee: currentYear - 2, chiffreAffaires: 0, resultatNet: 0 },
            { annee: currentYear - 3, chiffreAffaires: 0, resultatNet: 0 },
        ],
        humanResources: {
            benevoles: 0,
            volontaires: 0,
            salaries: 0,
            emploisAides: 0,
            etpt: 0,
            personnelsDetaches: 0,
            adherents: 0,
        },
        administrativeMotivationBlock: '',
    };
};

/**
 * Saves the organization's profile to the browser's localStorage.
 * @param profile The organization profile object to save.
 */
export const saveProfile = (profile: OrganizationProfile): void => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Échec de la sauvegarde du profil :", error);
  }
};

/**
 * Loads the organization's profile from localStorage.
 * Returns a default profile if none is found.
 */
export const loadProfile = (): OrganizationProfile => {
  try {
    const profileJSON = localStorage.getItem(PROFILE_KEY);
    if (profileJSON) {
      const parsedProfile = JSON.parse(profileJSON);
      // Basic check to ensure financials and humanResources structures exist
      if (!parsedProfile.financials || parsedProfile.financials.length !== 3) {
        parsedProfile.financials = getDefaultProfile().financials;
      }
      if (!parsedProfile.humanResources) {
        parsedProfile.humanResources = getDefaultProfile().humanResources;
      }
      return parsedProfile;
    }
  } catch (error) {
    console.error("Échec du chargement du profil :", error);
  }
  return getDefaultProfile();
};

/**
 * Checks if the essential fields of an organization profile are empty.
 * @param profile The organization profile to check.
 */
export const isProfileEmpty = (profile: OrganizationProfile): boolean => {
  return !profile.denomination.trim() && !profile.siret.trim() && !profile.representantLegal.trim();
};


/**
 * Computes a summary of the organization's capabilities from the saved profile.
 * This is intended for use by the AI to generate application justifications.
 */
export const getProfileSummary = (): { name: string; averageTurnover: number; referenceCount: number; } => {
  const profile = loadProfile();
  
  const validFinancials = profile.financials
    .filter(f => f.chiffreAffaires > 0)
    .slice(0, 3);
  
  const totalTurnover = validFinancials.reduce((sum, item) => sum + item.chiffreAffaires, 0);
  
  const averageTurnover = validFinancials.length > 0 ? totalTurnover / validFinancials.length : 0;

  return {
    name: profile.denomination,
    averageTurnover: parseFloat(averageTurnover.toFixed(2)),
    referenceCount: profile.references.length,
  };
};