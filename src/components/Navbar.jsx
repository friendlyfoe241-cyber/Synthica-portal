import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserAuth } from '../hooks/useUserAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const location = useLocation();
  const { user, userProfile } = useUserAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (name) => setHoveredDropdown(name);
  const handleMouseLeave = () => setHoveredDropdown(null);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo">
        <img src="/assets/logo/Synthica Logo.png" alt="Synthica Logo" className="logo-icon" />
        <span className="logo-text">Synthica</span>
      </Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li
          className={`nav-item-dropdown ${hoveredDropdown === 'about' ? 'active' : ''}`}
          onMouseEnter={() => handleMouseEnter('about')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/about" className="nav-link-dropdown">About</Link>
          <ul className="dropdown-menu">
            <li><Link to="/about#mission">Our Mission</Link></li>
            <li><Link to="/about#team">Our Team</Link></li>
          </ul>
        </li>
        <li
          className={`nav-item-dropdown ${hoveredDropdown === 'programs' ? 'active' : ''}`}
          onMouseEnter={() => handleMouseEnter('programs')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/research-group" className="nav-link-dropdown">Programs</Link>
          <ul className="dropdown-menu">
            <li><a href="https://globalresearchchallenge.org" target="_blank" rel="noopener noreferrer">Competition</a></li>
            <li><Link to="/sister-program">SISTER Program</Link></li>
            <li><Link to="/research-group">Research Group</Link></li>
            <li><Link to="/free-course">Free Course</Link></li>
          </ul>
        </li>
        <li
          className={`nav-item-dropdown ${hoveredDropdown === 'journal' ? 'active' : ''}`}
          onMouseEnter={() => handleMouseEnter('journal')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/journal" className="nav-link-dropdown">Journal</Link>
          <ul className="dropdown-menu">
            <li><Link to="/journal">Author Guidelines</Link></li>
            <li><Link to="/editorial-board">Editorial Board</Link></li>
          </ul>
        </li>
        <li
          className={`nav-item-dropdown ${hoveredDropdown === 'community' ? 'active' : ''}`}
          onMouseEnter={() => handleMouseEnter('community')}
          onMouseLeave={handleMouseLeave}
        >
          <span className="nav-link-dropdown" style={{ cursor: 'pointer' }}>Community</span>
          <ul className="dropdown-menu">
            <li><Link to="/research-hub">Research Hub</Link></li>
            <li><Link to="/application-hub">Application Hub</Link></li>
          </ul>
        </li>
        <li
          className={`nav-item-dropdown ${hoveredDropdown === 'work' ? 'active' : ''}`}
          onMouseEnter={() => handleMouseEnter('work')}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/work-with-us" className="nav-link-dropdown">Work with us</Link>
          <ul className="dropdown-menu">
            <li><Link to="/work-with-us#partnerships">Partnerships</Link></li>
            <li><Link to="/work-with-us#sponsors">Sponsorships</Link></li>
          </ul>
        </li>
      </ul>
      {user ? (
        <Link to="/dashboard" className="join-btn">
          {userProfile?.photoURL
            ? <img src={userProfile.photoURL} alt="" style={{ width: 20, height: 20, borderRadius: '50%', marginRight: 6 }} />
            : null}
          Dashboard
        </Link>
      ) : (
        <Link to="/login" className="join-btn">Sign In</Link>
      )}
    </nav>
  );
};

export default Navbar;
