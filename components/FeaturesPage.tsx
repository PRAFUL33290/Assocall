import React from 'react';
import { TargetIcon, PencilIcon, CheckListIcon, BuildingIcon } from './icons';
import { FeatureIllustration1, FeatureIllustration2, FeatureIllustration3, FeatureIllustration4 } from './FeatureIllustrations';


const FeaturesPage: React.FC = () => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
        window.scrollTo(0, 0);
    };

    const features = [
        {
            icon: <TargetIcon />,
            title: "Veille Intelligente des Appels à Projets",
            text: "Notre AssoCall AI analyse en continu des centaines de sources pour vous proposer les appels à projets qui correspondent à votre domaine d'action. Notre recherche se concentre sur la Nouvelle-Aquitaine et la Gironde, mais s'étend à toute la France. Fini les heures de recherche, concentrez-vous sur l'essentiel.",
            illustration: <FeatureIllustration1 />,
        },
        {
            icon: <PencilIcon />,
            title: "AssoCall AI de Rédaction",
            text: "Bloqué devant la page blanche ? Notre AssoCall AI vous aide à brainstormer, à structurer vos dossiers et à rédiger des paragraphes entiers. L'objectif : transformer une simple idée en une demande de subvention ou une réponse à un appel d'offres convaincante et bien argumentée, pour faire la différence.",
            illustration: <FeatureIllustration2 />,
        },
        {
            icon: <CheckListIcon />,
            title: "Centralisation & Suivi en Temps Réel",
            text: "Gérez toutes vos candidatures depuis un tableau de bord unique et intuitif. Suivez le statut de chaque dossier (en cours, soumis, accepté, refusé) et ne manquez plus jamais une date limite grâce à notre système de rappels automatiques.",
            illustration: <FeatureIllustration3 />,
        },
        {
            icon: <BuildingIcon />,
            title: "Connexion Directe avec les Mairies",
            text: "AssoCall simplifie la communication. Déposez vos dossiers de candidature directement sur la plateforme. Les financeurs reçoivent une notification et peuvent consulter votre projet dans un format standardisé et clair.",
            illustration: <FeatureIllustration4 />,
        }
    ];


    return (
        <div className="bg-white">
            <section className="bg-light-gray py-20 text-center">
                <div className="container mx-auto px-6 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-800">
                        Des outils puissants pour transformer vos projets
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        AssoCall centralise les outils pour trouver des opportunités, rédiger des dossiers percutants et gérer vos candidatures. Notre but : vous aider à présenter un dossier solide pour maximiser vos chances d'obtenir un financement, sans toutefois le garantir.
                    </p>
                </div>
            </section>
            
            <section className="py-24">
                <div className="container mx-auto px-6 space-y-16">
                    {features.map((feature, index) => {
                        const isReversed = index % 2 !== 0;
                        return (
                            <div key={index} className="grid md:grid-cols-2 gap-x-16 gap-y-10 items-center">
                                <div className={`
                                    ${isReversed ? 'md:order-last' : 'md:order-first'} 
                                    ${isReversed ? 'animate-fade-in-left' : 'animate-fade-in-right'}
                                `}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-asso-blue/10 p-3 rounded-full text-asso-blue">
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-poppins text-2xl font-bold text-gray-800">{feature.title}</h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed text-lg">{feature.text}</p>
                                </div>
                                <div className={`
                                    ${isReversed ? 'md:order-first' : 'md:order-last'} 
                                    ${isReversed ? 'animate-fade-in-right' : 'animate-fade-in-left'}
                                `}>
                                    {feature.illustration}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

             <section className="bg-asso-blue py-20">
                <div className="container mx-auto px-6 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold">
                        Prêt à donner vie à vos projets ?
                    </h2>
                     <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
                        Rejoignez des centaines de structures qui utilisent déjà AssoCall pour simplifier leur recherche de financements.
                    </p>
                    <a href="#/projets" onClick={(e) => handleNavClick(e, '#/projets')} className="mt-8 inline-block bg-white text-asso-blue font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg" style={{borderRadius: '10px'}}>
                        Découvrir les appels à projets
                    </a>
                </div>
            </section>
        </div>
    );
};

export default FeaturesPage;