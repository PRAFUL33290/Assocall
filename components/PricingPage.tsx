import React, { useState } from 'react';
import { CheckmarkIcon, BuildingIcon } from './icons';
import { UserRole, SubscriptionPlan, PaymentMethod } from '../types';

interface PricingCardProps {
    plan: string;
    price: string;
    priceNote?: string;
    description: string;
    features: string[];
    popular?: boolean;
    cta: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, priceNote, description, features, popular = false, cta, onClick }) => (
    <div className={`border rounded-lg p-8 flex flex-col h-full bg-white ${popular ? 'border-asso-blue shadow-2xl border-2' : 'border-gray-200 shadow-lg'}`}>
        {popular && <span className="bg-asso-blue text-white text-xs font-bold px-3 py-1 rounded-full self-center -mt-12 mb-4">LE PLUS POPULAIRE</span>}
        <h3 className="font-poppins text-2xl font-bold text-gray-800 text-center">{plan}</h3>
        <p className="mt-2 text-gray-600 text-center h-12">{description}</p>
        <p className="mt-4 text-center">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            {priceNote && <span className="text-gray-500"> {priceNote}</span>}
        </p>
        <ul className="mt-6 space-y-4 text-gray-600 flex-grow">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                    <span className="mr-3 mt-1">{feature.startsWith('✅') ? <CheckmarkIcon /> : '❌'}</span>
                    <span className="">{feature.replace(/^[✅❌]\s*/, '')}</span>
                </li>
            ))}
        </ul>
        <button onClick={onClick} className={`mt-8 w-full font-bold py-3 px-6 rounded-lg transition ${popular ? 'bg-asso-blue text-white hover:opacity-90' : 'bg-white text-asso-blue border-2 border-asso-blue hover:bg-blue-50'}`} style={{ borderRadius: '10px' }}>
            {cta}
        </button>
    </div>
);

interface PricingPageProps {
    user: { name: string; email: string; role: UserRole; subscriptionPlan: SubscriptionPlan; searchCount: number; pdfExportsUsed: number; paymentMethod: PaymentMethod | null; } | null;
}

const PricingPage: React.FC<PricingPageProps> = ({ user }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

    const handleNavClick = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const target = e.currentTarget.getAttribute('href') || '#/signup';
        window.location.hash = target;
        window.scrollTo(0, 0);
    };

    const handlePlanSelection = (plan: 'essential' | 'pro') => {
        const paymentLinks = {
            essential: 'https://buy.stripe.com/8x26oB9HA5MZ0TudA6aR200',
            pro: 'https://buy.stripe.com/bJe6oB4ng2AN1Xy3ZwaR201'
        };
        const targetUrl = paymentLinks[plan];

        // Save the selected plan to use after payment success
        sessionStorage.setItem('selectedPlan', plan);

        if (user) {
            // User is logged in, redirect directly to payment
            window.location.href = targetUrl;
        } else {
            // User is not logged in, store URL and redirect to signup
            sessionStorage.setItem('postSignupRedirect', targetUrl);
            window.location.hash = '#/signup';
        }
    };

    const plans = {
        discovery: {
            plan: 'Découverte',
            price: { monthly: 'Gratuit', annual: 'Gratuit' },
            description: 'Pour tester les fonctionnalités principales de la plateforme.',
            cta: 'Commencer gratuitement',
            features: [
                "✅ 3 recherches IA (jusqu'à 3 résultats par recherche)",
                "❌ Les résultats de recherche ne sont pas sauvegardés",
                "❌ Ajout des projets au tableau de bord impossible",
                "❌ Accès aux contacts des financeurs",
                '✅ Projets illimités',
                '✅ Assistance IA à la rédaction',
                '✅ Gestion des documents',
                "✅ 3 exports PDF gratuits, puis 1€/export",
            ]
        },
        essential: {
            plan: 'Essentiel',
            price: { monthly: '9,99€', annual: '95€' },
            priceNote: { annual: 'par an (au lieu de 120€)' },
            description: 'Idéal pour les structures qui répondent régulièrement à des appels d\'offres.',
            cta: 'Choisir Essentiel',
            popular: true,
            features: [
                "✅ Recherches d'appels à projets illimitées",
                '✅ Sauvegarde des résultats de recherche',
                '✅ Ajout des projets au tableau de bord',
                '✅ Accès aux contacts des financeurs',
                '✅ Projets illimités',
                '✅ AssoCall AI de rédaction avancé',
                '✅ Export des dossiers (PDF & ZIP) illimité',
                '✅ 1 Go de stockage documents',
                '✅ Support par email',
            ]
        },
        pro: {
            plan: 'Pro',
            price: { monthly: '19,99€', annual: '199€' },
            priceNote: { annual: 'par an (au lieu de 240€)' },
            description: 'La solution complète pour les experts et les structures à fort volume.',
            cta: 'Passer Pro',
            features: [
                "✅ Recherches d'appels à projets illimitées",
                '✅ Sauvegarde des résultats de recherche',
                '✅ Ajout des projets au tableau de bord',
                '✅ Accès aux contacts des financeurs',
                '✅ Projets illimités',
                '✅ Assistant IA personnalisé (contexte mémorisé)',
                '✅ Export des dossiers (PDF & ZIP) illimité',
                '✅ 10 Go de stockage documents',
                '✅ Support prioritaire',
            ]
        }
    };
    
    const getPriceNote = (planData: any, cycle: 'monthly' | 'annual') => {
        if (planData.price[cycle] === 'Gratuit') return undefined;
        if (cycle === 'annual' && planData.priceNote) return planData.priceNote.annual;
        return '/ mois';
    };


    return (
        <div className="bg-white">
            <section className="bg-light-gray py-20 text-center">
                <div className="container mx-auto px-6 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-800">
                        Des formules adaptées à vos ambitions
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        De la découverte de l'outil à un usage intensif, choisissez le plan qui évolue avec vos besoins. Sans engagement, annulez à tout moment.
                    </p>
                </div>
            </section>
            
            <section className="container mx-auto px-6 py-20">
                <div className="flex justify-center items-center gap-4 mb-12">
                    <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-asso-blue' : 'text-gray-500'}`}>Mensuel</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={billingCycle === 'annual'} onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')} className="sr-only peer" />
                        <div className="w-14 h-8 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-asso-blue"></div>
                    </label>
                    <span className={`font-semibold ${billingCycle === 'annual' ? 'text-asso-blue' : 'text-gray-500'}`}>Annuel <span className="text-asso-green font-bold">(-20%)</span></span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    <PricingCard 
                        {...plans.discovery}
                        price={plans.discovery.price[billingCycle]}
                        priceNote={getPriceNote(plans.discovery, billingCycle)}
                        onClick={handleNavClick}
                    />
                     <PricingCard 
                        {...plans.essential}
                        price={plans.essential.price[billingCycle]}
                        priceNote={getPriceNote(plans.essential, billingCycle)}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePlanSelection('essential');
                        }}
                    />
                     <PricingCard 
                        {...plans.pro}
                        price={plans.pro.price[billingCycle]}
                        priceNote={getPriceNote(plans.pro, billingCycle)}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePlanSelection('pro');
                        }}
                    />
                </div>
            </section>

            <section className="bg-light-gray py-20">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-asso-green/10 rounded-full text-asso-green">
                                <BuildingIcon />
                            </div>
                        </div>
                        <h2 className="text-2xl font-poppins font-bold text-gray-800">Vous êtes une Mairie ?</h2>
                        <p className="mt-3 text-gray-600">
                            La publication de vos appels à projets sur AssoCall est et restera toujours gratuite. Créez un compte 'Mairie' pour commencer à diffuser vos opportunités.
                        </p>
                        <a href="#/signup?role=mairie" onClick={handleNavClick} className="mt-6 inline-block bg-asso-green text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition">
                            Publier un appel à projet
                        </a>
                    </div>

                     <div className="bg-white p-8 rounded-lg shadow-lg border text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-asso-blue/10 rounded-full text-asso-blue">
                                <BuildingIcon />
                            </div>
                        </div>
                        <h2 className="text-2xl font-poppins font-bold text-gray-800">Plan Collectivité & Partenaire</h2>
                        <p className="mt-3 text-gray-600">
                           Une solution sur-mesure pour les mairies, réseaux d'associations, ou fondations. Bénéficiez d'un accès multi-utilisateurs et d'outils de gestion.
                        </p>
                        <a href="#/contact" onClick={handleNavClick} className="mt-6 inline-block bg-asso-blue text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition">
                            Nous contacter pour un devis
                        </a>
                    </div>
                </div>
            </section>

             <section className="container mx-auto px-6 py-20">
                <div className="text-center">
                    <h2 className="text-3xl font-poppins font-bold text-gray-800">Questions fréquentes</h2>
                     <div className="mt-8 max-w-3xl mx-auto text-left space-y-4">
                        <div className="p-4 border rounded-lg bg-white">
                            <h3 className="font-bold">Qu'est-ce qu'une "recherche d'appel à projets" ?</h3>
                            <p className="text-gray-600 mt-1">Chaque fois que vous utilisez le bouton "Rechercher plus d'appels à projets" sur la page dédiée, cela décompte une recherche de votre quota. Notre IA interroge alors le web en temps réel pour trouver de nouvelles opportunités. Le plan gratuit est limité à 3 recherches.</p>
                        </div>
                         <div className="p-4 border rounded-lg bg-white">
                            <h3 className="font-bold">Que se passe-t-il si j'atteins ma limite de recherches ?</h3>
                            <p className="text-gray-600 mt-1">Vous ne pourrez plus lancer de nouvelles recherches IA jusqu'au renouvellement de votre quota le mois suivant. Vous pouvez à tout moment passer au plan supérieur pour augmenter votre limite.</p>
                        </div>
                         <div className="p-4 border rounded-lg bg-white">
                            <h3 className="font-bold">Puis-je changer de formule à tout moment ?</h3>
                            <p className="text-gray-600 mt-1">Oui, vous pouvez faire évoluer votre abonnement ou l'annuler à tout moment depuis votre espace "Abonnement" dans le tableau de bord.</p>
                        </div>
                     </div>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;