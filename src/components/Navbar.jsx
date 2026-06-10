import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../hooks/useUserAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUserAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo">
        <img src="/assets/logo/Synthica Logo.png" alt="Synthica Logo" className="logo-icon" />
        <span className="logo-text">Synthica</span>
      </Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {user && (
          <>
            <li><Link to="/research-hub">Research Hub</Link></li>
            <li><Link to="/application-hub">Application Hub</Link></li>
          </>
        )}
      </ul>
      {user ? (
        <Link to="/dashboard" className="join-btn">Dashboard</Link>
      ) : (
        <Link to="/login" className="join-btn">Sign In</Link>
      )}
    </nav>
  );
};

export default Navbar;
