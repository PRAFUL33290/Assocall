import React from 'react';
import { NavItem, DashboardView } from '../types';
import { BrainIcon, LogoutIcon, UserIcon, CogIcon, DocumentTextIcon, BookmarkIcon, OfficeBuildingIcon, CloseIcon } from './icons';

interface DashboardSidebarProps {
    activeView: DashboardView;
    setActiveView: (view: DashboardView) => void;
    userName: string;
    onLogout: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeView, setActiveView, userName, onLogout, isOpen, setIsOpen }) => {
    
    const navItems: NavItem[] = [
        { id: DashboardView.PROFILE, label: 'Profil', icon: <UserIcon className="h-5 w-5" /> },
        { id: DashboardView.MY_PROJECTS, label: 'Mes Projets', icon: <BrainIcon /> },
        { id: DashboardView.TENDER_RESPONSES, label: "Mes réponses aux appels d'offres", icon: <BookmarkIcon /> },
        { id: DashboardView.MY_DOCUMENTS, label: 'Candidatures Spontanées', icon: <DocumentTextIcon /> },
        { id: DashboardView.MUNICIPALITIES, label: 'Mairies', icon: <OfficeBuildingIcon /> },
        { id: DashboardView.SUBSCRIPTION, label: 'Abonnement', icon: <CogIcon /> },
    ];

    const handleNavClick = (view: DashboardView) => {
        setActiveView(view);
        if (window.innerWidth < 768) { // md breakpoint
            setIsOpen(false);
        }
    };

    return (
        <aside className={`fixed top-0 left-0 w-64 lg:w-72 h-full bg-white text-gray-800 border-r border-gray-200 flex flex-col shadow-lg z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:z-20 transition-transform duration-300`}>
            
            <div className="p-4 flex justify-between items-center md:hidden border-b border-gray-200 h-24">
                <span className="font-poppins font-bold text-lg text-asso-blue">Menu</span>
                <button onClick={() => setIsOpen(false)} aria-label="Fermer le menu">
                    <CloseIcon />
                </button>
            </div>

            <div className="h-24 hidden md:flex items-center px-6 border-b border-gray-200">
                <span className="font-poppins font-bold text-xl text-gray-800">Tableau de Bord</span>
            </div>
            
            <nav className="flex-grow p-4 pt-6 overflow-y-auto">
                <ul>
                    {navItems.map(item => (
                         <li key={item.id}>
                             <button
                                onClick={() => handleNavClick(item.id)}
                                className={`w-full flex items-center gap-3 p-3 my-1 rounded-lg text-left font-semibold transition-colors ${
                                    activeView === item.id 
                                    ? 'bg-asso-blue text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                         </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gray-200 rounded-full">
                        <UserIcon />
                    </div>
                    <span className="font-semibold truncate">{userName}</span>
                </div>
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left font-semibold text-gray-600 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                >
                    <LogoutIcon />
                    <span>Se déconnecter</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;