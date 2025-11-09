import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProjectsPage from './components/ProjectsPage';
import PlaceholderPage from './components/PlaceholderPage';
import FeaturesPage from './components/FeaturesPage';
import PricingPage from './components/PricingPage';
import ContactPage from './components/ContactPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import DashboardPage from './components/DashboardPage';
import HelpPage from './components/HelpPage'; // Ajout de l'importation
import PaymentFailedPage from './components/PaymentFailedPage';
// Fix: Import PaymentMethod and add it to the user state type.
import { UserRole, SubscriptionPlan, PaymentMethod } from './types';


const App: React.FC = () => {
    const [route, setRoute] = useState('#/payment-failed'); // Default to payment failed page for preview
    // Fix: Add `paymentMethod` to the user state type to match what child components expect.
    const [user, setUser] = useState<{ name: string; email: string; role: UserRole; subscriptionPlan: SubscriptionPlan; searchCount: number; pdfExportsUsed: number; paymentMethod: PaymentMethod | null; } | null>(null);

    // Effect for hydrating user from localStorage on initial mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // This "migration" logic ensures old user objects are compatible.
                if (!parsedUser.subscriptionPlan) {
                    parsedUser.subscriptionPlan = SubscriptionPlan.FREE;
                }
                if (parsedUser.searchCount === undefined) {
                    parsedUser.searchCount = 0;
                }
                 if (parsedUser.pdfExportsUsed === undefined) {
                    parsedUser.pdfExportsUsed = 0;
                }
                // Fix: Remove old, incompatible paymentMethod property and ensure the new one exists.
                if (parsedUser.paymentMethod) { // Migration: remove old payment method
                    delete parsedUser.paymentMethod;
                }
                parsedUser.paymentMethod = null; // Always ensure it exists.

                if (!parsedUser.email) {
                    parsedUser.email = 'user@example.com';
                }
                setUser(parsedUser);
            } catch {
                // If parsing fails, clear the corrupted item and treat as logged out.
                localStorage.removeItem('user');
                setUser(null);
            }
        }
    }, []); // Empty dependency array ensures this runs only once on mount.

    // Effect for persisting user to localStorage whenever it changes
    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error("Failed to update user in localStorage", error);
        }
    }, [user]);


    useEffect(() => {
        const handleHashChange = () => {
            // Don't change the route if it's the initial preview route
            if (window.location.hash !== '#/payment-failed' || route !== '#/payment-failed') {
                 setRoute(window.location.hash || '#/');
            }
        };
        
        // Set initial route based on hash, unless it's the preview
        const initialHash = window.location.hash || '#/';
        if(route !== '#/payment-failed') {
            setRoute(initialHash);
        }

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const handleUpdateSubscription = (newPlan: SubscriptionPlan) => {
        if (user) {
            setUser({ ...user, subscriptionPlan: newPlan });
        }
    };
    
    // Effect to handle post-payment redirection and subscription update
    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        if (params.get('payment') === 'success' && user) {
            const selectedPlan = sessionStorage.getItem('selectedPlan');
            if (selectedPlan) {
                if (selectedPlan === 'essential') {
                    handleUpdateSubscription(SubscriptionPlan.ESSENTIAL);
                } else if (selectedPlan === 'pro') {
                    handleUpdateSubscription(SubscriptionPlan.PRO);
                }
                sessionStorage.removeItem('selectedPlan');
                // Set a flag for the dashboard to show the success message
                sessionStorage.setItem('paymentSuccessMessage', 'true');
                // Redirect to a clean dashboard URL
                window.location.hash = '#/dashboard';
            }
        }
    }, [route, user]); // Reruns when route changes or user logs in


    const handleLogin = (email: string, userName?: string, role?: UserRole) => {
        let finalRole = role || UserRole.ASSOCIATION;
        let finalUserName = userName || 'Utilisateur';
        
        if (email.toLowerCase() === 'contact@praful-design.fr') {
            finalRole = UserRole.ADMIN;
            finalUserName = "Admin AssoCall";
        }

        // Fix: Add `paymentMethod` to the new user object to match the state type.
        const newUser = { 
            name: finalUserName, 
            email: email, 
            role: finalRole, 
            subscriptionPlan: SubscriptionPlan.FREE, 
            searchCount: 0,
            pdfExportsUsed: 0,
            paymentMethod: null,
        };
        setUser(newUser);
        
        const postSignupRedirect = sessionStorage.getItem('postSignupRedirect');
        if (postSignupRedirect) {
            sessionStorage.removeItem('postSignupRedirect');
            window.location.href = postSignupRedirect; // Direct external navigation
        } else {
            window.location.hash = '#/dashboard';
        }
    };

    const handleUpdateUserName = (newName: string) => {
        if (user) {
            setUser({ ...user, name: newName });
        }
    };

    const handleSearchPerformed = () => {
        if (user && user.subscriptionPlan === SubscriptionPlan.FREE) {
            setUser(prevUser => {
                if (!prevUser) return null;
                const newCount = (prevUser.searchCount || 0) + 1;
                return { ...prevUser, searchCount: newCount };
            });
        }
    };

    const handlePdfExported = () => {
        if (user && user.subscriptionPlan === SubscriptionPlan.FREE) {
            setUser(prevUser => {
                if (!prevUser) return null;
                return { ...prevUser, pdfExportsUsed: (prevUser.pdfExportsUsed || 0) + 1 };
            });
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('assoCall-foundProjects'); // Clear project cache on logout
        window.location.hash = '#/';
    };

    const commonDashboardProps = {
        user,
        onLogout: handleLogout,
        onUpdateUserName: handleUpdateUserName,
        onUpdateSubscription: handleUpdateSubscription,
        onPdfExported: handlePdfExported,
    };

    // --- Routing Logic ---
    const renderPage = () => {
        const path = route.split('?')[0];

        // Routes accessible to all users, authenticated or not
        switch (path) {
            case '#/': return <HomePage />;
            case '#/projets': return <ProjectsPage user={user} onSearchPerformed={handleSearchPerformed} />;
            case '#/fonctionnalites': return <FeaturesPage />;
            case '#/tarifs': return <PricingPage user={user} />;
            case '#/contact': return <ContactPage />;
            case '#/aide': return <HelpPage />; // Ajout de la route
            case '#/mentions': return <PlaceholderPage title="Mentions Légales" />;
            case '#/payment-failed': return <PaymentFailedPage />;
        }

        // Routes that depend on authentication state
        if (!user) {
            // Unauthenticated users
            switch (path) {
                case '#/login': return <LoginPage onLogin={(email) => handleLogin(email)} />;
                case '#/signup': return <SignUpPage onSignUp={(name, role, email) => handleLogin(email, name, role)} />;
                // If trying to access a protected route while logged out, redirect to login
                case '#/dashboard':
                    window.location.hash = '#/login';
                    return <LoginPage onLogin={(email) => handleLogin(email)} />;
                default:
                    // For any other unknown public route, show 404 or redirect home
                    return <HomePage />;
            }
        } else { 
            // Authenticated users
            switch(path) {
                case '#/dashboard': return <DashboardPage {...commonDashboardProps} />;
                // If logged in, redirect from auth pages to dashboard
                case '#/login':
                case '#/signup':
                    window.location.hash = '#/dashboard';
                    return <DashboardPage {...commonDashboardProps} />;
                default:
                    // For any other unknown protected route, fallback to dashboard
                    return <DashboardPage {...commonDashboardProps} />;
            }
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-light-gray">
            <Header currentRoute={route} isAuthenticated={!!user} onLogout={handleLogout} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            {!route.startsWith('#/dashboard') && <Footer />}
        </div>
    );
};

export default App;