import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Meteors from '../components/Meteors';
import RotatingText from '../components/RotatingText';
import CollegesScroller from '../components/CollegesScroller';
import FAQ from '../components/FAQ';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const Home = () => {
  const rotatingTexts = [
    'Research Published',
    'Strong STEM-career',
    'Network of Researchers'
  ];

  const faqItems = [
    {
      question: "What is Synthica?",
      answer: "Synthica is a global organization that empowers high school students to conduct research and participate in competitions, providing free access to curriculum, mentorship, and opportunities."
    },
    {
      question: "How much does it cost to join Synthica?",
      answer: "Synthica is completely free! We believe research opportunities should be accessible to all students regardless of their financial background."
    },
    {
      question: "How can I join the community?",
      answer: "Simply join our Discord server! You'll find thousands of other students and educational resources ready to help you on your research journey."
    },
    {
      question: "What is the Synthica Competition?",
      answer: "The Synthica Competition is a global research competition where high school students present their research projects. Winners get published in our journal and receive prizes."
    },
    {
      question: "Do I need prior research experience?",
      answer: "No! Synthica is designed for students at all levels. Our curriculum starts with the basics and guides you through every step of the research process."
    }
  ];

  return (
    <div className="home-page">
      <div className="header" id="home">
        <Meteors />
        <Navbar />

        <div className="hero-content">
          <h1>Research made<br />approachable for <span className="highlight-you">YOU</span></h1>
          <p>Synthica creates a playground for high school students to conduct research and participate in competitions regardless of their levels.</p>
          <div className="hero-cta-row">
            <a href="https://discord.gg/8wPzZkGy5Z" target="_blank" rel="noopener noreferrer" className="hero-cta-btn">Join Us Now</a>
            <a href="/login" className="hero-portal-btn">Member Portal →</a>
          </div>
        </div>

        <CollegesScroller />
      </div>

      <section className="features-platform">
        <div className="container">
          <div className="platform-badge">Overview</div>
          <h2 className="platform-title">
            At <span className="synthica-highlight">Synthica</span>, you will get a<br />
            <RotatingText texts={rotatingTexts} />
          </h2>
          <p className="platform-subtitle">Avoid those scam programs costing thousands of dollars and get access to a free community of researchers from all over the world.</p>
          
          <div className="features-grid">
            <motion.div className="feature-card" {...fadeIn}>
              <div className="people-images-grid">
                <img src="/assets/feature-card-1/pic-1.png" alt="Student" className="people-image" />
                <img src="/assets/feature-card-1/pic-2.png" alt="Professor" className="people-image" />
                <img src="/assets/feature-card-1/pic-3.png" alt="Researcher" className="people-image" />
              </div>
              <p className="feature-description">Participate in our elite network of high school, university, and PhD students alongside professors.</p>
            </motion.div>

            <motion.div className="feature-card" {...fadeIn}>
              <div className="stat-number">50+</div>
              <p className="feature-description">Countries located in Asia, Europe, and North America</p>
            </motion.div>

            <motion.div className="feature-card" {...fadeIn}>
              <div className="stat-number">5000+</div>
              <p className="feature-description">Researchers as members of Synthica worldwide</p>
            </motion.div>

            <motion.div className="feature-card feature-card-with-preview" {...fadeIn}>
              <p className="feature-card-description">Improve your research skills with our curriculum reviewed by top university professors.</p>
              <div className="preview-card mini-preview curriculum-card">
                <div className="curriculum-header">
                  <h3 className="curriculum-title">Synthica Curriculum</h3>
                  <span className="curriculum-icon">⭐</span>
                </div>
                <div className="curriculum-divider"></div>
                <div className="curriculum-content">
                  <div className="curriculum-module">
                    <h4 className="module-title">Module 0: Welcome to Research</h4>
                    <ul className="module-list">
                      <li>What is research?</li>
                      <li>What makes a good researcher?</li>
                      <li>How to properly contribute to a research?</li>
                    </ul>
                  </div>
                  <div className="curriculum-module">
                    <h4 className="module-title">Module 1: Foundations of Research Literacy</h4>
                    <ul className="module-list">
                      <li>How to read a research paper</li>
                      <li>How to create a research question</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="how-it-works-container">
          <h2 className="how-it-works-title">Want to know how we work?<br /><span className="blue-highlight">Here's how.</span></h2>
          <p className="how-it-works-subtitle">Learn how Synthica works and become a part of us.</p>

          <div className="steps-container">
            {[
              { num: 1, title: 'Join our <span class="yellow-highlight">Research Community</span>', desc: 'Become part of our global network of student researchers by joining our Discord server and connecting with peers.' },
              { num: 2, title: 'Learn from our <span class="yellow-highlight">Expert Curriculum</span>', desc: 'Access our high-quality research curriculum and learn the foundations of academic research at your own pace.' },
              { num: 3, title: 'Develop your <span class="yellow-highlight">Research Project</span>', desc: 'Apply what you\'ve learned to create your own original research project, with guidance from our community resources.' },
              { num: 4, title: 'Participate in <span class="yellow-highlight">Global Research Events</span>', desc: 'Showcase your findings at our international research competitions and earn recognition for your work.' }
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
          <h2 className="comparison-title">Zero cost.<br />Non-selective Program.</h2>
          <div className="comparison-grid">
            <motion.div className="comparison-card scam-card" {...fadeIn}>
              <h3 className="comparison-card-title">Scam Programs</h3>
              <ul className="comparison-list">
                <li>Thousands of dollars</li>
                <li>Exclusive to extra-nerdy students</li>
                <li>Zero opportunity to lead or contribute significantly to anything</li>
              </ul>
            </motion.div>
            <motion.div className="comparison-card synthica-card" {...fadeIn}>
              <h3 className="comparison-card-title"><span className="yellow-text synthica-glow">Synthica</span></h3>
              <ul className="comparison-list">
                <li>Zero money spent</li>
                <li>Open to all high school students</li>
                <li>Opportunity to lead a team and contribute in a research project</li>
              </ul>
            </motion.div>
          </div>
          <motion.img src="/assets/college-logo/harvard.png" alt="Harvard" className="floating-logo logo-1" {...fadeIn} />
          <motion.img src="/assets/college-logo/stanford.png" alt="Stanford" className="floating-logo logo-2" {...fadeIn} />
          <motion.img src="/assets/college-logo/mit.png" alt="MIT" className="floating-logo logo-3" {...fadeIn} />
          <motion.img src="/assets/college-logo/duke.png" alt="Duke" className="floating-logo logo-4" {...fadeIn} />
        </div>
      </section>

      <FAQ items={faqItems} />
      <Footer />
    </div>
  );
};

export default Home;
