import React, { useState, useEffect } from 'react';
import { Project, FunderContact } from '../types';
import { getFunderContactDetails } from '../services/geminiService';
import {
    CloseIcon, CheckListIcon, BrainIcon, EuroIcon, IdentificationIcon, UserIcon, EmailIcon, PhoneIcon, LocationMarkerIcon, LoadingSpinner, DocumentTextIcon, TargetIcon, CheckBadgeIcon
} from './icons';

interface TenderDossierModalProps {
    project: Project;
    onClose: () => void;
}

const TenderDossierModal: React.FC<TenderDossierModalProps> = ({ project, onClose }) => {
    if (!project.originalTender) return null;

    const tender = project.originalTender;
    const [contactInfo, setContactInfo] = useState<FunderContact | undefined>(tender.funderContact);
    const [isFetchingContact, setIsFetchingContact] = useState(false);
    const [contactFetchError, setContactFetchError] = useState<string | null>(null);

    const hasContactInfo = contactInfo && Object.values(contactInfo).some(value => value && String(value).trim() !== '');

    useEffect(() => {
        if (!hasContactInfo && !isFetchingContact) {
            setIsFetchingContact(true);
            setContactFetchError(null);
            getFunderContactDetails(tender.issuingBody)
                .then(details => {
                    if (Object.keys(details).length > 0) {
                        setContactInfo(details);
                    }
                })
                .catch(error => {
                    console.error(error);
                    setContactFetchError("Erreur lors de la recherche des contacts.");
                })
                .finally(() => {
                    setIsFetchingContact(false);
                });
        }
    }, [tender.issuingBody, hasContactInfo, isFetchingContact]);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-3xl m-4 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <div>
                        <p className="text-sm font-semibold text-gray-500">{tender.issuingBody}</p>
                        <h2 className="text-xl font-bold text-gray-800 font-poppins">{tender.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Fermer">
                        <CloseIcon />
                    </button>
                </header>

                {/* Content */}
                <main className="p-6 overflow-y-auto space-y-8">
                    {/* Top Info Boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Funding Box */}
                        <div className="bg-asso-blue/10 p-4 rounded-lg flex items-center gap-4">
                            <div className="text-asso-blue flex-shrink-0">
                                <EuroIcon />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-asso-blue uppercase tracking-wider">Financement</p>
                                <p className="text-2xl font-bold text-gray-800">{tender.grantAmount}</p>
                            </div>
                        </div>

                        {/* Contact Box */}
                        <div className="bg-asso-green/10 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-asso-green/20 rounded-full text-asso-green">
                                    <IdentificationIcon />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 font-poppins">Contact du Financeur</h3>
                            </div>
                            {isFetchingContact ? (
                                <div className="flex items-center justify-center gap-2 text-gray-600 py-4">
                                    <LoadingSpinner />
                                    <span>Recherche des contacts...</span>
                                </div>
                            ) : contactFetchError ? (
                                <p className="text-sm text-red-600">{contactFetchError}</p>
                            ) : hasContactInfo ? (
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {contactInfo?.name && (
                                        <li className="flex items-center gap-2"><UserIcon className="h-5 w-5 text-gray-500" /> <strong>{contactInfo.name}</strong></li>
                                    )}
                                    {contactInfo?.email && (
                                        <li className="flex items-center gap-2"><EmailIcon /> <a href={`mailto:${contactInfo.email}`} className="text-asso-blue hover:underline break-all">{contactInfo.email}</a></li>
                                    )}
                                    {contactInfo?.phone && (
                                        <li className="flex items-center gap-2"><PhoneIcon /> {contactInfo.phone}</li>
                                    )}
                                    {contactInfo?.address && (
                                        <li className="flex items-start gap-2"><LocationMarkerIcon /> {contactInfo.address}</li>
                                    )}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-600">Aucune information de contact direct n'a pu être trouvée.</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Section Résumé */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-asso-blue/10 rounded-full text-asso-blue">
                                <DocumentTextIcon />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 font-poppins">Résumé</h3>
                        </div>
                        <div className="bg-light-gray p-4 rounded-lg border">
                            <p className="text-gray-700 whitespace-pre-wrap">{tender.summary}</p>
                        </div>
                    </section>

                    {/* Section Objectifs */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-asso-blue/10 rounded-full text-asso-blue">
                                <TargetIcon />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 font-poppins">Objectifs</h3>
                        </div>
                        <div className="bg-light-gray p-4 rounded-lg border">
                            <p className="text-gray-700 whitespace-pre-wrap">{tender.objectives}</p>
                        </div>
                    </section>

                    {/* Section Éligibilité */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-asso-blue/10 rounded-full text-asso-blue">
                                <CheckBadgeIcon />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 font-poppins">Conditions d'Éligibilité</h3>
                        </div>
                        <div className="bg-light-gray p-4 rounded-lg border">
                            <p className="text-gray-700 whitespace-pre-wrap">{tender.eligibility}</p>
                        </div>
                    </section>

                    {/* Section Documents */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-asso-blue/10 rounded-full text-asso-blue">
                                <CheckListIcon />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 font-poppins">Pièces à Fournir</h3>
                        </div>
                        {tender.requiredDocuments && tender.requiredDocuments.length > 0 ? (
                            <ul className="list-none space-y-2 pl-4 border-l-2 border-asso-blue/30">
                                {tender.requiredDocuments.map((doc, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="w-5 h-5 text-asso-green mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span className="text-gray-700">{doc}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 pl-4 border-l-2 border-gray-300">Aucun document spécifique n'a été listé. Assurez-vous de fournir les pièces standards (Statuts, Kbis, RIB, etc.).</p>
                        )}
                    </section>

                    {/* Section Skills */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                             <div className="p-3 bg-asso-green/10 rounded-full text-asso-green">
                                <BrainIcon />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 font-poppins">Compétences Requises</h3>
                        </div>
                         <div className="bg-light-gray p-4 rounded-lg border">
                            {tender.requiredSkills ? (
                                <p className="text-gray-700 whitespace-pre-wrap">{tender.requiredSkills}</p>
                            ) : (
                                <p className="text-gray-600">Aucune compétence spécifique n'est explicitement requise. Mettez en avant les compétences de votre structure en lien avec les objectifs du projet.</p>
                            )}
                         </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="p-4 bg-gray-50 border-t flex justify-end flex-shrink-0">
                    <button 
                        onClick={onClose}
                        className="bg-asso-blue text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition"
                    >
                        Fermer
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default TenderDossierModal;