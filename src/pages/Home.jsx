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

const features = [
  {
    icon: '🔬',
    title: 'Project Management',
    desc: 'Create and manage research projects with your team. Assign tasks, track progress, and collaborate in real-time.'
  },
  {
    icon: '📋',
    title: 'Role-Based Dashboards',
    desc: 'Role-specific dashboards for Chapter Leaders, Lead Researchers, Associate Researchers, and Independent Researchers.'
  },
  {
    icon: '👥',
    title: 'Team Collaboration',
    desc: 'Work together with announcements, shared reading lists, and team management tools.'
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    desc: 'Track your research goals, reading lists, and personal notes in one organized space.'
  },
  {
    icon: '🔒',
    title: 'Secure Authentication',
    desc: 'Sign in with Google to access your personalized dashboard and data.'
  },
  {
    icon: '🚀',
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
