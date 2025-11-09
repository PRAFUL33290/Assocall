import React, { useState, useEffect } from 'react';
import { OrganizationProfile, Reference, FinancialData, HumanResources, UserRole } from '../types';
import { loadProfile, saveProfile } from '../services/profileService';
import { TrashIcon, SuccessIcon, SparklesIcon, LoadingSpinner } from './icons';
import { generateExampleContent } from '../services/geminiService';

interface ProfilePageProps {
    user: { name: string; email: string; role: UserRole; } | null;
    onUpdateUserName: (newName: string) => void;
}

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    const roleStyles: { [key in UserRole]: { text: string; bg: string; text_color: string } } = {
        [UserRole.ASSOCIATION]: { text: 'Association', bg: 'bg-blue-100', text_color: 'text-blue-800' },
        [UserRole.ENTREPRISE]: { text: 'Entreprise', bg: 'bg-purple-100', text_color: 'text-purple-800' },
        [UserRole.MAIRIE]: { text: 'Mairie', bg: 'bg-green-100', text_color: 'text-green-800' },
        [UserRole.ADMIN]: { text: 'Administrateur', bg: 'bg-red-100', text_color: 'text-red-800' },
    };

    const style = roleStyles[role] || { text: 'Inconnu', bg: 'bg-gray-100', text_color: 'text-gray-800' };

    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${style.bg} ${style.text_color}`}>
            {style.text}
        </span>
    );
};


const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUserName }) => {
    const [profile, setProfile] = useState<OrganizationProfile>(loadProfile);
    const [userName, setUserName] = useState(user?.name || '');
    const [saveStatus, setSaveStatus] = useState<{ message: string } | null>(null);
    const [isGeneratingExample, setIsGeneratingExample] = useState(false);

    // Auto-save organization profile to localStorage whenever it changes
    useEffect(() => {
        saveProfile(profile);
    }, [profile]);

    // Sync local user name state if the user prop changes
    useEffect(() => {
        if(user) {
            setUserName(user.name);
        }
    }, [user]);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFinancialChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedFinancials = [...profile.financials];
        // The key is asserted because we know the name matches a key of FinancialData
        (updatedFinancials[index] as any)[name] = name === 'annee' ? parseInt(value) : parseFloat(value);
        setProfile({ ...profile, financials: updatedFinancials });
    };
    
    const handleHumanResourcesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            humanResources: {
                ...prev.humanResources,
                [name]: parseInt(value) || 0,
            }
        }));
    };

    const handleReferenceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedReferences = [...profile.references];
        (updatedReferences[index] as any)[name] = name === 'annee' || name === 'montant' ? parseFloat(value) : value;
        setProfile({ ...profile, references: updatedReferences });
    };
    
    const addReference = () => {
        const newReference: Reference = {
            id: crypto.randomUUID(),
            client: '',
            montant: 0,
            annee: new Date().getFullYear(),
            description: ''
        };
        setProfile({ ...profile, references: [...profile.references, newReference] });
    };
    
    const removeReference = (id: string) => {
        setProfile({ ...profile, references: profile.references.filter(ref => ref.id !== id) });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveProfile(profile); // Explicit save for organization data
        onUpdateUserName(userName); // Update the user's display name
        setSaveStatus({ message: 'Profil mis à jour avec succès !' });
        setTimeout(() => setSaveStatus(null), 3000);
    };

    const handleValidationCheck = () => {
        const errors = [];
        if (!profile.siret.trim()) {
            errors.push("Le numéro de SIRET est manquant.");
        }
        const validFinancials = profile.financials.filter(f => f.chiffreAffaires > 0);
        if (validFinancials.length < 3) {
            errors.push(`Il manque ${3 - validFinancials.length} année(s) de données financières (chiffre d'affaires).`);
        }

        if (errors.length > 0) {
            alert("Données incomplètes pour un dossier de candidature (DC2) :\n\n- " + errors.join('\n- '));
        } else {
            alert("Félicitations ! Vos données essentielles semblent complètes pour un dossier de candidature.");
        }
    };

    const handleGenerateExample = async () => {
        setIsGeneratingExample(true);
        try {
            const exampleText = await generateExampleContent('administrativeMotivationBlock');
            setProfile(prev => ({ ...prev, administrativeMotivationBlock: exampleText }));
        } catch (error) {
            console.error("Failed to generate example:", error);
        } finally {
            setIsGeneratingExample(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
             <header>
                <h1 className="text-3xl font-bold text-gray-800 font-poppins">Profil et Données de la Structure</h1>
                <p className="text-gray-600 mt-1">Gérez les informations de votre compte et de votre structure pour générer vos candidatures en un clic.</p>
            </header>
            
            <form onSubmit={handleFormSubmit} className="space-y-8">

                <section className="bg-white p-6 rounded-lg shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 font-poppins mb-4 border-b pb-2">Informations du Compte</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Nom du compte (pour l'affichage)</label>
                            <input 
                                type="text" 
                                name="userName" 
                                id="userName" 
                                value={userName} 
                                onChange={(e) => setUserName(e.target.value)} 
                                className="mt-1 input-field" 
                                placeholder="Ex: Jean Dupont"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={user?.email || ''}
                                disabled
                                className="mt-1 input-field bg-gray-100 cursor-not-allowed" 
                            />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Type de compte</label>
                            <div className="mt-2">
                               {user && <RoleBadge role={user.role} />}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 font-poppins mb-4 border-b pb-2">1. Informations Légales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="denomination" className="block text-sm font-medium text-gray-700">Dénomination Sociale</label>
                            <input type="text" name="denomination" id="denomination" value={profile.denomination} onChange={handleInfoChange} className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="siret" className="block text-sm font-medium text-gray-700">Numéro de SIRET</label>
                            <input type="text" name="siret" id="siret" value={profile.siret} onChange={handleInfoChange} className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="representantLegal" className="block text-sm font-medium text-gray-700">Représentant Légal</label>
                            <input type="text" name="representantLegal" id="representantLegal" value={profile.representantLegal} onChange={handleInfoChange} className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">Adresse du Siège Social</label>
                            <input type="text" name="adresse" id="adresse" value={profile.adresse} onChange={handleInfoChange} className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="email_contact" className="block text-sm font-medium text-gray-700">Email de contact</label>
                            <input type="email" name="email" id="email_contact" value={profile.email} onChange={handleInfoChange} className="mt-1 input-field" />
                        </div>
                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <input type="tel" name="telephone" id="telephone" value={profile.telephone} onChange={handleInfoChange} className="mt-1 input-field" />
                        </div>
                    </div>
                </section>
                
                {(user?.role === UserRole.ASSOCIATION || user?.role === UserRole.ENTREPRISE || user?.role === UserRole.ADMIN) && (
                    <section className="bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-xl font-bold text-gray-800 font-poppins mb-4 border-b pb-2">
                           Coffre-fort d'informations (pour l'IA)
                        </h2>
                        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                            Collez ici toutes les informations utiles à vos candidatures. Notre IA remplira vos dossiers et formulaires automatiquement à partir de ce bloc.
                        </p>
                        <div>
                            <label htmlFor="administrativeMotivationBlock" className="sr-only">
                                Zone de texte pour les informations administratives et de motivation.
                            </label>
                            <textarea
                                id="administrativeMotivationBlock"
                                name="administrativeMotivationBlock"
                                rows={15}
                                value={profile.administrativeMotivationBlock || ''}
                                onChange={handleInfoChange}
                                className="mt-1 input-field"
                                placeholder="Ex: Nom de la structure, SIRET, adresse, Kbis, RIB, description des activités, motivations, références..."
                            />
                             <button
                                type="button"
                                onClick={handleGenerateExample}
                                disabled={isGeneratingExample}
                                className="mt-2 text-sm bg-asso-green/10 text-asso-green font-semibold px-3 py-1.5 rounded-md hover:bg-asso-green/20 flex items-center gap-1 disabled:opacity-50"
                            >
                                {isGeneratingExample ? <LoadingSpinner /> : <SparklesIcon />}
                                Générer un exemple avec l'IA
                            </button>
                        </div>
                    </section>
                )}
                
                <section className="bg-white p-6 rounded-lg shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 font-poppins mb-4 border-b pb-2">2. Moyens Humains (Année N-1)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {Object.keys(profile.humanResources).map(key => (
                             <div key={key}>
                                <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                <input 
                                    type="number" 
                                    name={key} 
                                    id={key} 
                                    value={profile.humanResources[key as keyof HumanResources]} 
                                    onChange={handleHumanResourcesChange} 
                                    className="mt-1 input-field" 
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 font-poppins mb-4 border-b pb-2">3. Références Clés</h2>
                    <div className="space-y-6">
                        {profile.references.map((ref, index) => (
                            <div key={ref.id} className="p-4 border rounded-lg bg-light-gray relative">
                                <button type="button" onClick={() => removeReference(ref.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon /></button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" name="client" value={ref.client} onChange={e => handleReferenceChange(index, e)} placeholder="Client / Financeur" className="input-field" />
                                    <input type="number" name="annee" value={ref.annee} onChange={e => handleReferenceChange(index, e)} placeholder="Année" className="input-field" />
                                    <input type="number" name="montant" value={ref.montant} onChange={e => handleReferenceChange(index, e)} placeholder="Montant (€)" className="input-field" />
                                    <textarea name="description" value={ref.description} onChange={e => handleReferenceChange(index, e)} placeholder="Description brève du projet" rows={2} className="md:col-span-2 input-field"></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addReference} className="mt-4 bg-asso-green text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition">
                        + Ajouter une référence
                    </button>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 font-poppins mb-4 border-b pb-2">4. Données Financières</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {profile.financials.map((fin, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-light-gray">
                                <label className="block text-sm font-bold text-gray-700 text-center mb-2">Année {fin.annee}</label>
                                <div className="space-y-2">
                                    <input type="number" name="chiffreAffaires" value={fin.chiffreAffaires} onChange={e => handleFinancialChange(index, e)} placeholder="Chiffre d'Affaires (€)" className="input-field" />
                                    <input type="number" name="resultatNet" value={fin.resultatNet} onChange={e => handleFinancialChange(index, e)} placeholder="Résultat Net (€)" className="input-field" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <button type="submit" className="bg-asso-blue text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition w-full sm:w-auto">
                        Sauvegarder le Profil
                    </button>
                    <button type="button" onClick={handleValidationCheck} className="bg-white text-asso-green border-2 border-asso-green font-bold py-3 px-6 rounded-lg hover:bg-green-50 transition w-full sm:w-auto">
                        Vérifier Conformité DC2
                    </button>
                     {saveStatus && (
                        <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                            <SuccessIcon />
                            <span className="font-semibold">{saveStatus.message}</span>
                        </div>
                    )}
                </div>
            </form>
            <style>{`
                .input-field {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.5rem;
                    background-color: white;
                    color: #1f2937;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .input-field:focus {
                    outline: none;
                    border-color: #0066FF;
                    box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;