import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import Logo from './Logo';

interface SignUpPageProps {
    onSignUp: (userName: string, role: UserRole, email: string) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        window.location.hash = href;
        window.scrollTo(0, 0);
    };
    
    const [associationName, setAssociationName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.ASSOCIATION);
    const [isRoleLocked, setIsRoleLocked] = useState(false);

    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.split('?')[1]);
        const roleFromUrl = params.get('role');

        if (roleFromUrl === UserRole.MAIRIE) {
            setRole(UserRole.MAIRIE);
            setIsRoleLocked(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }
        // Simulate creating an account and logging in
        console.log('Creating account for:', { associationName, email, role });
        onSignUp(associationName, role, email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-gray p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg m-4 animate-fade-in-up">
                <div className="text-center">
                     <a href="#/" onClick={(e) => handleNavClick(e, '#/')} className="inline-block">
                        <Logo containerClassName="text-4xl" />
                    </a>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">
                        Créez votre compte AssoCall
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                       Rejoignez-nous et simplifiez vos réponses aux appels d'offres.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                     <div>
                        <label htmlFor="association-name" className="sr-only">Nom de la structure (association, entreprise...)</label>
                        <input
                            id="association-name"
                            name="association-name"
                            type="text"
                            required
                            value={associationName}
                            onChange={(e) => setAssociationName(e.target.value)}
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-asso-blue focus:border-asso-blue sm:text-sm"
                            placeholder="Nom de la structure"
                            style={{borderRadius: '10px'}}
                        />
                    </div>
                    <div>
                        <label htmlFor="email-address" className="sr-only">Adresse email</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-asso-blue focus:border-asso-blue sm:text-sm"
                            placeholder="Adresse email"
                             style={{borderRadius: '10px'}}
                        />
                    </div>
                     <div>
                        <label htmlFor="password" className="sr-only">Mot de passe</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-asso-blue focus:border-asso-blue sm:text-sm"
                            placeholder="Mot de passe"
                             style={{borderRadius: '10px'}}
                        />
                    </div>
                     <div>
                        <label htmlFor="confirm-password" className="sr-only">Confirmer le mot de passe</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-asso-blue focus:border-asso-blue sm:text-sm"
                            placeholder="Confirmer le mot de passe"
                             style={{borderRadius: '10px'}}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Vous êtes :</label>
                        <div className="grid grid-cols-2 gap-4">
                            {(Object.values(UserRole)).filter(r => r !== UserRole.ADMIN).map((userRole) => (
                                <label key={userRole} className={`flex items-center justify-center p-3 border-2 rounded-lg ${role === userRole ? 'border-asso-blue bg-blue-50' : 'border-gray-200'} ${isRoleLocked && userRole !== UserRole.MAIRIE ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value={userRole}
                                        checked={role === userRole}
                                        onChange={() => setRole(userRole)}
                                        disabled={isRoleLocked && userRole !== UserRole.MAIRIE}
                                        className="h-4 w-4 text-asso-blue focus:ring-asso-blue border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700 capitalize font-semibold">{userRole}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-asso-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                             style={{borderRadius: '10px'}}
                        >
                            Créer mon compte
                        </button>
                    </div>
                </form>
                 <div className="text-sm text-center">
                    <p className="text-gray-600">
                        Déjà un compte ?{' '}
                        <a href="#/login" onClick={(e) => handleNavClick(e, '#/login')} className="font-medium text-asso-blue hover:text-blue-700">
                            Se connecter
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;