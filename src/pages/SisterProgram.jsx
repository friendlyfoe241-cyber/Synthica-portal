import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SisterProgram = () => (
  <div className="sister-program-page">
    <section className="page-hero">
      <Navbar />
      <div className="page-hero-content">
        <h1 className="page-hero-title">SISTER <span className="highlight-text">Program</span></h1>
        <p className="page-hero-subtitle">Students in STEM Through Engagement &amp; Research — expanding access, mentorship, and community for the next generation of scientists.</p>
      </div>
    </section>

    <section className="partnerships-section" id="about">
      <div className="partnerships-container">
        <div className="section-badge">About SISTER</div>
        <h2 className="section-title">STEM access with <span className="highlight-blue">purpose</span></h2>
        <p className="section-text">The SISTER Program is Synthica&apos;s initiative to lower barriers for students exploring STEM research. Through peer networks, guided workshops, and connections to mentors, participants build confidence and skills before diving into advanced projects.</p>

        <div className="partnership-types-grid">
          {[
            { title: 'Community & peers', desc: 'Connect with students worldwide who share your interests in science, technology, engineering, and mathematics.', icon: '/assets/coolicons/coolicons SVG/User/Users_Group.svg', items: ['Discord study channels', 'Regional ambassador support', 'Peer accountability groups'] },
            { title: 'Workshops & seminars', desc: 'Live and async sessions on research literacy, careers in STEM, and how to get started without prior experience.', icon: '/assets/coolicons/coolicons SVG/Interface/Book_Open.svg', items: ['Research fundamentals', 'Guest speakers from academia', 'Q&A with mentors'] },
            { title: 'Pathway to research', desc: 'Graduates of SISTER activities are encouraged to apply for the Research Group, Free Course, and Global Research Challenge.', icon: '/assets/coolicons/coolicons SVG/Interface/Chart_Line.svg', items: ['Free Course access', 'Research Group applications', 'Competition preparation'] },
          ].map((card) => (
            <div key={card.title} className="partnership-type-card">
              <div className="partnership-type-icon">
                <img src={card.icon} alt="" className="icon-svg" />
              </div>
              <h3 className="partnership-type-title">{card.title}</h3>
              <p className="partnership-type-desc">{card.desc}</p>
              <ul className="partnership-opportunities-list">
                {card.items.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sponsors-contact">
          <a href="https://discord.gg/8wPzZkGy5Z" target="_blank" rel="noopener noreferrer" className="join-btn">Join the SISTER Community</a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default SisterProgram;
