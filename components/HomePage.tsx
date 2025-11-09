import React, { useState } from 'react';
// Fix: Import PencilIcon and BookmarkIcon to resolve missing component errors.
import { SparklesIcon, CalendarIcon, CheckBadgeIcon, FolderArrowDownIcon, ClockIcon, ChartBarIcon, ShieldCheckIcon, UserIcon, PencilIcon, BookmarkIcon, XCircleSolidIcon, CheckCircleSolidIcon } from './icons';
import { PublicProject } from '../types';
import { initialPublicProjects } from '../data/initialProjects';
import Logo from './Logo';
import { HeroIllustration } from './FeatureIllustrations';

const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
    window.scrollTo(0, 0);
};

// --- SUB-COMPONENTS ---

const AccordionItem: React.FC<{
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}> = ({ question, answer, isOpen, onClick }) => (
    <div className="border-b border-gray-200">
        <button
            type="button"
            className="flex justify-between items-center w-full py-5 font-medium text-left text-gray-800"
            onClick={onClick}
            aria-expanded={isOpen}
        >
            <span className="text-lg">{question}</span>
            <svg className={`w-6 h-6 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        <div className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
                <p className="pb-5 pr-4 text-gray-600">{answer}</p>
            </div>
        </div>
    </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center flex flex-col items-center">
        <div className="bg-asso-blue/10 text-asso-blue p-4 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="font-poppins text-xl font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-gray-600 flex-grow">{text}</p>
    </div>
);

// --- MAIN COMPONENT ---
const HomePage: React.FC = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const faqData = [
        {
            question: "Comment fonctionne l'IA d'AssoCall ?",
            answer: "Notre IA intervient sur deux plans. D'abord, elle recherche en continu sur le web les derniers appels à projets pertinents pour vous. Ensuite, elle vous assiste dans la rédaction de vos dossiers en générant des textes (résumés, objectifs, etc.) basés sur vos informations, vous faisant gagner un temps précieux."
        },
        {
            question: "Combien coûte AssoCall pour une association ou entreprise ?",
            answer: "AssoCall propose un plan 'Découverte' 100% gratuit qui vous permet de tester les fonctionnalités principales, y compris la recherche IA et l'aide à la rédaction. Pour des besoins plus importants, nous proposons des abonnements payants très accessibles."
        },
        {
            question: "Mes données sont-elles en sécurité ?",
            answer: "Absolument. La sécurité et la confidentialité de vos données sont notre priorité. Elles sont hébergées en France, chiffrées, et nous sommes entièrement conformes au RGPD. Vos candidatures ne sont visibles que par vous et, si vous le décidez, par les financeurs que vous ciblez."
        },
        {
            question: "Puis-je gérer des projets que j'ai trouvés ailleurs ?",
            answer: "Oui ! La fonctionnalité 'Candidature Spontanée' est conçue pour cela. Vous pouvez créer un dossier de A à Z pour n'importe quel projet, qu'il provienne de notre plateforme ou d'une autre source, et utiliser nos outils d'IA pour le préparer."
        },
    ];

    return (
        <div className="bg-light-gray">
            {/* Hero Section */}
            <section className="py-20 md:py-28 overflow-hidden">
                <div className="container mx-auto px-6">
                     <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left animate-fade-in-right">
                            <div className="inline-flex items-center gap-2 bg-asso-blue/10 text-asso-blue font-bold px-4 py-2 rounded-full text-sm mb-4">
                                <CheckBadgeIcon />
                                <span>N°1 de la gestion des subventions associatives locales</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-gray-800 leading-tight">
                                Gérez vos subventions avec <Logo containerClassName="text-4xl md:text-5xl lg:text-6xl" />, <br/>le copilote IA des associations.
                            </h1>
                            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl md:max-w-none">
                               Trouvez les bons financements, montez des dossiers percutants et gérez vos projets sans effort. L'outil qui maximise vos chances de succès.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                                <a href="#/projets" onClick={(e) => handleNavClick(e, '#/projets')} className="bg-asso-blue text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition text-center shadow-lg hover:shadow-xl" style={{borderRadius: '10px'}}>
                                    Trouver un projet
                                </a>
                                <a href="#/fonctionnalites" onClick={(e) => handleNavClick(e, '#/fonctionnalites')} className="bg-white font-bold text-asso-blue px-8 py-3 rounded-lg hover:bg-gray-50 transition text-center border border-gray-300" style={{borderRadius: '10px'}}>
                                    Voir les fonctionnalités
                                </a>
                            </div>
                        </div>
                        <div className="hidden md:block relative">
                            {/* Geometric Background */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-asso-blue/10 rounded-3xl transform -rotate-6 -z-10 animate-fade-in-left" style={{animationDelay: '0.2s'}}></div>
                            
                            {/* Floating Card 1 */}
                            <div className="absolute top-16 -left-12 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-200 animate-float w-64 z-10">
                                <p className="font-poppins font-bold text-gray-500 text-xs">Conseil Dép. Dordogne</p>
                                <p className="mt-1 font-poppins font-semibold text-sm text-gray-800">Soutien aux Festivals Ruraux</p>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-800">
                                        Ouvert
                                    </span>
                                    <span className="font-bold text-asso-blue text-sm">5 000€</span>
                                </div>
                            </div>

                            {/* Floating Card 2 */}
                            <div className="absolute bottom-16 -right-12 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-200 animate-float-reverse w-64 z-10">
                                <p className="font-poppins font-bold text-gray-500 text-xs">Région Nouvelle-Aquitaine</p>
                                <p className="mt-1 font-poppins font-semibold text-sm text-gray-800">Initiatives pour la Biodiversité</p>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-800">
                                        Ouvert
                                    </span>
                                    <span className="font-bold text-asso-blue text-sm">Variable</span>
                                </div>
                            </div>
                            
                            {/* The Illustration */}
                            <div className="relative animate-fade-in-left">
                                <HeroIllustration />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Problem vs Solution Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div className="bg-red-50 p-8 rounded-lg border-2 border-red-200 animate-fade-in-right">
                            <h2 className="font-poppins text-3xl font-bold text-red-800">Le Problème</h2>
                            <p className="text-red-700 mt-2">Trop de temps perdu, pas assez de financements.</p>
                            <ul className="mt-6 space-y-6">
                                <li className="flex items-start gap-4"><div className="flex-shrink-0 pt-1"><XCircleSolidIcon /></div><div><h4 className="font-bold text-gray-800 text-lg">Recherche fastidieuse</h4><p className="text-gray-600">Des heures à chercher des appels à projets éparpillés sur 10 sites différents.</p></div></li>
                                <li className="flex items-start gap-4"><div className="flex-shrink-0 pt-1"><XCircleSolidIcon /></div><div><h4 className="font-bold text-gray-800 text-lg">Dossiers complexes</h4><p className="text-gray-600">Rédiger un dossier complet demande des jours de travail et des compétences techniques.</p></div></li>
                                <li className="flex items-start gap-4"><div className="flex-shrink-0 pt-1"><XCircleSolidIcon /></div><div><h4 className="font-bold text-gray-800 text-lg">Suivi difficile</h4><p className="text-gray-600">Impossible de suivre toutes les dates limites et l'état de vos candidatures dans un tableur.</p></div></li>
                            </ul>
                        </div>
                         <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200 animate-fade-in-left">
                            <h2 className="font-poppins text-3xl font-bold text-green-800">La Solution AssoCall</h2>
                            <p className="text-green-700 mt-2">Simple, rapide et intelligent.</p>
                             <ul className="mt-6 space-y-6">
                                <li className="flex items-start gap-4"><div className="flex-shrink-0 pt-1"><CheckCircleSolidIcon /></div><div><h4 className="font-bold text-gray-800 text-lg">Tout centralisé</h4><p className="text-gray-600">Tous les appels à projets pertinents en un seul endroit, mis à jour par l'IA.</p></div></li>
                                <li className="flex items-start gap-4"><div className="flex-shrink-0 pt-1"><CheckCircleSolidIcon /></div><div><h4 className="font-bold text-gray-800 text-lg">IA qui rédige pour vous</h4><p className="text-gray-600">Générez des dossiers de candidature complets en quelques minutes grâce à notre assistant.</p></div></li>
                                <li className="flex items-start gap-4"><div className="flex-shrink-0 pt-1"><CheckCircleSolidIcon /></div><div><h4 className="font-bold text-gray-800 text-lg">Suivi automatique</h4><p className="text-gray-600">Un tableau de bord unique pour toutes vos candidatures, avec des rappels sur les échéances.</p></div></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

             {/* Features Section */}
            <section className="bg-light-gray py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-800">Tout pour réussir vos demandes</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Des fonctionnalités pensées pour les associations, les entreprises et les mairies.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        <FeatureCard icon={<FolderArrowDownIcon />} title="Centralisez vos appels à projets" text="Fini les recherches interminables. Tous les appels à projets pertinents centralisés sur une seule plateforme." />
                        <FeatureCard icon={<PencilIcon />} title="IA pour structurer vos projets" text="Notre assistant intelligent vous aide à transformer vos idées en dossiers complets et conformes aux attentes des financeurs." />
                        <FeatureCard icon={<ClockIcon />} title="Gagnez un temps précieux" text="Réduisez de 70% le temps passé sur la recherche de financements et la rédaction de dossiers de candidature." />
                        <FeatureCard icon={<BookmarkIcon />} title="Suivi en temps réel" text="Suivez l'avancement de toutes vos candidatures depuis un tableau de bord unique et ne ratez plus aucune échéance." />
                        <FeatureCard icon={<ChartBarIcon />} title="Statistiques et reporting" text="Analysez vos taux de succès, identifiez les meilleures opportunités et optimisez votre stratégie de financement." />
                        <FeatureCard icon={<ShieldCheckIcon />} title="Sécurisé et confidentiel" text="Vos données sont protégées et hébergées en France. Conformité totale au RGPD garantie." />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-800">
                            Questions Fréquemment Posées
                        </h2>
                    </div>
                    <div>
                        {faqData.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openFaqIndex === index}
                                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Final CTA */}
            <section className="py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-800">
                        Prêt à transformer votre recherche de financements ?
                    </h2>
                     <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Rejoignez des centaines de structures qui ont simplifié leurs demandes de subventions.
                    </p>
                    <a href="#/signup" onClick={(e) => handleNavClick(e, '#/signup')} className="mt-8 inline-block bg-asso-blue text-white font-bold py-4 px-10 rounded-lg hover:opacity-90 transition shadow-lg text-lg" style={{borderRadius: '10px'}}>
                        Créer mon compte gratuitement
                    </a>
                    <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-2 text-gray-500">
                        <span>✓ Plan Découverte gratuit</span>
                        <span>✓ Aucune carte bancaire requise</span>
                        <span>✓ Démarrez en 2 minutes</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;