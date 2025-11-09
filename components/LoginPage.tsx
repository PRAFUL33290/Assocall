import React, { useState } from 'react';
import { EmailIcon, LockIcon } from './icons';
import Logo from './Logo';

interface LoginPageProps {
    onLogin: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
        window.scrollTo(0, 0);
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Logging in with:', { email, password });
        onLogin(email);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-light-gray p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg m-4 animate-fade-in-up">
                <div className="text-center">
                    <a href="#/" onClick={(e) => handleNavClick(e, '#/')} className="inline-block">
                        <Logo containerClassName="text-4xl" />
                    </a>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">
                        Connectez-vous à votre compte
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label htmlFor="email-address" className="sr-only">Adresse email</label>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <EmailIcon />
                        </div>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-asso-blue focus:border-asso-blue sm:text-sm"
                            placeholder="Adresse email"
                            style={{borderRadius: '10px'}}
                        />
                    </div>
                     <div className="relative">
                        <label htmlFor="password" className="sr-only">Mot de passe</label>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <LockIcon />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-asso-blue focus:border-asso-blue sm:text-sm"
                            placeholder="Mot de passe"
                             style={{borderRadius: '10px'}}
                        />
                    </div>

                    <div className="flex items-center justify-end">
                        <div className="text-sm">
                            <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-asso-blue hover:text-blue-700">
                                Mot de passe oublié ?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-asso-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                             style={{borderRadius: '10px'}}
                        >
                            Se connecter
                        </button>
                    </div>
                </form>
                 <div className="text-sm text-center">
                    <p className="text-gray-600">
                        Pas encore de compte ?{' '}
                        <a href="#/signup" onClick={(e) => handleNavClick(e, '#/signup')} className="font-medium text-asso-blue hover:text-blue-700">
                            Créez-en un
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;