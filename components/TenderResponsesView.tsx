import React, { useState } from 'react';
import { Project } from '../types';
import TenderDossierModal from './TenderDossierModal';

interface TenderResponsesViewProps {
    projects: Project[];
}

const TenderResponsesView: React.FC<TenderResponsesViewProps> = ({ projects }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const tenderResponses = projects.filter(p => p.originalTender);

    if (tenderResponses.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-lg shadow-md border">
                <h2 className="text-2xl font-bold text-gray-800 font-poppins">Aucune réponse en cours</h2>
                <p className="mt-2 text-gray-600">
                    Pour commencer, trouvez un appel d'offres et ajoutez-le à votre espace.
                </p>
                <a href="#/projets" onClick={(e) => { e.preventDefault(); window.location.hash = '#/projets'; }} className="mt-6 inline-block bg-asso-blue text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition">
                    Trouver un appel d'offres
                </a>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8 animate-fade-in">
                <header>
                    <h2 className="text-2xl font-bold font-poppins text-gray-800">Mes Réponses aux Appels d'Offres</h2>
                    <p className="text-gray-600 mt-1">Suivez ici l'avancement de vos candidatures.</p>
                </header>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tenderResponses.map(project => (
                        <div key={project.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500">{project.originalTender?.issuingBody}</p>
                                <h3 className="text-lg font-bold font-poppins text-gray-800 mt-2">{project.title}</h3>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-500">Date limite : {project.originalTender ? new Date(project.originalTender.deadline).toLocaleDateString('fr-FR') : 'N/A'}</p>
                                <button
                                    onClick={() => setSelectedProject(project)}
                                    className="mt-4 w-full bg-asso-green text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition"
                                >
                                    Ouvrir le dossier
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedProject && (
                <TenderDossierModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
        </>
    );
};

export default TenderResponsesView;