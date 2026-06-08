import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const StatBubble = ({ number, label, className }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const end = parseInt(number);
        if (start === end) return;
        
        let totalMilisecondsChildNodes = 2000;
        let counter = setInterval(function() {
          start += 1;
          setCount(start);
          if (start === end) clearInterval(counter);
        }, totalMilisecondsChildNodes / end);
      }
    }, { threshold: 0.5 });

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [number]);

  return (
    <div className={`stat-bubble animate ${className}`} ref={countRef}>
      <div className="stat-number">{count}{number.includes('+') ? '+' : ''}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const About = () => {
  const [showMoreCore, setShowMoreCore] = useState(false);

  const coreTeam = [
    { name: "Tiffany Angelie", role: "Chief Marketing Officer", img: "28.png" },
    { name: "Giridhar Krishnan", role: "Vice Chief Marketing Officer", img: "Synthica Preview Image (5).jpg", isLogo: true },
    { name: "Adda Fangajei", role: "Chief Financial Officer", img: "Synthica Preview Image (5).jpg", isLogo: true },
    { name: "Moksh Patel", role: "Vice Chief Financial Officer", img: "20.png" },
    { name: "Darsh Savajiyani", role: "Human Resources Coordinator", img: "29.png" },
    { name: "Fatma Ezzahra Jlali", role: "Programs Coordinator", img: "Synthica Preview Image (5).jpg", isLogo: true },
    { name: "Anushka Bhagat", role: "Vice Expertise Director", img: "23.png" },
    { name: "Anirudh Balivada", role: "Logistics Director", img: "22.png" },
    { name: "Omar Essetti", role: "Public Relations Director", img: "19.png" },
    { name: "Sofia Dantas", role: "Vice Public Relations Director", img: "Synthica Preview Image (5).jpg", isLogo: true },
    { name: "Harish Ram.", role: "Technical Director", img: "27.png" },
    { name: "Priyadharsni Murali", role: "Vice Technical Director", img: "Synthica Preview Image (5).jpg", isLogo: true },
    { name: "Hansika Mulani", role: "Asia Ambassador", img: "30.png" },
    { name: "Mohammad Osama", role: "Asia Ambassador", img: "24.png" },
    { name: "Pratham Vohra", role: "Asia Ambassador", img: "25.png" },
    { name: "Muzi Kang", role: "Europe Ambassador", img: "Synthica Preview Image (5).jpg", isLogo: true },
    { name: "Iskra Nishio", role: "Europe Ambassador", img: "18.png" },
    { name: "Ha Mai Pham", role: "North America Ambassador", img: "Synthica Preview Image (5).jpg", isLogo: true },
    { name: "Pranav Sainath", role: "North America Ambassador", img: "Synthica Preview Image (5).jpg", isLogo: true },
    { name: "Reddy Yeruva", role: "North America Ambassador", img: "Synthica Preview Image (5).jpg", isLogo: true },
  ];

  const expertiseTeam = [
    { name: "Bach Nguyen", role: "Expertise Mentor", bio: "Researcher at Stanford University School of Medicine | Junior Fellow of Harvard Undergraduate Microbiology Society | Research Mentor at CSR-x", img: "32.png" },
    { name: "Arjun Dixit", role: "Expertise Mentor", bio: "Researcher at Georgia Institute of Technology, Emory University, Harvard University, and Stanford University School of Medicine | CEO and Founder of Nexflow", img: "33.png" },
    { name: "Linh (Livia) Tran", role: "Expertise Mentor", bio: "Research Assistant at the Well-being, Health, and Interpersonal Relationships Lab | Lab Manager & previously Undergraduate Research Assistant at ODESI Research Lab", img: "35.png" },
    { name: "Aaryan Senthilvanan", role: "Expertise Mentor", bio: "New York Times Editor | Research at Stanford University and California Institute of Technology | Founder @ SYALIS / BrainReach", img: "31.png" },
    { name: "Lyudong Yan", role: "Expertise Mentor", bio: "Research at Stanford University and California Institute of Technology | Intern @ University of Michigan | Paid Doctoral Intern", img: "36.png" },
  ];

  return (
    <div className="about-page">
      <section className="page-hero">
        <Navbar />
        <div className="page-hero-content">
          <h1 className="page-hero-title">About <span className="highlight-text">Synthica</span></h1>
          <p className="page-hero-subtitle">Empowering the next generation of researchers through accessible education and global opportunities.</p>
        </div>
      </section>

      <section className="mission-section" id="mission">
        <div className="mission-container">
          <div className="mission-content">
            <div className="section-badge">Our Mission</div>
            <h2 className="section-title">Making Research <span className="yellow-text">Accessible</span> to Everyone</h2>
            <p className="section-text">At Synthica, we believe that every high school student deserves the opportunity to explore the world of academic research, regardless of their background or resources.</p>

            <div className="mission-stats">
              <div className="stats-container">
                <img src="/assets/add-ons/Synthica Preview Image (5).png" alt="Synthica Impact" className="stats-person-image" />
                <StatBubble number="50+" label="countries" className="stat-bubble-1" />
                <StatBubble number="5000+" label="researchers" className="stat-bubble-2" />
                <StatBubble number="100+" label="projects" className="stat-bubble-3" />
                <StatBubble number="25+" label="partners" className="stat-bubble-4" />
              </div>
            </div>
          </div>

          <div className="mission-values">
            <h3 className="values-title">Our Core Values</h3>
            <div className="values-grid">
              {[
                { num: '01', title: 'Accessibility', desc: 'Free, high-quality research education for all students, regardless of their financial situation or geographic location.' },
                { num: '02', title: 'Excellence', desc: 'Curriculum reviewed by top university professors ensuring academic rigor and real-world relevance.' },
                { num: '03', title: 'Community', desc: 'Building a supportive global network of student researchers, mentors, and academic professionals.' },
                { num: '04', title: 'Innovation', desc: 'Encouraging creative thinking and novel approaches to solving real-world problems through research.' }
              ].map((v, i) => (
                <motion.div key={i} className="value-card" {...fadeIn}>
                  <div className="value-number">{v.num}</div>
                  <h4 className="value-title">{v.title}</h4>
                  <p className="value-description">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="team-section" id="team">
        <div className="team-container">
          <div className="section-badge">Our Team</div>
          <h2 className="section-title">Meet the <span className="highlight-blue">People</span> Behind Synthica</h2>
          <p className="section-subtitle">Our team consists of passionate students, educators, and researchers from top universities around the world, all committed to making research accessible.</p>

          <div className="team-subsection">
            <h3 className="team-subsection-title">Core Team</h3>
            
            <div className="core-team-featured">
              <div className="team-member-card featured-member-card">
                <div className="featured-member-content">
                  <div className="member-image-placeholder">
                    <img src="/assets/Synthica Preview Image/16.png" alt="Quang Bui" className="member-image" />
                  </div>
                  <div className="featured-member-info">
                    <h3 className="member-name">Quang Bui</h3>
                    <p className="member-role">Founder & Executive Director</p>
                    <p className="member-bio">Researcher @ MIT LCP, Critical Data, CSAIL, Media Lab / Stanford HAI / UCLA</p>
                  </div>
                </div>
                <div className="member-socials featured-socials">
                  <a href="https://www.linkedin.com/in/buiducquang/" className="social-link" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="core-team-expandable">
              <button className={`core-team-toggle ${showMoreCore ? 'active' : ''}`} onClick={() => setShowMoreCore(!showMoreCore)}>
                <span className="toggle-text">{showMoreCore ? 'Hide Core Team Members' : 'View More Core Team Members'}</span>
                <span className="toggle-icon">{showMoreCore ? '▲' : '▼'}</span>
              </button>
              
              <div className={`core-team-members ${showMoreCore ? 'active' : ''}`}>
                <div className="team-grid core-team-grid">
                  {coreTeam.map((m, i) => (
                    <motion.div key={i} className="team-member-card" {...fadeIn}>
                      <div className="member-image-placeholder">
                        <img 
                          src={m.isLogo ? `/assets/logo/${m.img}` : `/assets/Synthica Preview Image/${m.img}`} 
                          alt={m.name} 
                          className="member-image" 
                        />
                      </div>
                      <h3 className="member-name">{m.name}</h3>
                      <p className="member-role">{m.role}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="team-subsection">
            <h3 className="team-subsection-title">Expertise Team</h3>
            <div className="team-grid">
              {expertiseTeam.map((m, i) => (
                <motion.div key={i} className="team-member-card" {...fadeIn}>
                  <div className="member-image-placeholder">
                    <img src={`/assets/Synthica Preview Image (2)/${m.img}`} alt={m.name} className="member-image" />
                  </div>
                  <h3 className="member-name">{m.name}</h3>
                  <p className="member-role">{m.role}</p>
                  <p className="member-bio">{m.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
