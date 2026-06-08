import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ResearchGroup = () => (
  <div className="research-group-page">
    <section className="page-hero">
      <Navbar />
      <div className="page-hero-content">
        <h1 className="page-hero-title">Synthica <span className="highlight-text">Research Group</span></h1>
        <p className="page-hero-subtitle">A mentor-led cohort for high school students ready to run a real research project — from question to presentation.</p>
      </div>
    </section>

    <section className="research-group-section" id="overview">
      <div className="research-group-container">
        <div className="section-badge">Program Overview</div>
        <h2 className="section-title">Learn research by <span className="highlight-blue">doing it</span></h2>
        <p className="section-subtitle">Accepted students join a structured cohort, work with mentors who have conducted research at top institutions, and build portfolio-ready projects alongside peers worldwide.</p>

        <div className="research-group-content">
          <div className="research-group-main-card">
            <div className="research-group-header">
              <div className="research-group-icon">
                <img src="/assets/coolicons/coolicons SVG/User/Users_Group.svg" alt="" className="icon-svg" width="40" height="40" />
              </div>
              <div className="research-group-header-text">
                <h3 className="research-group-title">What you get</h3>
                <p className="research-group-subtitle">Hands-on mentorship, accountability, and a path from idea to finished work — at zero cost.</p>
              </div>
            </div>
            <div className="research-group-features">
              {[
                { title: '1:1 & team mentorship', desc: 'Pair with mentors who completed high school research at universities including MIT, Stanford, and peer institutions.', icon: '/assets/coolicons/coolicons SVG/User/User_01.svg' },
                { title: 'Structured milestones', desc: 'Move through literature review, methodology, analysis, and presentation with clear checkpoints and feedback.', icon: '/assets/coolicons/coolicons SVG/Interface/Book.svg' },
                { title: 'Leadership opportunities', desc: 'Contribute meaningfully to team projects and develop skills beyond coursework — publication and competition pathways included.', icon: '/assets/coolicons/coolicons SVG/Interface/Chart_Line.svg' },
              ].map((f) => (
                <div key={f.title} className="research-group-feature">
                  <div className="feature-icon">
                    <img src={f.icon} alt="" className="icon-svg" width="28" height="28" />
                  </div>
                  <div className="feature-content">
                    <h4 className="feature-title">{f.title}</h4>
                    <p className="feature-desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="research-group-status">
            <div className="status-card upcoming-status">
              <div className="status-header">
                <div className="status-icon">
                  <img src="/assets/coolicons/coolicons SVG/Calendar/Calendar.svg" alt="" className="icon-svg" width="32" height="32" />
                </div>
                <h4 className="status-title">Applications</h4>
              </div>
              <p className="status-text">Cohort openings are announced in our Discord community. Join to hear when the next Research Group cycle opens.</p>
              <span className="status-badge">Announcements on Discord</span>
            </div>
          </div>
        </div>

        <div className="sponsors-contact" style={{ marginTop: '3rem' }}>
          <a href="https://discord.gg/8wPzZkGy5Z" target="_blank" rel="noopener noreferrer" className="join-btn">Join Discord for Updates</a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default ResearchGroup;
