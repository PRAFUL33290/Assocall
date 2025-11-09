import React from 'react';
import { SubscriptionPlan, UserRole, DashboardView } from '../types';
import { DocumentTextIcon, SearchIcon } from './icons';

interface MyProjectsViewProps {
    user: { name: string; role: UserRole; subscriptionPlan: SubscriptionPlan; searchCount: number; } | null;
    setActiveView: (view: DashboardView) => void;
}

const ActionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    disabledText?: string;
    remainingCount?: number;
}> = ({ icon, title, description, buttonText, onClick, href, disabled = false, disabledText, remainingCount }) => {
    
    const content = (
        <div className={`bg-white p-8 rounded-lg shadow-lg border h-full flex flex-col items-center text-center transition-all duration-300 ${disabled ? 'border-gray-200 bg-gray-50' : 'border-transparent hover:shadow-2xl hover:-translate-y-1'}`}>
            <div className={`mb-4 p-4 rounded-full ${disabled ? 'bg-gray-200 text-gray-400' : 'bg-asso-blue/10 text-asso-blue'}`}>
                {icon}
            </div>
            <h3 className={`font-poppins text-2xl font-bold ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>{title}</h3>
            <p className="mt-2 text-gray-600 flex-grow">{description}</p>
            <div className="mt-6 w-full">
                <button
                    disabled={disabled}
                    className={`w-full font-bold py-3 px-6 rounded-lg transition ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-asso-blue text-white hover:opacity-90'}`}
                >
                    {buttonText}
                </button>
                {remainingCount !== undefined && !disabled && (
                    <p className="text-sm text-gray-500 mt-2">
                        {remainingCount} recherche{remainingCount > 1 ? 's' : ''} restante{remainingCount > 1 ? 's' : ''}
                    </p>
                )}
                 {disabled && disabledText && (
                    <p className="text-sm text-red-600 mt-2 font-semibold">
                        {disabledText}
                    </p>
                )}
            </div>
        </div>
    );

    const commonProps = {
        className: `no-underline h-full block ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`,
        onClick: (e: React.MouseEvent) => {
            if (disabled) return;
            if (onClick) onClick();
            if (href) {
                e.preventDefault();
                window.location.hash = href;
            }
        }
    };

    return <div {...commonProps}>{content}</div>;
};


const MyProjectsView: React.FC<MyProjectsViewProps> = ({ user, setActiveView }) => {
    
    const isFreePlan = user?.subscriptionPlan === SubscriptionPlan.FREE;
    const searchLimit = 3;
    const searchesUsed = user?.searchCount || 0;
    const searchesRemaining = searchLimit - searchesUsed;
    const isSearchDisabled = isFreePlan && searchesRemaining <= 0;

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                 <h2 className="text-2xl font-bold font-poppins text-gray-800">Gérer mes Candidatures</h2>
                 <p className="text-gray-600 mt-1">Choisissez comment vous souhaitez commencer votre prochaine candidature.</p>
            </header>
            
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <ActionCard
                    icon={<DocumentTextIcon />}
                    title="Candidature Spontanée"
                    description="Préparez un dossier à partir de zéro. Idéal pour soumettre un projet directement à un financeur que vous avez déjà identifié."
                    buttonText="Commencer une nouvelle candidature"
                    onClick={() => setActiveView(DashboardView.MY_DOCUMENTS)}
                />
                 <ActionCard
                    icon={<SearchIcon />}
                    title="Répondre à un Appel d'Offres"
                    description="Parcourez la liste des appels à projets publics trouvés par notre IA et commencez votre candidature en un clic."
                    buttonText="Trouver un appel d'offres"
                    href="#/projets"
                    disabled={isSearchDisabled}
                    disabledText="Limite de recherches atteinte. Passez à un plan supérieur."
                    remainingCount={isFreePlan ? searchesRemaining : undefined}
                />
            </div>
        </div>
    );
};

export default MyProjectsView;