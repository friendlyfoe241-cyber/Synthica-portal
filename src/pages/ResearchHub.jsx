import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useUserAuth } from '../hooks/useUserAuth';
import DashboardShell from '../components/dashboard/DashboardShell';
import Meteors from '../components/Meteors';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';

const SUBJECTS = ['All', 'Biology', 'Computer Science', 'Chemistry', 'Economics', 'Mathematics', 'Physics', 'Psychology', 'Humanities', 'Other'];
const STATUSES = ['All', 'recruiting', 'active', 'completed'];

export default function ResearchHub() {
  const { user, userProfile } = useUserAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isAssociateResearcher = userProfile?.roles?.includes('associate_researcher');

  const handleApplyClick = (project) => {
    if (!isAssociateResearcher) {
      setSelectedProject(project);
      setShowApplyModal('need-role');
      return;
    }
    setSelectedProject(project);
    setShowApplyModal('form');
  };

  const handleSubmitApplication = async () => {
    if (!user || !selectedProject) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from('project_applications').insert({
        project_id: selectedProject.id,
        user_id: user.id,
        message: applyMessage || null
      });

      if (error) {
        if (error.code === '23505') {
          alert('You have already applied to this project!');
        } else {
          console.error('Error submitting application:', error);
          alert('Failed to submit application. Please try again.');
        }
      } else {
        setShowApplyModal('success');
        setApplyMessage('');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
    }
    setSubmitting(false);
  };

  const resetModal = () => {
    setShowApplyModal(false);
    setSelectedProject(null);
    setApplyMessage('');
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const filtered = projects.filter(p => {
    const matchSubject = subject === 'All' || p.subject === subject;
    const matchStatus = status === 'All' || p.status === status;
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchStatus && matchSearch;
  });

  const isLoggedIn = !!user;
  const isMember = (p) => p.member_ids?.includes(user?.id);
  const isFull = (p) => (p.member_ids?.length || 0) >= (p.max_members || 4);

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
                <span>👤 {p.lead_researcher_name}</span>
                <span>👥 {p.member_ids?.length || 0} / {p.max_members}</span>
              </div>
              <div className="rh-card-footer">
                {!isLoggedIn ? (
                  <Link to="/login" className="db-btn-primary">Sign in to Apply</Link>
                ) : isMember(p) ? (
                  <span className="rh-member-badge">✓ You're on this team</span>
                ) : isFull(p) ? (
                  <span className="rh-full-badge">Team Full</span>
                ) : p.status === 'recruiting' ? (
                  <button className="db-btn-primary" onClick={() => handleApplyClick(p)}>
                    Apply to Join
                  </button>
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

  // Modal for "need associate researcher role" message
  const needRoleModal = showApplyModal === 'need-role' && (
    <div className="modal-overlay" onClick={resetModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ marginBottom: '1rem' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1F2937' }}>
            Associate Researcher Required
          </h3>
          <p style={{ color: '#6B7280', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            To apply to join a research project, you must first be registered as an{' '}
            <strong>Associate Researcher</strong>. Please apply through the Application Hub.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={resetModal} className="db-btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
              Cancel
            </button>
            <Link to="/application-hub" className="db-btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              Go to Application Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal for application form
  const applyFormModal = showApplyModal === 'form' && (
    <div className="modal-overlay" onClick={resetModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937' }}>
              Apply to Join Project
            </h3>
            <button onClick={resetModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '0.25rem' }}>Project</p>
            <p style={{ fontWeight: '600', color: '#1F2937' }}>{selectedProject?.title}</p>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              Why do you want to join? <span style={{ color: '#9CA3AF', fontWeight: '400' }}>(Optional)</span>
            </label>
            <textarea
              value={applyMessage}
              onChange={e => setApplyMessage(e.target.value)}
              placeholder="Tell the lead researcher why you're interested in this project and what you can contribute..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontFamily: "'Garet', sans-serif",
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#78b4fb'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={resetModal} className="db-btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
              Cancel
            </button>
            <button 
              onClick={handleSubmitApplication} 
              className="db-btn-primary" 
              disabled={submitting}
              style={{ padding: '0.75rem 1.5rem', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Success modal
  const successModal = showApplyModal === 'success' && (
    <div className="modal-overlay" onClick={resetModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'rgba(74, 222, 128, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.75rem', color: '#0F172A' }}>
            Application Submitted!
          </h3>
          <p style={{ color: '#6B7280', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Your application has been sent to the lead researcher. You'll be notified once they review it.
          </p>
          <button onClick={resetModal} className="db-btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoggedIn) {
    return (
      <DashboardShell activeTab="research-hub">
        {content}
        {needRoleModal}
        {applyFormModal}
        {successModal}
      </DashboardShell>
    );
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
