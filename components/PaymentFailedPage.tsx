import React from 'react';

const PaymentFailedPage: React.FC = () => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-24 text-center animate-fade-in-up">
                <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-poppins font-bold text-gray-800">Paiement Échoué</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
                    Votre paiement n'a pas pu être traité. Aucuns frais n'ont été débités. Veuillez réessayer.
                </p>
                <a 
                    href="#/tarifs" 
                    onClick={(e) => handleNavClick(e, '#/tarifs')} 
                    className="mt-8 inline-block bg-asso-blue text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition shadow-md"
                    style={{borderRadius: '10px'}}
                >
                    Retourner aux tarifs
                </a>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
