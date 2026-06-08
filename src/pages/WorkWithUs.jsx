import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const WorkWithUs = () => {
  return (
    <div className="work-with-us-page">
      <section className="page-hero">
        <Navbar />
        <div className="page-hero-content">
          <h1 className="page-hero-title">Work With <span className="highlight-text">Us</span></h1>
          <p className="page-hero-subtitle">Join our mission to make research education accessible to high school students worldwide.</p>
        </div>
      </section>

      <section className="partnerships-section" id="partnerships">
        <div className="partnerships-container">
          <div className="section-badge">Partners</div>
          <h2 className="section-title">Partner With <span className="highlight-blue">Synthica</span></h2>
          <p className="section-text">Partnerships at Synthica involve collaborating with universities, schools, and organizations to expand our reach and impact. We work together to provide mentorship, resources, curriculum integration, and opportunities for student researchers. Our partnerships create meaningful connections between high school students and the academic and professional research community.</p>
          
          <div className="partnership-types-grid">
            {[
              { 
                title: 'Universities', 
                icon: '/assets/coolicons/coolicons SVG/Interface/Book.svg',
                desc: 'Partner with us to provide mentorship, resources, and expertise to high school researchers.',
                list: ['Faculty mentorship programs', 'Research lab partnerships', 'Guest lectures and workshops', 'Competition judging opportunities']
              },
              { 
                title: 'Schools', 
                icon: '/assets/coolicons/coolicons SVG/Navigation/Building_01.svg',
                desc: 'Bring Synthica\'s research education program directly to your students through official partnerships.',
                list: ['Curriculum integration', 'After-school programs', 'Teacher professional development', 'Student recognition programs']
              },
              { 
                title: 'Organizations', 
                icon: '/assets/coolicons/coolicons SVG/Navigation/Building_02.svg',
                desc: 'Support our mission through collaboration, resources, or expertise sharing opportunities.',
                list: ['Research collaboration', 'Technology partnerships', 'Corporate mentorship', 'Resource sharing']
              }
            ].map((p, i) => (
              <motion.div key={i} className="partnership-type-card" {...fadeIn}>
                <div className="partnership-type-icon">
                  <img src={p.icon} alt={p.title} className="icon-svg" />
                </div>
                <h3 className="partnership-type-title">{p.title}</h3>
                <p className="partnership-type-desc">{p.desc}</p>
                <ul className="partnership-opportunities-list">
                  {p.list.map((item, j) => <li key={j}>✓ {item}</li>)}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="partnership-contact">
            <a href="https://calendly.com/synthica-org/meeting" target="_blank" rel="noopener noreferrer" className="join-btn">Book a Call</a>
          </div>
        </div>
      </section>

      <section className="sponsors-section" id="sponsors">
        <div className="sponsors-container">
          <div className="section-badge">Sponsors</div>
          <h2 className="section-title">Sponsor <span className="highlight-blue">Synthica</span></h2>
          <p className="section-text">Sponsorships at Synthica help us make research education accessible to students worldwide. Sponsors support our competition prizes, scholarship programs, technology infrastructure, and operational costs. In return, sponsors gain visibility in our global community, access to talented student researchers, and the opportunity to make a meaningful impact on the next generation of researchers.</p>
          
          <div className="sponsor-benefits-grid">
            {[
              { title: 'Competition Prizes', icon: '/assets/coolicons/coolicons SVG/Interface/Credit_Card_01.svg', desc: 'Support our annual competition with prize funding, helping recognize and reward outstanding student research.' },
              { title: 'Scholarship Programs', icon: '/assets/coolicons/coolicons SVG/Interface/Book_Open.svg', desc: 'Fund scholarships that enable students from underserved communities to participate in research education.' },
              { title: 'Technology Infrastructure', icon: '/assets/coolicons/coolicons SVG/System/Laptop.svg', desc: 'Support our platform development, ensuring students have access to cutting-edge research tools and resources.' },
              { title: 'Global Impact', icon: '/assets/coolicons/coolicons SVG/Environment/Planet.svg', desc: 'Make a meaningful difference in the lives of thousands of students worldwide, shaping the future of research.' }
            ].map((b, i) => (
              <motion.div key={i} className="sponsor-benefit-card" {...fadeIn}>
                <div className="sponsor-benefit-icon">
                  <img src={b.icon} alt={b.title} className="icon-svg" />
                </div>
                <h4 className="sponsor-benefit-title">{b.title}</h4>
                <p className="sponsor-benefit-desc">{b.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="sponsor-return-benefits">
            <h3 className="sponsor-return-title">What You Get in Return</h3>
            <div className="sponsor-return-grid">
              {[
                { icon: '/assets/coolicons/coolicons SVG/Interface/Search_Magnifying_Glass.svg', text: 'Brand visibility in our global community of 1000+ students' },
                { icon: '/assets/coolicons/coolicons SVG/Interface/Check_Big.svg', text: 'Access to talented student researchers for internships and recruitment' },
                { icon: '/assets/coolicons/coolicons SVG/User/Users_Group.svg', text: 'Partnership opportunities with top universities and institutions' },
                { icon: '/assets/coolicons/coolicons SVG/Interface/Chart_Line.svg', text: 'Impact reports showcasing your contribution to research education' }
              ].map((r, i) => (
                <motion.div key={i} className="sponsor-return-item" {...fadeIn}>
                  <div className="return-icon">
                    <img src={r.icon} alt="Benefit" className="icon-svg" />
                  </div>
                  <p>{r.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="sponsors-contact">
            <a href="https://calendly.com/synthica-org/meeting" target="_blank" rel="noopener noreferrer" className="join-btn">Book a Call</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WorkWithUs;
