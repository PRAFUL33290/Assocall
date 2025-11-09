import React, { useState, useEffect, useMemo } from 'react';
import { Dossier, ManagedDocument, DocumentStatus, DocumentType } from '../types';
import { LoadingSpinner } from './icons';

// --- MOCK DATA ---
const initialDossier: Dossier = {
  id: 'dossier-1',
  tenderName: "Appel d'offre : Création d'un Tiers-Lieu Numérique",
  status: 'en cours',
  completionPercentage: 0,
  deadline: '2025-12-12',
  lastUpdated: 'il y a 10 minutes',
  documents: [
    { id: 'doc-1', name: 'DUME (Candidature officielle)', status: DocumentStatus.IN_PROGRESS, type: DocumentType.MANDATORY, icon: '🧾' },
    { id: 'doc-2', name: 'Acte d’engagement (ATTRI1)', status: DocumentStatus.NOT_STARTED, type: DocumentType.MANDATORY, icon: '✍️' },
    { id: 'doc-3', name: 'Bordereau de prix / Devis global', status: DocumentStatus.COMPLETED, type: DocumentType.MANDATORY, icon: '💶' },
    { id: 'doc-4', name: 'DC4 (Sous-traitance)', status: DocumentStatus.NOT_STARTED, type: DocumentType.MANDATORY, icon: '🤝' },
    { id: 'doc-5', name: 'Mémoire technique / Méthodologie', status: DocumentStatus.IN_PROGRESS, type: DocumentType.COMPLEMENTARY, icon: '📚' },
    { id: 'doc-6', name: 'Références / expériences passées', status: DocumentStatus.NOT_STARTED, type: DocumentType.COMPLEMENTARY, icon: '🧠' },
    { id: 'doc-7', name: 'Attestations fiscales et sociales', status: DocumentStatus.NOT_STARTED, type: DocumentType.COMPLEMENTARY, icon: '🧾' },
    { id: 'doc-8', name: 'Kbis ou Statuts', status: DocumentStatus.COMPLETED, type: DocumentType.COMPLEMENTARY, icon: '🏛️' },
  ],
};

// --- SUB-COMPONENTS ---
const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div className="bg-asso-green h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
  </div>
);

const StatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => {
  const statusClasses = {
    [DocumentStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [DocumentStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [DocumentStatus.NOT_STARTED]: 'bg-red-100 text-red-800',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>{status}</span>;
};

const DocumentRow: React.FC<{ doc: ManagedDocument; onAiFill: (docName: string) => void; onStatusChange: (docId: string) => void; }> = ({ doc, onAiFill, onStatusChange }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAiClick = () => {
        setIsGenerating(true);
        onAiFill(doc.name);
        // Simulate AI generation
        setTimeout(() => {
            onStatusChange(doc.id);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <tr className="bg-white border-b">
            <td className="px-4 py-3 text-2xl">{doc.icon}</td>
            <td className="px-4 py-3 font-medium text-gray-900">{doc.name}</td>
            <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
            <td className="px-4 py-3">
                {doc.status !== DocumentStatus.COMPLETED ? (
                    <button 
                        onClick={handleAiClick}
                        disabled={isGenerating}
                        className="bg-asso-blue/10 text-asso-blue font-bold py-2 px-3 rounded-lg text-sm hover:bg-asso-blue/20 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center w-40"
                    >
                        {isGenerating ? <><LoadingSpinner /> Remplissage...</> : 'Remplir avec l’IA'}
                    </button>
                ) : (
                    <button className="bg-gray-100 text-gray-600 font-bold py-2 px-3 rounded-lg text-sm">Modifier</button>
                )}
            </td>
        </tr>
    );
};


// --- MAIN COMPONENT ---
const DossierGenerator: React.FC = () => {
  const [dossier, setDossier] = useState<Dossier>(initialDossier);

  const mandatoryDocs = useMemo(() => dossier.documents.filter(d => d.type === DocumentType.MANDATORY), [dossier.documents]);
  const complementaryDocs = useMemo(() => dossier.documents.filter(d => d.type === DocumentType.COMPLEMENTARY), [dossier.documents]);

  useEffect(() => {
    const completedDocs = dossier.documents.filter(d => d.status === DocumentStatus.COMPLETED).length;
    const totalDocs = dossier.documents.length;
    const percentage = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0;
    setDossier(prev => ({ ...prev, completionPercentage: percentage }));
  }, [dossier.documents]);

  const handleAiFill = (docName: string) => {
    console.log(`Lancement de l'IA pour le document : ${docName}`);
    // Here you would open a modal or interact with the AI assistant
  };

  const handleUpdateStatus = (docId: string) => {
    setDossier(prev => ({
        ...prev,
        documents: prev.documents.map(doc => 
            doc.id === docId ? { ...doc, status: DocumentStatus.COMPLETED } : doc
        )
    }));
  };

  const completedMandatory = mandatoryDocs.filter(d => d.status === DocumentStatus.COMPLETED).length;
  const completedComplementary = complementaryDocs.filter(d => d.status === DocumentStatus.COMPLETED).length;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <header className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 font-poppins">{dossier.tenderName}</h1>
            <p className="text-gray-500 text-sm mt-1">Complétion du dossier : {dossier.completionPercentage}%</p>
          </div>
          <button className="bg-asso-blue text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition whitespace-nowrap">
            + Nouveau dossier
          </button>
        </div>
        <div className="mt-4">
          <ProgressBar percentage={dossier.completionPercentage} />
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2 space-y-8">
          {/* Mandatory Documents */}
          <section className="bg-light-gray p-6 rounded-lg border-2 border-asso-blue/30">
            <h2 className="font-poppins text-xl font-bold text-asso-blue mb-4">Documents obligatoires</h2>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 w-12"></th>
                            <th scope="col" className="px-4 py-3">Nom du document</th>
                            <th scope="col" className="px-4 py-3">Statut</th>
                            <th scope="col" className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mandatoryDocs.map(doc => <DocumentRow key={doc.id} doc={doc} onAiFill={handleAiFill} onStatusChange={handleUpdateStatus} />)}
                    </tbody>
                </table>
            </div>
          </section>

          {/* Complementary Documents */}
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
             <h2 className="font-poppins text-xl font-bold text-asso-green mb-4">Documents complémentaires</h2>
             <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                     <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 w-12"></th>
                            <th scope="col" className="px-4 py-3">Nom du document</th>
                            <th scope="col" className="px-4 py-3">Statut</th>
                            <th scope="col" className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                     <tbody>
                        {complementaryDocs.map(doc => <DocumentRow key={doc.id} doc={doc} onAiFill={handleAiFill} onStatusChange={handleUpdateStatus} />)}
                    </tbody>
                </table>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-asso-blue text-white p-6 rounded-lg shadow-lg sticky top-28">
            <h3 className="font-poppins text-xl font-bold mb-4">Suivi et Récapitulatif</h3>
            <ul className="space-y-3 text-blue-100">
              <li className="flex justify-between items-center"><span>✅ Docs obligatoires complétés :</span> <strong>{completedMandatory} / {mandatoryDocs.length}</strong></li>
              <li className="flex justify-between items-center"><span>📄 Docs complémentaires :</span> <strong>{completedComplementary} / {complementaryDocs.length}</strong></li>
              <li className="flex justify-between items-center border-t border-blue-400/50 mt-2 pt-2"><span>⏰ Date limite de dépôt :</span> <strong>{new Date(dossier.deadline).toLocaleDateString('fr-FR')}</strong></li>
              <li className="flex justify-between items-center"><span>🔁 Dernière mise à jour :</span> <strong>{dossier.lastUpdated}</strong></li>
            </ul>
            <button 
                className="mt-6 w-full bg-asso-green text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:bg-gray-400"
                disabled={dossier.completionPercentage < 100}
            >
                {dossier.completionPercentage < 100 ? 'Complétez le dossier pour soumettre' : 'Soumettre le dossier'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DossierGenerator;
