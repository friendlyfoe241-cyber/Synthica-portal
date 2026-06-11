import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Meteors from '../components/Meteors';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
};

// SVG Icons - mono-color to match website theme
const icons = {
  project: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2589ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4m-6 0h6"/>
      <rect x="9" y="3" width="6" height="6" rx="1"/>
    </svg>
  ),
  dashboard: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2589ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1"/>
      <rect x="14" y="3" width="7" height="5" rx="1"/>
      <rect x="14" y="12" width="7" height="9" rx="1"/>
      <rect x="3" y="16" width="7" height="5" rx="1"/>
    </svg>
  ),
  team: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2589ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  tracking: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2589ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
    </svg>
  ),
  secure: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2589ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  realtime: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2589ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
};

const features = [
  {
    icon: icons.project,
    title: 'Project Management',
    desc: 'Create and manage research projects with your team. Assign tasks, track progress, and collaborate in real-time.'
  },
  {
    icon: icons.dashboard,
    title: 'Role-Based Dashboards',
    desc: 'Role-specific dashboards for Chapter Leaders, Lead Researchers, Associate Researchers, and Independent Researchers.'
  },
  {
    icon: icons.team,
    title: 'Team Collaboration',
    desc: 'Work together with announcements, shared reading lists, and team management tools.'
  },
  {
    icon: icons.tracking,
    title: 'Progress Tracking',
    desc: 'Track your research goals, reading lists, and personal notes in one organized space.'
  },
  {
    icon: icons.secure,
    title: 'Secure Authentication',
    desc: 'Sign in with Google to access your personalized dashboard and data.'
  },
  {
    icon: icons.realtime,
    title: 'Real-time Updates',
    desc: 'See changes from your team members instantly with live synchronization.'
  }
];

const Home = () => {
  return (
    <div className="home-page">
      <div className="header" id="home">
        <Meteors />
        <Navbar />

        <div className="hero-content">
          <h1>Your Research <br /><span className="highlight-you">Dashboard</span></h1>
          <p>Access your personalized Synthica dashboard to manage projects, collaborate with teams, and track your research journey.</p>
          <div className="hero-cta-row">
            <Link to="/login" className="hero-cta-btn">Sign In / Register</Link>
            <Link to="/dashboard" className="hero-portal-btn">Go to Dashboard →</Link>
          </div>
        </div>
      </div>

      <section className="features-platform">
        <div className="container">
          <div className="platform-badge">Dashboard Features</div>
          <h2 className="platform-title">
            Everything you need for<br />
            <span className="synthica-highlight">Research Collaboration</span>
          </h2>
          <p className="platform-subtitle">A complete platform designed for student researchers to organize, collaborate, and publish their work.</p>
          
          <div className="features-grid">
            {features.map((feature, i) => (
              <motion.div key={i} className="feature-card" {...fadeIn}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="how-it-works-container">
          <h2 className="how-it-works-title">Getting Started<br /><span className="blue-highlight">Is Easy</span></h2>
          <p className="how-it-works-subtitle">Three simple steps to access your dashboard</p>

          <div className="steps-container">
            {[
              { num: 1, title: 'Sign In with <span class="yellow-highlight">Google</span>', desc: 'Click the Sign In button and authenticate with your Google account. It takes just seconds.' },
              { num: 2, title: 'Complete your <span class="yellow-highlight">Profile</span>', desc: 'Apply for a role that matches your interests — Chapter Leader, Lead Researcher, Associate, or Independent Researcher.' },
              { num: 3, title: 'Start <span class="yellow-highlight">Researching</span>', desc: 'Access your role-specific dashboard and begin collaborating on projects with researchers worldwide.' }
            ].map((step, i) => (
              <motion.div key={i} className="step" {...fadeIn}>
                <div className="step-number">{step.num}</div>
                <div className="step-content">
                  <h3 className="step-title" dangerouslySetInnerHTML={{ __html: step.title }} />
                  <p className="step-description">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="comparison-section">
        <div className="comparison-container">
          <h2 className="comparison-title">Free for all<br />high school students</h2>
          <div className="comparison-grid">
            <motion.div className="comparison-card scam-card" {...fadeIn}>
              <h3 className="comparison-card-title">Traditional Programs</h3>
              <ul className="comparison-list">
                <li>Costly application fees</li>
                <li>Selective acceptance</li>
                <li>Limited project ownership</li>
              </ul>
            </motion.div>
            <motion.div className="comparison-card synthica-card" {...fadeIn}>
              <h3 className="comparison-card-title"><span className="yellow-text synthica-glow">Synthica</span></h3>
              <ul className="comparison-list">
                <li>100% free access</li>
                <li>Open to all students</li>
                <li>Lead your own projects</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img src="/assets/logo/Synthica Logo.png" alt="Synthica" className="footer-logo" />
            <span className="footer-name">Synthica</span>
          </div>
          <p className="footer-tagline">Empowering student researchers worldwide</p>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/login">Sign In</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <p className="footer-copy">© 2026 Synthica. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
