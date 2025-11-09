import React, { useState, useEffect } from 'react';
import MyProjectsView from './MyProjectsView';
import ResearchAssistant from './ResearchAssistant';
import ChatBot from './ChatBot';
import DashboardSidebar from './DashboardSidebar';
import { DashboardView, Project, PublicProject, UserRole, SubscriptionPlan, PaymentMethod } from '../types';
import ProfilePage from './ProfilePage';
import SubscriptionPage from './SubscriptionPage';
import MyDocumentsView from './MyDocumentsView';
import { loadProfile, isProfileEmpty } from '../services/profileService';
import { loadProjects, saveProjects } from '../services/projectService';
import TenderResponsesView from './TenderResponsesView';
import MunicipalitiesView from './MunicipalitiesView';


interface DashboardPageProps {
    user: { name: string; email: string; role: UserRole; subscriptionPlan: SubscriptionPlan; searchCount: number; pdfExportsUsed: number; paymentMethod: PaymentMethod | null; } | null;
    onLogout: () => void;
    onUpdateUserName: (newName: string) => void;
    onUpdateSubscription: (newPlan: SubscriptionPlan) => void;
    onPdfExported: () => void;
    onUpdatePaymentMethod: (method: PaymentMethod | null) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, onUpdateUserName, onUpdateSubscription, onPdfExported, onUpdatePaymentMethod }) => {
    const getInitialView = (): DashboardView => {
        const profile = loadProfile();
        // If profile is empty, guide user to fill it first.
        if (isProfileEmpty(profile)) {
            return DashboardView.PROFILE;
        }
        // Otherwise, default to projects view.
        return DashboardView.MY_PROJECTS;
    };

    const [activeView, setActiveView] = useState<DashboardView>(getInitialView);
    const [projects, setProjects] = useState<Project[]>(loadProjects);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        saveProjects(projects);
    }, [projects]);
  
    useEffect(() => {
        const projectToApplyForJSON = sessionStorage.getItem('projectToApplyFor');
        if (projectToApplyForJSON) {
            try {
                const publicProject: PublicProject = JSON.parse(projectToApplyForJSON);

                const existingProject = projects.find(p => p.originalTender?.id === publicProject.id);

                if (!existingProject) {
                    const newProject: Project = {
                        id: crypto.randomUUID(),
                        title: publicProject.title,
                        summary: publicProject.summary,
                        specifications: '',
                        materials: '',
                        budget: publicProject.grantAmount,
                        originalTender: publicProject,
                    };
                    setProjects(prevProjects => [...prevProjects, newProject]);
                }
                
                setActiveView(DashboardView.TENDER_RESPONSES);
            } catch (e) {
                console.error("Failed to parse project from session storage", e);
                setActiveView(DashboardView.MY_PROJECTS);
            } finally {
                sessionStorage.removeItem('projectToApplyFor');
            }
        }
    }, []);

    const renderActiveView = () => {
        switch (activeView) {
            case DashboardView.MY_PROJECTS:
                return <MyProjectsView 
                    user={user}
                    setActiveView={setActiveView}
                />;
            case DashboardView.TENDER_RESPONSES:
                return <TenderResponsesView projects={projects} />;
            case DashboardView.RESEARCH_ASSISTANT:
                return <ResearchAssistant />;
            case DashboardView.MY_DOCUMENTS:
                return <MyDocumentsView user={user} onPdfExported={onPdfExported} />;
            case DashboardView.MUNICIPALITIES:
                return <MunicipalitiesView />;
            case DashboardView.PROFILE:
                return <ProfilePage user={user} onUpdateUserName={onUpdateUserName} />;
            case DashboardView.SUBSCRIPTION:
                return <SubscriptionPage 
                    currentPlan={user?.subscriptionPlan || SubscriptionPlan.FREE}
                    onPlanChange={onUpdateSubscription}
                    paymentMethod={user?.paymentMethod || null}
                    onUpdatePaymentMethod={onUpdatePaymentMethod}
                />;
            default:
                 return <MyProjectsView 
                    user={user}
                    setActiveView={setActiveView}
                />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-light-gray text-gray-800 min-h-screen">
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}
            <DashboardSidebar 
                activeView={activeView} 
                setActiveView={setActiveView}
                userName={user?.name || ''}
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            
            <main className="flex-grow md:ml-64 lg:ml-72 p-6 md:p-10">
                 <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold font-poppins text-gray-900">Bienvenue, {user?.name || 'Utilisateur'} !</h1>
                        <p className="text-gray-600 mt-2">Votre tableau de bord pour piloter vos projets avec l'IA.</p>
                    </div>
                     <button 
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-200 md:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Ouvrir le menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>
                
                {renderActiveView()}
            </main>
            
            <ChatBot />
        </div>
    );
};

export default DashboardPage;