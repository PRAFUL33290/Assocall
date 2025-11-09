import React from 'react';

interface PlaceholderPageProps {
    title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-24 text-center">
                <h1 className="text-4xl font-poppins font-bold text-gray-800">{title}</h1>
                <p className="mt-4 text-lg text-gray-600">Cette page est en cours de construction.</p>
                <a href="#/" onClick={(e) => handleNavClick(e, '#/')} className="mt-8 inline-block bg-asso-blue text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition" style={{borderRadius: '10px'}}>
                    Retour à l'accueil
                </a>
            </div>
        </div>
    );
};

export default PlaceholderPage;