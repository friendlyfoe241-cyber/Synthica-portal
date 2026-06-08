import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const topics = [
  {
    title: 'Research literacy',
    desc: 'Understand what research is, how to read scholarly papers, and how to turn curiosity into a clear, answerable question.',
    icon: '/assets/coolicons/coolicons SVG/Interface/Book_Open.svg',
  },
  {
    title: 'Methods & design',
    desc: 'Learn how to plan a study, choose methods, collect and analyze data, and document your work like a practicing researcher.',
    icon: '/assets/coolicons/coolicons SVG/Interface/Chart_Line.svg',
  },
  {
    title: 'From idea to output',
    desc: 'Build skills to present findings, write for competitions or publication, and contribute meaningfully to a research team.',
    icon: '/assets/coolicons/coolicons SVG/Interface/Check.svg',
  },
];

const FreeCourse = () => (
  <div className="free-course-page">
    <section className="page-hero">
      <Navbar />
      <div className="page-hero-content">
        <h1 className="page-hero-title">Free <span className="highlight-text">Course</span></h1>
        <p className="page-hero-subtitle">
          A free, step-by-step program that teaches high school students how to do research — from your first question to a finished project.
        </p>
      </div>
    </section>

    <section className="partnerships-section" id="about">
      <div className="partnerships-container">
        <div className="section-badge">Coming Soon</div>
        <h2 className="section-title">Learn how to do <span className="highlight-blue">research</span></h2>
        <p className="section-text">
          Synthica is building a professor-reviewed curriculum designed for students with no prior experience. Every lesson will be free — no paywalls, no prerequisites — so anyone worldwide can learn how research actually works.
        </p>

        <div className="partnership-types-grid">
          {topics.map((t) => (
            <div key={t.title} className="partnership-type-card">
              <div className="partnership-type-icon">
                <img src={t.icon} alt="" className="icon-svg" />
              </div>
              <h3 className="partnership-type-title">{t.title}</h3>
              <p className="partnership-type-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="research-group-section" id="release">
      <div className="research-group-container">
        <div className="research-group-content">
          <div className="research-group-status" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="status-card upcoming-status" style={{ width: '100%' }}>
              <div className="status-header">
                <div className="status-icon">
                  <img src="/assets/coolicons/coolicons SVG/Calendar/Calendar.svg" alt="" className="icon-svg" width={32} height={32} />
                </div>
                <h4 className="status-title">Releasing soon</h4>
              </div>
              <p className="status-text">
                Modules and lessons are not available yet. We are finalizing the curriculum and will announce the launch in our Discord community first.
              </p>
              <span className="status-badge">No enrollment open yet</span>
            </div>
          </div>
        </div>

        <div className="sponsors-contact" style={{ marginTop: '2.5rem' }}>
          <a href="https://discord.gg/8wPzZkGy5Z" target="_blank" rel="noopener noreferrer" className="join-btn">
            Get notified on Discord
          </a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default FreeCourse;
