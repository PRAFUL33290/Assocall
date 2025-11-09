import React, { useState } from 'react';
import Logo from './Logo';

interface HeaderProps {
  currentRoute: string;
  isAuthenticated: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentRoute, isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
      { href: '#/', label: 'Accueil' },
      { href: '#/fonctionnalites', label: 'Fonctionnalités' },
      { href: '#/projets', label: 'Appels à projets' },
      { href: '#/tarifs', label: 'Tarifs' },
      { href: '#/aide', label: 'Aide' },
      { href: '#/contact', label: 'Contact' },
    ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
    window.scrollTo(0, 0);
    if (isMenuOpen) {
        setIsMenuOpen(false);
    }
  };

   const handleLogoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    }
    if (isMenuOpen) {
        setIsMenuOpen(false);
    }
  };


  const getLinkClass = (href: string) => {
    const isActive = currentRoute === href;
    return `relative font-semibold text-gray-700 hover:text-asso-blue transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-asso-blue after:transition-transform after:duration-300 ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'} after:origin-center hover:after:scale-x-100`;
  };
  
  const getMobileLinkClass = (href: string) => {
    const isActive = currentRoute === href;
    return isActive 
      ? 'text-asso-blue font-bold text-xl'
      : 'text-gray-700 hover:text-asso-blue transition font-semibold text-xl';
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 h-24">
        <div className="container mx-auto px-6 h-full flex justify-between items-center">
          <a href="#/" onClick={(e) => handleNavClick(e, '#/')} className="transition-transform hover:scale-105">
            <Logo containerClassName="text-3xl" />
          </a>
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className={getLinkClass(link.href)}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
               <>
                <a href="#/dashboard" onClick={(e) => handleNavClick(e, '#/dashboard')} className="font-bold text-asso-blue border-2 border-asso-blue px-4 py-2 rounded-lg hover:bg-blue-50 transition" style={{borderRadius: '10px'}}>
                    Tableau de bord
                </a>
                <button onClick={handleLogoutClick} className="font-bold text-white bg-asso-blue px-4 py-2 rounded-lg hover:opacity-90 transition" style={{borderRadius: '10px'}}>
                    Se déconnecter
                </button>
               </>
            ) : (
              <>
                <a href="#/login" onClick={(e) => handleNavClick(e, '#/login')} className="font-bold text-asso-blue px-4 py-2 rounded-lg hover:bg-blue-50 transition" style={{borderRadius: '10px'}}>
                  Se connecter
                </a>
                <a href="#/signup" onClick={(e) => handleNavClick(e, '#/signup')} className="font-bold text-white bg-asso-blue px-4 py-2 rounded-lg hover:opacity-90 transition" style={{borderRadius: '10px'}}>
                  Créer un compte
                </a>
              </>
            )}
          </div>
           <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(true)} aria-label="Open Menu">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
              </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex justify-end p-6">
           <button onClick={() => setIsMenuOpen(false)} aria-label="Close Menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
           </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full -mt-16">
            <div className="flex flex-col space-y-8 text-center">
                {navLinks.map(link => (
                    <a key={link.href} href={link.href} className={getMobileLinkClass(link.href)} onClick={(e) => handleNavClick(e, link.href)}>
                    {link.label}
                    </a>
                ))}
            </div>
            <div className="absolute bottom-10 flex flex-col w-full px-6 space-y-4">
                {isAuthenticated ? (
                    <>
                        <a href="#/dashboard" onClick={(e) => handleNavClick(e, '#/dashboard')} className="w-full text-center font-bold text-asso-blue border-2 border-asso-blue px-4 py-3 rounded-lg hover:bg-blue-50 transition" style={{borderRadius: '10px'}}>
                            Tableau de bord
                        </a>
                        <button onClick={handleLogoutClick} className="w-full text-center font-bold text-white bg-asso-blue px-4 py-3 rounded-lg hover:opacity-90 transition" style={{borderRadius: '10px'}}>
                            Se déconnecter
                        </button>
                    </>
                ) : (
                    <>
                         <a href="#/login" onClick={(e) => handleNavClick(e, '#/login')} className="w-full text-center font-bold text-asso-blue border-2 border-asso-blue px-4 py-3 rounded-lg hover:bg-blue-50 transition" style={{borderRadius: '10px'}}>
                            Se connecter
                        </a>
                        <a href="#/signup" onClick={(e) => handleNavClick(e, '#/signup')} className="w-full text-center font-bold text-white bg-asso-blue px-4 py-3 rounded-lg hover:opacity-90 transition" style={{borderRadius: '10px'}}>
                            Créer un compte
                        </a>
                    </>
                )}
            </div>
        </nav>
      </div>
    </>
  );
};

export default Header;