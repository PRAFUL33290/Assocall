import React, { useState } from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
    window.scrollTo(0, 0); // Scroll to top on navigation
  };
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
        setFeedback({ type: 'error', message: 'Veuillez entrer une adresse email valide.' });
        setTimeout(() => setFeedback(null), 3000);
        return;
    }

    // --- Logique pour l'administrateur ---
    const ADMIN_EMAIL = 'contact@assocall.fr'; // L'adresse de l'administrateur
    const subject = encodeURIComponent("Nouvelle inscription à la newsletter AssoCall");
    const body = encodeURIComponent(`Bonjour,\n\nUne nouvelle personne s'est inscrite avec l'adresse e-mail suivante :\n\n${email}\n\nCordialement,\nLe site AssoCall`);
    
    // Ouvre le client de messagerie de l'utilisateur
    window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;

    // --- Feedback pour l'utilisateur ---
    setFeedback({ type: 'success', message: `Merci ! Veuillez finaliser l'envoi via votre application d'e-mail.` });
    setEmail('');
    
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <footer className="bg-footer-dark text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Logo containerClassName="text-2xl" />
            <p className="mt-4 text-gray-300">
              La plateforme intelligente qui simplifie la réponse aux appels d'offres pour les associations et entreprises.
            </p>
          </div>
          <div>
            <h4 className="font-poppins font-bold text-lg">Liens utiles</h4>
            <ul className="mt-4 space-y-2 text-gray-300">
              <li><a href="#/fonctionnalites" onClick={(e) => handleNavClick(e, '#/fonctionnalites')} className="hover:text-asso-blue transition">Fonctionnalités</a></li>
              <li><a href="#/tarifs" onClick={(e) => handleNavClick(e, '#/tarifs')} className="hover:text-asso-blue transition">Tarifs</a></li>
              <li><a href="#/contact" onClick={(e) => handleNavClick(e, '#/contact')} className="hover:text-asso-blue transition">Contact</a></li>
              <li><a href="#/mentions" onClick={(e) => handleNavClick(e, '#/mentions')} className="hover:text-asso-blue transition">Mentions légales</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-poppins font-bold text-lg">S'inscrire à notre newsletter</h4>
            <p className="mt-4 text-gray-300">
              Recevez les derniers appels à projets et nos conseils directement dans votre boîte mail.
            </p>
            <form className="mt-4" onSubmit={handleNewsletterSubmit}>
                <div className="flex gap-2">
                    <label htmlFor="footer-email" className="sr-only">Adresse email</label>
                    <input
                        id="footer-email"
                        type="email"
                        name="email"
                        placeholder="Votre email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow px-4 py-2 bg-brand-light text-white border border-brand-lighter rounded-lg focus:ring-2 focus:ring-asso-blue focus:outline-none transition"
                        style={{borderRadius: '10px'}}
                    />
                    <button
                        type="submit"
                        className="bg-asso-blue text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition"
                        style={{borderRadius: '10px'}}
                    >
                        OK
                    </button>
                </div>
                 {feedback && (
                    <p className={`mt-2 text-sm h-5 transition-opacity duration-300 ${
                        feedback.type === 'success' ? 'text-green-400' :
                        feedback.type === 'error' ? 'text-red-400' :
                        'text-blue-400'
                    }`}>
                        {feedback.message}
                    </p>
                )}
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} <Logo containerClassName="text-base" /> — Votre AssoCall AI pour vos candidatures.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;