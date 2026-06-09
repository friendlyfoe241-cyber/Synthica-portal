import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/supabaseClient';
import { useUserAuth } from '../hooks/useUserAuth';
import DashboardShell from '../components/dashboard/DashboardShell';
import Meteors from '../components/Meteors';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const SUBJECTS = ['All', 'Biology', 'Computer Science', 'Chemistry', 'Economics', 'Mathematics', 'Physics', 'Psychology', 'Humanities', 'Other'];
const STATUSES = ['All', 'recruiting', 'active', 'completed'];

export default function ResearchHub() {
  const { user, userProfile } = useUserAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [applyingTo, setApplyingTo] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = projects.filter(p => {
    const matchSubject = subject === 'All' || p.subject === subject;
    const matchStatus = status === 'All' || p.status === status;
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchStatus && matchSearch;
  });

  const isLoggedIn = !!user;
  const isMember = (p) => p.memberIds?.includes(user?.uid);
  const isFull = (p) => (p.memberIds?.length || 0) >= (p.maxMembers || 4);

  // If logged in, show inside dashboard shell; otherwise show in main site frame
  const content = (
    <div className="rh-page">
      <div className="rh-hero">
        <div className="section-badge">Community</div>
        <h1 className="rh-title">Research <span className="yellow-text">Hub</span></h1>
        <p className="rh-subtitle">Browse active and upcoming research projects. Find your team and contribute to real research.</p>
      </div>

      <div className="rh-filters">
        <input
          className="rh-search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search projects…"
        />
        <div className="rh-filter-row">
          <div className="rh-filter-group">
            <label>Subject</label>
            <div className="rh-filter-pills">
              {SUBJECTS.map(s => (
                <button key={s} className={`rh-pill ${subject === s ? 'active' : ''}`} onClick={() => setSubject(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div className="rh-filter-group">
            <label>Status</label>
            <div className="rh-filter-pills">
              {STATUSES.map(s => (
                <button key={s} className={`rh-pill ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="db-loading-row"><div className="dashboard-spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="db-empty-state">
          <span className="db-empty-icon">🔭</span>
          <h3>No projects found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="rh-grid">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              className="rh-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="rh-card-header">
                <span className="db-subject-badge">{p.subject}</span>
                <span className={`db-status-badge db-status-${p.status}`}>{p.status}</span>
              </div>
              <h3 className="rh-card-title">{p.title}</h3>
              <p className="rh-card-desc">{p.description}</p>
              <div className="rh-card-meta">
                <span>👤 {p.leadResearcherName}</span>
                <span>👥 {p.memberIds?.length || 0} / {p.maxMembers}</span>
              </div>
              <div className="rh-card-footer">
                {!isLoggedIn ? (
                  <Link to="/login" className="db-btn-primary">Sign in to Apply</Link>
                ) : isMember(p) ? (
                  <span className="rh-member-badge">✓ You're on this team</span>
                ) : isFull(p) ? (
                  <span className="rh-full-badge">Team Full</span>
                ) : p.status === 'recruiting' ? (
                  <Link to="/application-hub" className="db-btn-primary" state={{ projectId: p.id, projectTitle: p.title }}>
                    Apply to Join
                  </Link>
                ) : (
                  <span className="rh-closed-badge">Not Recruiting</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  if (isLoggedIn) {
    return <DashboardShell activeTab="research-hub">{content}</DashboardShell>;
  }

  return (
    <div className="home-page">
      <div className="page-hero">
        <Meteors />
        <Navbar />
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        {content}
      </div>
      <Footer />
    </div>
  );
}
