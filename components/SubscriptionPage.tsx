import React, { useState, useEffect } from 'react';
import { CheckmarkIcon, SuccessIcon } from './icons';
import { SubscriptionPlan, PaymentMethod } from '../types';

// Reusing PricingCard for consistency
interface PricingCardProps {
    plan: string;
    price: string;
    features: string[];
    current?: boolean;
    cta: string;
    onClick: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, features, current = false, cta, onClick }) => (
    <div className={`border rounded-lg p-8 flex flex-col h-full ${current ? 'border-asso-blue shadow-2xl border-2' : 'border-gray-200 shadow-lg'}`}>
        {current && <span className="bg-asso-blue text-white text-xs font-bold px-3 py-1 rounded-full self-center -mt-12 mb-4">VOTRE PLAN ACTUEL</span>}
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
            className={`mt-8 w-full font-bold py-3 px-6 rounded-lg transition ${current ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-asso-green text-white hover:opacity-90'}`} style={{ borderRadius: '10px' }}>
            {current ? 'Votre plan actuel' : cta}
        </button>
    </div>
);

interface SubscriptionPageProps {
    currentPlan: SubscriptionPlan;
    onPlanChange: (newPlan: SubscriptionPlan) => void;
    paymentMethod: PaymentMethod | null;
    onUpdatePaymentMethod: (method: PaymentMethod | null) => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ currentPlan, onPlanChange, paymentMethod, onUpdatePaymentMethod }) => {
    const [saveStatus, setSaveStatus] = React.useState<{ message: string } | null>(null);
    const [paymentSaveStatus, setPaymentSaveStatus] = useState<string | null>(null);
    
    const [localPaymentMethod, setLocalPaymentMethod] = useState<PaymentMethod>(
        paymentMethod || { type: 'card', details: {} }
    );
    
    useEffect(() => {
        setLocalPaymentMethod(paymentMethod || { type: 'card', details: {} });
    }, [paymentMethod]);


    const plans = {
        [SubscriptionPlan.FREE]: {
            plan: 'Gratuit',
            price: '0€',
            cta: 'Changer pour Gratuit',
            features: [
                "3 recherches d'appels à projets (9 résultats max)",
                'Projets illimités',
                'Assistance IA à la rédaction',
                'Gestion des documents',
                '3 exports PDF gratuits',
            ]
        },
        [SubscriptionPlan.ESSENTIAL]: {
            plan: 'Essentiel',
            price: '9,99€',
            cta: 'Changer pour Essentiel',
            features: [
                "20 recherches d'appels à projets",
                'Projets illimités',
                'AssoCall AI de rédaction avancé',
                '✅ Exports PDF & ZIP illimités',
                '1 Go de stockage documents',
                'Support par email',
            ]
        },
        [SubscriptionPlan.PRO]: {
            plan: 'Pro',
            price: '19,99€',
            cta: 'Passer Pro',
            features: [
                "Recherches d'appels à projets illimitées",
                'Projets illimités',
                'AssoCall AI de rédaction avancé',
                '✅ Exports PDF & ZIP illimités',
                '10 Go de stockage documents',
                'Support prioritaire',
            ]
        }
    };

    const handleChangePlan = (newPlan: SubscriptionPlan) => {
        onPlanChange(newPlan);
        const planName = plans[newPlan].plan;
        setSaveStatus({ message: `Votre abonnement a été changé pour la formule ${planName}.` });
        setTimeout(() => setSaveStatus(null), 4000);
    };

    const handlePaymentChange = (details: Partial<PaymentMethod['details']>) => {
        setLocalPaymentMethod(prev => ({
            ...prev,
            details: { ...prev.details, ...details }
        }));
    };

    const handlePaymentTypeChange = (type: 'card' | 'paypal') => {
        setLocalPaymentMethod({ type: type, details: {} });
    };

    const handleSavePayment = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdatePaymentMethod(localPaymentMethod);
        setPaymentSaveStatus('Moyen de paiement mis à jour avec succès !');
        setTimeout(() => setPaymentSaveStatus(null), 3000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 animate-fade-in space-y-12">
            <section>
                <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-6 border-b pb-4">Gestion de l'Abonnement</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-4">
                    <PricingCard {...plans.free} current={currentPlan === SubscriptionPlan.FREE} onClick={() => handleChangePlan(SubscriptionPlan.FREE)} />
                    <PricingCard {...plans.essential} current={currentPlan === SubscriptionPlan.ESSENTIAL} onClick={() => handleChangePlan(SubscriptionPlan.ESSENTIAL)} />
                    <PricingCard {...plans.pro} current={currentPlan === SubscriptionPlan.PRO} onClick={() => handleChangePlan(SubscriptionPlan.PRO)} />
                </div>
                 {saveStatus && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 animate-fade-in">
                        <SuccessIcon />
                        <span className="font-semibold">{saveStatus.message}</span>
                    </div>
                )}
            </section>
            
            <section>
                <h2 className="text-2xl font-bold text-gray-800 font-poppins mb-6 border-b pb-4">Moyen de Paiement</h2>
                <div className="max-w-2xl">
                    <p className="text-gray-600 mb-4">
                        Enregistrez un moyen de paiement pour les exports à l'unité (après avoir utilisé vos exports gratuits) ou pour passer à un plan supérieur.
                    </p>
                    <form onSubmit={handleSavePayment} className="bg-light-gray p-6 rounded-lg border space-y-4">
                        <div className="flex gap-4 mb-4">
                            <button type="button" onClick={() => handlePaymentTypeChange('card')} className={`flex-1 p-3 rounded-lg border-2 font-semibold transition ${localPaymentMethod.type === 'card' ? 'border-asso-blue bg-blue-50' : 'border-gray-300 bg-white'}`}>
                                Carte Bancaire
                            </button>
                             <button type="button" onClick={() => handlePaymentTypeChange('paypal')} className={`flex-1 p-3 rounded-lg border-2 font-semibold transition ${localPaymentMethod.type === 'paypal' ? 'border-asso-blue bg-blue-50' : 'border-gray-300 bg-white'}`}>
                                PayPal
                            </button>
                        </div>

                        {localPaymentMethod.type === 'card' && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Numéro de carte</label>
                                    <input type="text" id="cardNumber" value={localPaymentMethod.details.cardNumber || ''} onChange={e => handlePaymentChange({ cardNumber: e.target.value })} className="mt-1 input-field" placeholder="0000 1111 2222 3333" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Date d'expiration</label>
                                        <input type="text" id="expiryDate" value={localPaymentMethod.details.expiryDate || ''} onChange={e => handlePaymentChange({ expiryDate: e.target.value })} className="mt-1 input-field" placeholder="MM/AA" required />
                                    </div>
                                    <div>
                                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                                        <input type="text" id="cvc" value={localPaymentMethod.details.cvc || ''} onChange={e => handlePaymentChange({ cvc: e.target.value })} className="mt-1 input-field" placeholder="123" required />
                                    </div>
                                </div>
                            </div>
                        )}

                        {localPaymentMethod.type === 'paypal' && (
                            <div className="animate-fade-in">
                                <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700">Email PayPal</label>
                                <input type="email" id="paypalEmail" value={localPaymentMethod.details.paypalEmail || ''} onChange={e => handlePaymentChange({ paypalEmail: e.target.value })} className="mt-1 input-field" placeholder="votre.email@paypal.com" required />
                            </div>
                        )}

                        <button type="submit" className="w-full sm:w-auto bg-asso-blue text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition">
                            Enregistrer
                        </button>
                        {paymentSaveStatus && (
                            <div className="flex items-center gap-2 text-green-600 animate-fade-in mt-2">
                                <SuccessIcon />
                                <span className="font-semibold">{paymentSaveStatus}</span>
                            </div>
                        )}
                    </form>
                </div>
            </section>
            
            <style>{`
                .input-field {
                    display: block;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.5rem;
                    background-color: #fff;
                    color: #111827;
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

export default SubscriptionPage;