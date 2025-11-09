import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <div className="bg-light-gray">
             <section className="py-20 text-center">
                <div className="container mx-auto px-6 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-800">
                        Contactez-nous
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous répondre.
                    </p>
                </div>
            </section>
            
            <section className="container mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-xl border border-gray-100">
                    {/* Info Column */}
                    <div>
                        <h2 className="font-poppins text-3xl font-bold text-gray-800">Nos coordonnées</h2>
                        <p className="mt-4 text-gray-600">N'hésitez pas à nous envoyer un email, nous vous répondrons dans les plus brefs délais. Vous pouvez aussi remplir le formulaire de contact.</p>
                        <div className="mt-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-asso-blue/10 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-asso-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Email</h3>
                                    <a href="mailto:contact@assocall.fr" className="text-gray-700 hover:text-asso-blue">contact@assocall.fr</a>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-asso-blue/10 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-asso-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Adresse</h3>
                                    <span className="text-gray-700">Paris, France</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Column */}
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray-700">Nom complet</label>
                            <input type="text" id="name" name="name" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asso-blue focus:border-asso-blue" style={{borderRadius: '10px'}} />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700">Adresse email</label>
                            <input type="email" id="email" name="email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asso-blue focus:border-asso-blue" style={{borderRadius: '10px'}} />
                        </div>
                         <div>
                            <label htmlFor="subject" className="block text-sm font-bold text-gray-700">Sujet</label>
                            <input type="text" id="subject" name="subject" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asso-blue focus:border-asso-blue" style={{borderRadius: '10px'}} />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-bold text-gray-700">Message</label>
                            <textarea id="message" name="message" rows={4} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asso-blue focus:border-asso-blue" style={{borderRadius: '10px'}}></textarea>
                        </div>
                        <div>
                             <button type="submit" className="w-full bg-asso-blue text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition" style={{borderRadius: '10px'}}>
                                Envoyer le message
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;