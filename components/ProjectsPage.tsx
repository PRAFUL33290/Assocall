import React, { useState, useEffect, useMemo } from 'react';
import { SearchIcon, CalendarIcon, LoadingSpinner, EmailIcon } from './icons';
// Fix: Import 'UserRole' to resolve type errors.
import { PublicProject, SubscriptionPlan, UserRole, FunderContact, StructureType } from '../types';
import { findPublicProjects } from '../services/geminiService';
import { initialPublicProjects } from '../data/initialProjects';


const PROJECTS_CACHE_KEY = 'assoCall-foundProjects';
const MIN_PRICE_FILTER_CACHE_KEY = 'assoCall-minPriceFilter';
const FREE_PLAN_SEARCH_LIMIT = 3;
const ANONYMOUS_SEARCH_LIMIT = 2;


// --- SUB-COMPONENTS ---

const ProjectCard: React.FC<{ project: PublicProject; onSelect: () => void }> = ({ project, onSelect }) => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full">
    <div className="flex-grow">
      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${project.status === 'Ouvert' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {project.status}
      </span>
      <h3 className="mt-4 font-poppins font-bold text-gray-500 text-sm">{project.issuingBody} - {project.region}</h3>
      <p className="mt-1 font-poppins font-bold text-lg text-gray-800">{project.title}</p>
      <p className="mt-2 text-sm text-gray-600"><strong>Thématique:</strong> {project.theme}</p>
      <p className="text-sm text-gray-600"><strong>Montant:</strong> {project.grantAmount}</p>
      
      {project.eligibleStructures && project.eligibleStructures.length > 0 && (
          <div className="mt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Éligibilité :</p>
              <div className="flex flex-wrap gap-1 mt-1">
                  {project.eligibleStructures.map(structure => (
                      <span key={structure} className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-asso-blue">
                          {structure}
                      </span>
                  ))}
              </div>
          </div>
      )}

    </div>
    <div className="mt-6 flex flex-col justify-end flex-grow">
      <p className="text-sm text-gray-500 flex items-center"><CalendarIcon /> <span className="ml-1">Date limite: {new Date(project.deadline).toLocaleDateString('fr-FR')}</span></p>
      <button onClick={onSelect} className="mt-4 w-full bg-asso-blue text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition" style={{ borderRadius: '10px' }}>
        Voir les détails
      </button>
    </div>
  </div>
);

const ContactInfoBlock: React.FC<{
    user: { subscriptionPlan: SubscriptionPlan } | null;
    funderContact?: FunderContact;
}> = ({ user, funderContact }) => {
    
    if (!funderContact || !Object.values(funderContact).some(v => v && String(v).trim())) {
        return null; // Don't render anything if there's no contact info at all
    }

    const isPaidUser = user && (user.subscriptionPlan === SubscriptionPlan.ESSENTIAL || user.subscriptionPlan === SubscriptionPlan.PRO);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
        window.scrollTo(0, 0);
    };

    const lockedView = (title: string, text: string, buttonText: string, href: string) => (
        <div className="p-4 bg-white rounded-lg border">
            <h3 className="font-poppins font-bold text-xl text-gray-800 mb-3 text-center">Contact du Financeur</h3>
            <div className="relative">
                <div className="bg-gray-50 p-4 rounded-lg blur-sm select-none space-y-1">
                    <p className="font-semibold text-gray-700"><strong>Nom :</strong> John Doe</p>
                    <p className="text-gray-700"><strong>Email :</strong> contact.financeur@email.fr</p>
                    <p className="text-gray-700"><strong>Tél :</strong> 01 23 45 67 89</p>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg p-4 text-center">
                    <h4 className="font-bold text-gray-800">{title}</h4>
                    <p className="text-sm text-gray-600 my-2 max-w-xs">{text}</p>
                    <a href={href} onClick={(e) => handleNavClick(e, href)} className="inline-block bg-asso-green text-white font-bold py-2 px-4 rounded-lg text-sm hover:opacity-90 transition">
                        {buttonText}
                    </a>
                </div>
            </div>
        </div>
    );
    
    // User is NOT logged in
    if (!user) {
        return lockedView(
            'Accès Restreint',
            'Créez un compte gratuit pour débloquer les coordonnées du financeur.',
            'Créer un compte',
            '#/signup'
        );
    }

    // User is on FREE plan
    if (user.subscriptionPlan === SubscriptionPlan.FREE) {
        return lockedView(
            'Fonctionnalité Premium',
            'Passez à un plan supérieur pour accéder aux contacts directs.',
            'Voir les abonnements',
            '#/tarifs'
        );
    }

    // User is on a PAID plan
    if (isPaidUser) {
        return (
             <div className="p-4 bg-white rounded-lg border">
                <h3 className="font-poppins font-bold text-xl text-gray-800 mb-3">Contact du Financeur</h3>
                <div className="space-y-2 text-sm text-gray-700">
                    {funderContact.name && <p><strong>Nom :</strong> {funderContact.name}</p>}
                    {funderContact.email && (
                        <div className="flex items-center gap-2 font-semibold">
                            <EmailIcon />
                            <a href={`mailto:${funderContact.email}`} className="text-asso-blue hover:underline break-all">{funderContact.email}</a> 
                            <span className="text-xs text-asso-green">(préféré)</span>
                        </div>
                    )}
                    {funderContact.phone && <p><strong>Tél :</strong> {funderContact.phone}</p>}
                    {funderContact.address && <p><strong>Adresse :</strong> {funderContact.address}</p>}
                </div>
            </div>
        );
    }
    
    return null; // Fallback
};


const ProjectDetailPage: React.FC<{ project: PublicProject; allProjects: PublicProject[]; onBack: () => void; onSelectProject: (project: PublicProject) => void; user: { subscriptionPlan: SubscriptionPlan } | null; }> = ({ project, allProjects, onBack, onSelectProject, user }) => {
    const similarProjects = allProjects
        .filter(p => p.theme === project.theme && p.id !== project.id)
        .slice(0, 3);
        
    const isFreeUser = user?.subscriptionPlan === SubscriptionPlan.FREE;

    const handleApply = (project: PublicProject) => {
        if (isFreeUser) return;
        sessionStorage.setItem('projectToApplyFor', JSON.stringify(project));
        const isAuthenticated = !!localStorage.getItem('user');
        if (isAuthenticated) {
            window.location.hash = '#/dashboard';
        } else {
            // Redirect to sign up, user will be redirected to dashboard after
            window.location.hash = '#/signup';
        }
    };
    
    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12">
                <button onClick={onBack} className="text-asso-blue font-bold mb-8 hover:underline">
                    &larr; Retour aux résultats
                </button>
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${project.status === 'Ouvert' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {project.status}
                        </span>
                        <h1 className="font-poppins text-4xl font-bold text-gray-800 mt-4">{project.title}</h1>
                        <p className="text-lg text-gray-600 mt-2">par {project.issuingBody} ({project.region})</p>
                        
                        {project.eligibleStructures && project.eligibleStructures.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Structures éligibles</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {project.eligibleStructures.map(structure => (
                                        <span key={structure} className="px-3 py-1 text-sm font-bold rounded-full bg-asso-blue/10 text-asso-blue">
                                            {structure}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 border-t pt-8">
                            <h2 className="font-poppins text-2xl font-bold text-gray-800">Résumé</h2>
                            <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap">{project.summary}</p>
                        </div>

                         <div className="mt-8 border-t pt-8">
                            <h2 className="font-poppins text-2xl font-bold text-gray-800">Objectifs du Dispositif</h2>
                            <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap">{project.objectives}</p>
                        </div>
                        
                         <div className="mt-8 border-t pt-8">
                            <h2 className="font-poppins text-2xl font-bold text-gray-800">Conditions d'Éligibilité</h2>
                            <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap">{project.eligibility}</p>
                        </div>

                         {project.requiredSkills && (
                            <div className="mt-8 border-t pt-8">
                                <h2 className="font-poppins text-2xl font-bold text-gray-800">Compétences Requises</h2>
                                <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap">{project.requiredSkills}</p>
                            </div>
                         )}

                        <div className="mt-8 border-t pt-8">
                            <h2 className="font-poppins text-2xl font-bold text-gray-800">Pièces à Fournir</h2>
                            <ul className="mt-4 list-disc list-inside text-gray-700 space-y-2">
                                {project.requiredDocuments.map(doc => <li key={doc}>{doc}</li>)}
                            </ul>
                        </div>
                        
                        <div className="mt-8 border-t pt-8">
                             <h2 className="font-poppins text-2xl font-bold text-gray-800">Détails Clés</h2>
                             <ul className="mt-4 space-y-3">
                                 <li className="flex items-center"><strong className="w-40">Thématique</strong><span className="text-gray-700">{project.theme}</span></li>
                                 <li className="flex items-center"><strong className="w-40">Montant</strong><span className="text-gray-700">{project.grantAmount}</span></li>
                                 <li className="flex items-center"><strong className="w-40">Date de clôture</strong><span className="text-gray-700">{new Date(project.deadline).toLocaleDateString('fr-FR')}</span></li>
                             </ul>
                        </div>

                        <div className="mt-12">
                           <button 
                             onClick={() => handleApply(project)} 
                             disabled={isFreeUser}
                             title={isFreeUser ? "Fonctionnalité réservée aux abonnés" : "Ajouter à mon tableau de bord"}
                             className="inline-block text-center bg-asso-blue text-white font-bold py-3 px-6 rounded-lg text-base hover:opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed" 
                             style={{ borderRadius: '10px' }}>
                               Ajouter dans mon espace
                           </button>
                           {isFreeUser && (
                                <div className="mt-3 text-sm text-yellow-800 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                    Pour ajouter ce projet à votre tableau de bord et commencer votre candidature, veuillez <a href="#/tarifs" onClick={(e)=>{e.preventDefault(); window.location.hash='#/tarifs'}} className="font-bold underline hover:text-yellow-900">passer à un abonnement supérieur</a>.
                                </div>
                           )}
                        </div>
                    </div>
                    <aside className="lg:col-span-1">
                        <div className="bg-light-gray p-6 rounded-lg sticky top-28 space-y-6">
                            
                            <div className="p-4 bg-white rounded-lg border text-center">
                                <h3 className="font-poppins text-lg font-semibold text-gray-700">Financement Proposé</h3>
                                <p className="text-3xl font-bold text-asso-blue mt-1">{project.grantAmount}</p>
                            </div>
                            
                            <ContactInfoBlock user={user} funderContact={project.funderContact} />

                             <div>
                                <h3 className="font-poppins font-bold text-xl text-gray-800">Projets similaires</h3>
                                 <div className="mt-4 space-y-4">
                                    {similarProjects.length > 0 ? similarProjects.map(p => (
                                        <div key={p.id} className="bg-white p-4 rounded-md shadow-sm cursor-pointer hover:shadow-md" onClick={() => onSelectProject(p)}>
                                            <p className="font-bold text-asso-blue">{p.title}</p>
                                            <p className="text-sm text-gray-500">{p.issuingBody}</p>
                                        </div>
                                    )) : <p className="text-sm text-gray-500">Aucun autre projet similaire trouvé.</p>}
                                 </div>
                             </div>

                             <div className="border-t pt-6">
                                <button 
                                    onClick={() => handleApply(project)} 
                                    disabled={isFreeUser}
                                    title={isFreeUser ? "Fonctionnalité réservée aux abonnés" : "Ajouter à mon tableau de bord"}
                                    className="w-full bg-asso-blue text-white font-bold py-3 px-6 rounded-lg text-base hover:opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed" style={{ borderRadius: '10px' }}>
                                    Ajouter dans mon espace
                                </button>
                                <p className="text-sm text-gray-600 mt-3 text-center">
                                     {isFreeUser 
                                        ? "Passez à un plan payant pour utiliser cette fonctionnalité." 
                                        : "Ajoutez cet appel à projet à votre tableau de bord pour préparer votre candidature."
                                    }
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

// New sub-component for search progress visualization
const SearchProgressTracker: React.FC<{
    phaseIndex: number;
    sourceIndex: number;
    elapsedTime: number;
    sources: string[];
    priceFilter: number;
}> = ({ phaseIndex, sourceIndex, elapsedTime, sources, priceFilter }) => {
    const phases = [
        "Un instant, je lance la recherche sur le web...",
        "J'analyse les publications et les sites officiels...",
        "Je filtre les résultats pour ne garder que les plus pertinents...",
        "Je compile les informations pour vous...",
    ];

    const baseFilters = [
        'Statut : "Ouvert"',
        'Date limite : > Novembre 2025',
        'Territoire : France',
        'Pertinence : Élevée',
        'Unicité : Pas de doublons',
    ];

    const allFilters = [...baseFilters];
    if (priceFilter > 0) {
        allFilters.push(`Montant minimum : ${priceFilter.toLocaleString('fr-FR')} €`);
    }

    return (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-lg shadow-lg animate-fade-in">
            <div className="flex items-center gap-3">
                 <LoadingSpinner />
                <h3 className="text-xl font-bold font-poppins">{phases[phaseIndex]} ({elapsedTime}s)</h3>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold mb-2">J'analyse ces sources :</h4>
                    <ul className="space-y-1 text-sm h-48 overflow-y-auto pr-2">
                        {sources.map((source, index) => (
                            <li key={source} className={`flex items-center transition-colors duration-300 ${index === sourceIndex ? 'text-blue-900 font-bold' : 'text-blue-700'}`}>
                                {index === sourceIndex && <span className="animate-pulse mr-2">➡️</span>}
                                {source}
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Avec les filtres suivants :</h4>
                    <ul className="space-y-1 text-sm">
                        {allFilters.map(filter => (
                            <li key={filter} className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {filter}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


const ProjectsListPage: React.FC<{
    onSelectProject: (project: PublicProject) => void;
    onSearchSuccess: (projects: PublicProject[]) => void;
    user: { name: string; email: string; role: UserRole; subscriptionPlan: SubscriptionPlan; searchCount: number; } | null;
    onSearchPerformed: () => void;
}> = ({ onSelectProject, onSearchSuccess, user, onSearchPerformed }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState<PublicProject[]>(() => {
        if (user && (user.subscriptionPlan === SubscriptionPlan.ESSENTIAL || user.subscriptionPlan === SubscriptionPlan.PRO)) {
            const cachedProjectsJSON = localStorage.getItem(PROJECTS_CACHE_KEY);
            if (cachedProjectsJSON) {
                try {
                    const cachedProjects = JSON.parse(cachedProjectsJSON);
                    if (Array.isArray(cachedProjects) && cachedProjects.length > 0) {
                        return cachedProjects;
                    }
                } catch (e) {
                    console.error("Failed to parse cached projects", e);
                }
            }
        }
        return initialPublicProjects;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<{ text: string; type: 'info' | 'success' } | null>(null);
    
    const [searchRegion, setSearchRegion] = useState('');
    
    const [sortOrder, setSortOrder] = useState('deadline-asc');
    const [statusFilter, setStatusFilter] = useState('Ouvert');
    const [themeFilter, setThemeFilter] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    
    const [minPriceFilter, setMinPriceFilter] = useState<number>(() => {
        const storedPrice = sessionStorage.getItem(MIN_PRICE_FILTER_CACHE_KEY);
        return storedPrice ? parseInt(storedPrice, 10) : 0;
    });

    useEffect(() => {
        if (user && (user.subscriptionPlan === SubscriptionPlan.ESSENTIAL || user.subscriptionPlan === SubscriptionPlan.PRO)) {
            localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(projects));
        }
    }, [projects, user]);

    useEffect(() => {
        sessionStorage.setItem(MIN_PRICE_FILTER_CACHE_KEY, String(minPriceFilter));
    }, [minPriceFilter]);


    const priceOptions = [0, 100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000, 10000, 50000, 100000, 200000, 300000, 1000000];

    const allSources = useMemo(() => [
        // Sources nationales génériques
        "service-public.fr",
        "associations.gouv.fr",
        "data.gouv.fr",
        "Le Journal Officiel",
        "Aides-Territoires (portail national)",
        "PLACE (Portail État Français)",

        // Sources spécifiques Nouvelle-Aquitaine
        "Région Nouvelle-Aquitaine",
        "Europe en Nouvelle-Aquitaine",
        "Bpifrance Nouvelle-Aquitaine",
        "Bordeaux Métropole (Nouvelle-Aquitaine)",
        "Ville de Bordeaux (Nouvelle-Aquitaine)",
        "DRAC Nouvelle-Aquitaine",
        "DRAJES Nouvelle-Aquitaine (FDVA)",
        "ADEME Nouvelle-Aquitaine",
        "DREAL Nouvelle-Aquitaine",
        "France Active Nouvelle-Aquitaine",
        "Département de la Gironde (Nouvelle-Aquitaine)",
        "Département des Landes (Nouvelle-Aquitaine)",
        "Département de la Dordogne (Nouvelle-Aquitaine)",
        "Département de la Charente (Nouvelle-Aquitaine)",
        "Département de la Charente-Maritime (Nouvelle-Aquitaine)",
        "Département du Lot-et-Garonne (Nouvelle-Aquitaine)",
        "Département des Pyrénées-Atlantiques (Nouvelle-Aquitaine)",
        "Département de la Vienne (Nouvelle-Aquitaine)",
        "Département de la Haute-Vienne (Nouvelle-Aquitaine)",
        "Département des Deux-Sèvres (Nouvelle-Aquitaine)",
        "CAF de la Gironde (Nouvelle-Aquitaine)",
        "Agence de Développement et d’Innovation (ADI NA)",
        
        // Autres régions
        "e-marchespublics.com (Occitanie)",
        "e-marchespublics.com (Hauts-de-France)",
        "marchesonline.com (PACA)",
        "APOGE (Grand Est)",
        "francemarches.com (Île-de-France)",
        "e-marchespublics.com (Bourgogne-Franche-Comté)",
        "e-marchespublics.com (Bretagne)",
        "e-marchespublics.com (Centre-Val de Loire)",
        "e-marchespublics.com (Auvergne-Rhône-Alpes)",
        "e-marchespublics.com (Normandie)",
        "e-marchespublics.com (Pays de la Loire)",
        "e-marchespublics.com (Corse)",
    ], []);

    const [displayedSources, setDisplayedSources] = useState(allSources);
    const [searchPhaseIndex, setSearchPhaseIndex] = useState(0);
    const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);


    const [sessionSearchCount, setSessionSearchCount] = useState<number>(() => {
        if (!user) { // Only for anonymous users
            const count = sessionStorage.getItem('sessionSearchCount');
            return count ? parseInt(count, 10) : 0;
        }
        return 0;
    });

    useEffect(() => {
        let phaseInterval: number | undefined;
        let sourceInterval: number | undefined;
        let timerInterval: number | undefined;

        if (isLoading) {
            setSearchPhaseIndex(0);
            setCurrentSourceIndex(0);
            setElapsedTime(0);

            phaseInterval = window.setInterval(() => {
                setSearchPhaseIndex(prev => (prev + 1) % 4); // 4 phases
            }, 3500);

            sourceInterval = window.setInterval(() => {
                setCurrentSourceIndex(prev => (prev + 1) % displayedSources.length);
            }, 1500);
            
            timerInterval = window.setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }

        return () => {
            clearInterval(phaseInterval);
            clearInterval(sourceInterval);
            clearInterval(timerInterval);
        };
    }, [isLoading, displayedSources]);


    const projectsToFilter = projects;

    useEffect(() => {
        onSearchSuccess(projectsToFilter);
    }, [projectsToFilter, onSearchSuccess]);

    const performSearch = async (query: string) => {
        if (!user) { // Anonymous user check
            if (sessionSearchCount >= ANONYMOUS_SEARCH_LIMIT) {
                setError(`Limite de recherches atteinte.`);
                return;
            }
        } else if (user.subscriptionPlan === SubscriptionPlan.FREE && (user.searchCount || 0) >= FREE_PLAN_SEARCH_LIMIT) {
             setError(`Limite de recherches atteinte.`);
             return;
        }

        setIsLoading(true);
        setError(null);
        setInfoMessage(null);

        let projectsFoundInThisSearch = 0;
        const foundIdentifiersInStream = new Set(); 

        const handleProjectFound = (project: PublicProject) => {
             setProjects(prevProjects => {
                const identifier = `${(project.title || '').trim()}|${(project.issuingBody || '').trim()}`;
                
                // Check for duplicates from this stream and previous searches
                if (foundIdentifiersInStream.has(identifier) || prevProjects.some(p => `${(p.title || '').trim()}|${(p.issuingBody || '').trim()}` === identifier)) {
                    return prevProjects;
                }
                
                foundIdentifiersInStream.add(identifier);
                projectsFoundInThisSearch++;
                
                // This is a side-effect, but necessary for the user's requested UX
                setInfoMessage({
                    text: `J'ai trouvé une offre : "${project.title}". Je continue la recherche...`,
                    type: 'info'
                });

                return [project, ...prevProjects];
            });
        };

        try {
            await findPublicProjects(query, handleProjectFound);

            // After stream is finished
            if (!user) {
                const newCount = sessionSearchCount + 1;
                setSessionSearchCount(newCount);
                sessionStorage.setItem('sessionSearchCount', String(newCount));
            } else if (user.subscriptionPlan === SubscriptionPlan.FREE) {
                onSearchPerformed();
            }

            if (projectsFoundInThisSearch === 0) {
                setInfoMessage({ text: "Ma recherche est terminée, mais je n'ai trouvé aucune nouvelle offre correspondant à vos critères cette fois-ci.", type: 'info' });
            } else {
                setInfoMessage({ text: `Recherche terminée. J'ai trouvé ${projectsFoundInThisSearch} nouvelle(s) offre(s).`, type: 'success' });
            }
            setTimeout(() => setInfoMessage(null), 4000);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la recherche.');
            setInfoMessage(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGeneralSearch = () => {
        setDisplayedSources(allSources);
        performSearch("derniers appels à projets et subventions en France");
    };

    const handleRefinedSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchRegion) {
            setError("Veuillez sélectionner une région pour affiner la recherche.");
            setTimeout(() => setError(null), 3000);
            return;
        }
        
        const nationalSources = allSources.slice(0, 6);
        const regionalSources = allSources.slice(6);
        const selectedRegionLower = searchRegion.toLowerCase();
        
        const relevantRegionalSources = regionalSources.filter(source => {
            const sourceLower = source.toLowerCase();
            // Handle specific cases like PACA
            if (selectedRegionLower.includes('paca') || selectedRegionLower.includes('provence')) {
                return sourceLower.includes('paca');
            }
            // General case
            return sourceLower.includes(selectedRegionLower);
        });

        setDisplayedSources([...nationalSources, ...relevantRegionalSources]);

        const query = searchQuery.trim() || `appels à projets ou subventions`;
        performSearch(`${query} en ${searchRegion}`);
    };
    
    const allFrenchRegions = [
        "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", 
        "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", 
        "Île-de-France", "Normandie", "Nouvelle-Aquitaine", "Occitanie", 
        "Pays de la Loire", "Provence-Alpes-Côte d'Azur",
        "Guadeloupe", "Martinique", "Guyane", "La Réunion", "Mayotte"
    ];
    const uniqueThemes = useMemo(() => Array.from(new Set(projectsToFilter.map(p => p.theme))).sort(), [projectsToFilter]);
    const uniqueRegions = useMemo(() => Array.from(new Set(projectsToFilter.map(p => p.region))).sort(), [projectsToFilter]);


    const parseGrantAmount = (amount: string): number => {
        const numbers = amount.match(/\d+/g);
        if (!numbers) return 0;
        return Math.max(...numbers.map(Number));
    };

    const filteredAndSortedProjects = useMemo(() => {
        return [...projectsToFilter]
            .filter(p => statusFilter ? p.status === statusFilter : true)
            .filter(p => themeFilter ? p.theme === themeFilter : true)
            .filter(p => regionFilter ? p.region === regionFilter : true)
            .filter(p => parseGrantAmount(p.grantAmount) >= minPriceFilter)
            .sort((a, b) => {
                switch (sortOrder) {
                    case 'deadline-asc':
                        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                    case 'amount-desc':
                        return parseGrantAmount(b.grantAmount) - parseGrantAmount(a.grantAmount);
                    case 'title-asc':
                        return a.title.localeCompare(b.title);
                    default:
                        return 0;
                }
            });
    }, [projectsToFilter, sortOrder, statusFilter, themeFilter, regionFilter, minPriceFilter]);
    
    const resetFilters = () => {
        setSortOrder('deadline-asc');
        setStatusFilter('Ouvert');
        setThemeFilter('');
        setRegionFilter('');
        setMinPriceFilter(0);
    };

    const renderContent = () => {
        if (isLoading && projects.length === 0) {
            return (
                <div className="mt-12">
                    <SearchProgressTracker 
                        phaseIndex={searchPhaseIndex} 
                        sourceIndex={currentSourceIndex} 
                        elapsedTime={elapsedTime} 
                        sources={displayedSources}
                        priceFilter={minPriceFilter}
                    />
                </div>
            );
        }
        
        if (projects.length === 0 && !isLoading) {
            return (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-500">Aucun appel à projet à afficher.</p>
                    <p className="text-gray-400 mt-2">Utilisez la recherche IA ci-dessus pour trouver de nouvelles opportunités.</p>
                </div>
            );
        }

        if (filteredAndSortedProjects.length > 0) {
            return (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredAndSortedProjects.map(project => (
                        <ProjectCard key={project.id} project={project} onSelect={() => onSelectProject(project)} />
                    ))}
                </div>
            );
        }

        if (projects.length > 0 && filteredAndSortedProjects.length === 0 && !isLoading) {
            return (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-500">Aucun appel à projet ne correspond à vos filtres.</p>
                    <p className="text-gray-400 mt-2">Essayez de modifier vos critères ou de réinitialiser les filtres.</p>
                </div>
            );
        }
        
        return null;
    };

    const isAnonymous = !user;
    const isFreeUser = user?.subscriptionPlan === SubscriptionPlan.FREE;
    const searchesUsed = user?.searchCount || 0;
    const isAnonymousSearchDisabled = isAnonymous && sessionSearchCount >= ANONYMOUS_SEARCH_LIMIT;
    const isFreeUserSearchDisabled = isFreeUser && searchesUsed >= FREE_PLAN_SEARCH_LIMIT;
    const isSearchDisabled = isLoading || isAnonymousSearchDisabled || isFreeUserSearchDisabled;
    
    const generalSearchButtonText = (isFreeUser && !isFreeUserSearchDisabled)
        ? `Lancer la recherche (${searchesUsed + 1}/${FREE_PLAN_SEARCH_LIMIT})`
        : "Lancer la recherche";


    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12">
                 <header className="text-center mb-12">
                     <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-800">
                         Recherche d'Appels à Projets
                     </h1>
                     <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                         Trouvez de nouvelles opportunités de financement grâce à l'IA.
                     </p>
                 </header>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* --- LEFT COLUMN: SEARCH --- */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky top-28 space-y-6">
                            <div className="bg-light-gray p-6 rounded-lg space-y-4">
                                <h3 className="font-poppins font-bold text-xl text-gray-800">Recherche</h3>
                                <p className="text-sm font-semibold text-gray-700">Recherche générale</p>
                                <button
                                    onClick={handleGeneralSearch}
                                    disabled={isSearchDisabled}
                                    className="w-full bg-asso-blue text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition text-base disabled:bg-gray-400 flex items-center justify-center"
                                >
                                    {isLoading ? <LoadingSpinner /> : <SearchIcon />}
                                    <span className="ml-2">{generalSearchButtonText}</span>
                                </button>
                                <div className="pt-2">
                                    <label htmlFor="min-price-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                        Montant minimum
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            id="min-price-filter"
                                            type="range"
                                            min="0"
                                            max={priceOptions.length - 1}
                                            value={priceOptions.indexOf(minPriceFilter)}
                                            onChange={e => setMinPriceFilter(priceOptions[Number(e.target.value)])}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="text-center font-semibold text-asso-blue">
                                            À partir de {minPriceFilter.toLocaleString('fr-FR')} €
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <hr className="flex-grow border-gray-300" />
                                    <span className="px-4 text-sm font-semibold text-gray-500">OU</span>
                                    <hr className="flex-grow border-gray-300" />
                                </div>
                                 <form onSubmit={handleRefinedSearch} className="space-y-3">
                                    <p className="text-sm font-semibold text-gray-700">Recherche affinée</p>
                                    <div>
                                        <label htmlFor="search-region" className="sr-only">Région</label>
                                        <select
                                            id="search-region"
                                            value={searchRegion}
                                            onChange={e => setSearchRegion(e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asso-blue disabled:bg-gray-100"
                                            disabled={isSearchDisabled}
                                        >
                                            <option value="">Choisir une région</option>
                                            {allFrenchRegions.map(region => <option key={region} value={region}>{region}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="search-query" className="sr-only">Mots-clés (optionnel)</label>
                                        <input
                                            id="search-query"
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Ex: 'Culture...'"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asso-blue disabled:bg-gray-100"
                                            disabled={isSearchDisabled}
                                        />
                                    </div>
                                     <button
                                        type="submit"
                                        disabled={isSearchDisabled || !searchRegion}
                                        className="w-full flex justify-center items-center p-3 bg-asso-green text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                                        aria-label="Rechercher"
                                    >
                                        <SearchIcon /> <span className="ml-2">Rechercher</span>
                                    </button>
                                </form>
                            </div>
                            
                            {isFreeUserSearchDisabled && (
                                 <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="font-bold text-yellow-800">Limite de recherche atteinte</p>
                                    <p className="text-sm text-yellow-700 mt-1">Vous avez utilisé vos {FREE_PLAN_SEARCH_LIMIT} recherches gratuites. Pour continuer à explorer, passez à un plan supérieur.</p>
                                    <a href="#/tarifs" onClick={(e) => { e.preventDefault(); window.location.hash = '#/tarifs'; }} className="mt-2 inline-block bg-asso-blue text-white font-bold py-2 px-4 rounded-lg text-sm hover:opacity-90 transition">
                                        Voir les abonnements
                                    </a>
                                </div>
                             )}

                            {isAnonymousSearchDisabled && (
                                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="font-bold text-yellow-800">Limite de recherche atteinte</p>
                                    <p className="text-sm text-yellow-700 mt-1">Vous avez utilisé vos {ANONYMOUS_SEARCH_LIMIT} recherches gratuites. Pour continuer à explorer, créez un compte.</p>
                                    <a href="#/signup" onClick={(e) => { e.preventDefault(); window.location.hash = '#/signup'; }} className="mt-2 inline-block bg-asso-blue text-white font-bold py-2 px-4 rounded-lg text-sm hover:opacity-90 transition">
                                        Créer un compte
                                    </a>
                                </div>
                            )}
                        </div>
                    </aside>
                    
                    {/* --- MIDDLE COLUMN: RESULTS --- */}
                    <main className="lg:col-span-3 space-y-8">
                        {error && (
                            <div className="text-center py-10 bg-red-50 p-6 rounded-lg">
                                <p className="text-xl text-red-700 font-bold">Oops ! Une erreur est survenue.</p>
                                <p className="text-red-600 mt-2">{error}</p>
                            </div>
                        )}
                        {infoMessage && <p className={`text-center p-3 rounded-lg font-semibold mb-4 ${infoMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{infoMessage.text}</p>}
                        
                        {isLoading && projects.length > 0 && (
                            <div className="mt-0 mb-8">
                                <SearchProgressTracker 
                                    phaseIndex={searchPhaseIndex} 
                                    sourceIndex={currentSourceIndex} 
                                    elapsedTime={elapsedTime} 
                                    sources={displayedSources}
                                    priceFilter={minPriceFilter}
                                />
                            </div>
                        )}

                        {renderContent()}

                        <div className="text-center mt-12">
                            {!isLoading && isAnonymous && !isAnonymousSearchDisabled && (
                                <p className="text-sm text-gray-500 mt-3">
                                    Recherches utilisées : {sessionSearchCount} / {ANONYMOUS_SEARCH_LIMIT}
                                </p>
                            )}
                        </div>
                    </main>

                    {/* --- RIGHT COLUMN: FILTERS --- */}
                     <aside className="lg:col-span-1">
                        <div className="lg:sticky top-28 space-y-6">
                           <div className="bg-light-gray p-6 rounded-lg space-y-4">
                                <h3 className="font-poppins font-bold text-xl text-gray-800">Filtres</h3>
                                <div>
                                    <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
                                    <select id="sort-order" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asso-blue">
                                        <option value="deadline-asc">Date limite (plus proche)</option>
                                        <option value="amount-desc">Montant (plus élevé)</option>
                                        <option value="title-asc">Titre (A-Z)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                    <select id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asso-blue">
                                        <option value="">Tous</option>
                                        <option value="Ouvert">Ouvert</option>
                                        <option value="Clôturé">Clôturé</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="theme-filter" className="block text-sm font-medium text-gray-700 mb-1">Thématique</label>
                                    <select id="theme-filter" value={themeFilter} onChange={e => setThemeFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asso-blue">
                                        <option value="">Toutes</option>
                                        {uniqueThemes.map(theme => <option key={theme} value={theme}>{theme}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="region-filter" className="block text-sm font-medium text-gray-700 mb-1">Région</label>
                                    <select id="region-filter" value={regionFilter} onChange={e => setRegionFilter(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-asso-blue">
                                        <option value="">Toutes</option>
                                        {uniqueRegions.map(region => <option key={region} value={region}>{region}</option>)}
                                    </select>
                                </div>
                                <button onClick={resetFilters} className="w-full text-center bg-white text-asso-blue border-2 border-asso-blue font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition">
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

interface ProjectsPageProps {
    user: { name: string; email: string; role: UserRole; subscriptionPlan: SubscriptionPlan; searchCount: number; } | null;
    onSearchPerformed: () => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ user, onSearchPerformed }) => {
    const [allFoundProjects, setAllFoundProjects] = useState<PublicProject[]>([]);
    const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedProject]);

    const handleSelectProject = (project: PublicProject) => {
        setSelectedProject(project);
    };

    const handleSearchSuccess = (projects: PublicProject[]) => {
        setAllFoundProjects(projects);
    };

    return (
        <>
            {selectedProject ? (
                <ProjectDetailPage 
                    project={selectedProject} 
                    allProjects={allFoundProjects}
                    onBack={() => setSelectedProject(null)}
                    onSelectProject={handleSelectProject}
                    user={user}
                />
            ) : (
                <ProjectsListPage 
                    onSelectProject={handleSelectProject} 
                    onSearchSuccess={handleSearchSuccess}
                    user={user}
                    onSearchPerformed={onSearchPerformed}
                />
            )}
        </>
    );
};

export default ProjectsPage;