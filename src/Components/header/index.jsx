import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import style from './header.module.css'
import { FaHome, FaInfo, FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={style.header}>
      <div className={style.headerContent}>
        <Link to="/" className={style.logoLink}>
           <h1>Emprego Já</h1>
        </Link>
      </div>
        <nav className={`${style.nav} ${style.desktopNav}`}>
          <ul className={style.navLinks}>
            <li><Link to="/" className={style.navLink}><FaHome size={20} /> Home</Link></li>
            <li><Link to="/about" className={style.navLink}><FaInfo size={20} /> Sobre</Link></li>
          </ul>
        </nav>

        <button className={style.mobileMenuButton} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />} 
        </button>

        {isMobileMenuOpen && (
          <nav className={style.mobileNavMenu}>
            <ul className={style.mobileNavLinks}>
               <li><Link to="/" className={style.mobileNavLink} onClick={toggleMobileMenu}><FaHome size={20} /> Home</Link></li>
               <li><Link to="/about" className={style.mobileNavLink} onClick={toggleMobileMenu}><FaInfo size={20} /> Sobre</Link></li>
            </ul>
          </nav>
        )}
    </header>
  )
}
