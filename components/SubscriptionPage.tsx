import React, { useState } from 'react';
import { CheckmarkIcon, SuccessIcon } from './icons';
import { SubscriptionPlan } from '../types';

interface PricingCardProps {
    plan: string;
    price: string;
    features: string[];
    current?: boolean;
    popular?: boolean;
    cta: string;
    onClick: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, features, current = false, popular = false, cta, onClick }) => (
    <div className={`border rounded-lg p-8 flex flex-col h-full bg-white ${current ? 'border-asso-blue shadow-2xl border-2' : 'border-gray-200 shadow-lg'}`}>
        {current && <span className="bg-asso-blue text-white text-xs font-bold px-3 py-1 rounded-full self-center -mt-12 mb-4">VOTRE PLAN ACTUEL</span>}
        {popular && !current && <span className="bg-asso-green text-white text-xs font-bold px-3 py-1 rounded-full self-center -mt-12 mb-4">LE PLUS POPULAIRE</span>}
        <h3 className="font-poppins text-2xl font-bold text-gray-800 text-center">{plan}</h3>
        <p className="mt-4 text-center">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            {plan !== 'Gratuit' && <span className="text-gray-500"> / mois</span>}
        </p>
        <ul className="mt-6 space-y-4 text-gray-600 flex-grow">
            {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                    <CheckmarkIcon />
                    <span className="ml-3">{feature}</span>
                </li>
            ))}
        </ul>
        <button 
            onClick={onClick} 
            disabled={current}
            className={`mt-8 w-full font-bold py-3 px-6 rounded-lg transition ${
                current ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                popular ? 'bg-asso-blue text-white hover:opacity-90' :
                'bg-white text-asso-blue border-2 border-asso-blue hover:bg-blue-50'
            }`}
            style={{ borderRadius: '10px' }}>
            {current ? 'Votre plan actuel' : cta}
        </button>
    </div>
);


interface SubscriptionPageProps {
    currentPlan: SubscriptionPlan;
    onPlanChange: (newPlan: SubscriptionPlan) => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ currentPlan, onPlanChange }) => {
    const [saveStatus, setSaveStatus] = useState<{ message: string } | null>(null);
    
    const handlePlanSelection = (plan: 'essential' | 'pro') => {
        const paymentLinks = {
            essential: 'https://buy.stripe.com/8x26oB9HA5MZ0TudA6aR200',
            pro: 'https://buy.stripe.com/bJe6oB4ng2AN1Xy3ZwaR201'
        };
        const targetUrl = paymentLinks[plan];

        sessionStorage.setItem('selectedPlan', plan);
        window.location.href = targetUrl;
    };


    const plans = {
        [SubscriptionPlan.FREE]: {
            plan: 'Découverte',
            price: '0€',
            cta: 'Changer pour Gratuit',
            features: [
                "3 recherches IA / mois",
                'Projets illimités',
                'Assistance IA à la rédaction',
                "3 exports PDF gratuits",
            ]
        },
        [SubscriptionPlan.ESSENTIAL]: {
            plan: 'Essentiel',
            price: '9,99€',
            cta: 'Changer pour Essentiel',
            popular: true,
            features: [
                "Recherches d'appels à projets illimitées",
                'Sauvegarde des recherches',
                'Accès aux contacts des financeurs',
                'Exports PDF & ZIP illimités',
                'Support par email',
            ]
        },
        [SubscriptionPlan.PRO]: {
            plan: 'Pro',
            price: '19,99€',
            cta: 'Passer Pro',
            features: [
                "Toutes les fonctionnalités Essentiel",
                'Assistant IA personnalisé',
                '10 Go de stockage',
                'Support prioritaire',
            ]
        }
    };

    const handleChangeToFree = () => {
        onPlanChange(SubscriptionPlan.FREE);
        setSaveStatus({ message: `Votre abonnement a été changé pour la formule Découverte.` });
        setTimeout(() => setSaveStatus(null), 4000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
            <section>
                <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-6 border-b pb-4">Gestion de l'Abonnement</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-4">
                    <PricingCard 
                        {...plans.free} 
                        current={currentPlan === SubscriptionPlan.FREE} 
                        onClick={handleChangeToFree} 
                    />
                    <PricingCard 
                        {...plans.essential} 
                        current={currentPlan === SubscriptionPlan.ESSENTIAL} 
                        onClick={() => handlePlanSelection('essential')}
                    />
                    <PricingCard 
                        {...plans.pro} 
                        current={currentPlan === SubscriptionPlan.PRO} 
                        onClick={() => handlePlanSelection('pro')}
                    />
                </div>
                 {saveStatus && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 animate-fade-in">
                        <SuccessIcon />
                        <span className="font-semibold">{saveStatus.message}</span>
                    </div>
                )}
            </section>
        </div>
    );
};

export default SubscriptionPage;