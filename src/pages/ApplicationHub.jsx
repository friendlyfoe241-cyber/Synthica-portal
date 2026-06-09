import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/supabaseClient';
import { useUserAuth } from '../hooks/useUserAuth';
import DashboardShell from '../components/dashboard/DashboardShell';
import { Link, useLocation } from 'react-router-dom';

const ROLES = [
  {
    key: 'chapter_leader',
    label: 'Chapter Leader',
    icon: '🏫',
    color: '#2589ed',
    desc: 'Lead a local Synthica chapter at your school. Organize meetings, recruit members, and foster a research culture.',
    requirements: ['Currently enrolled in high school', 'Passion for research and leadership', 'Ability to commit 3–5 hrs/week'],
  },
  {
    key: 'lead_researcher',
    label: 'Lead Researcher',
    icon: '🔬',
    color: '#FFD700',
    desc: 'Lead a research team on a specific project. Assign tasks, guide your team, and see the work through to publication.',
    requirements: ['Prior research experience preferred', 'Strong subject-matter knowledge', 'Availability to mentor and guide peers'],
  },
  {
    key: 'associate_researcher',
    label: 'Associate Researcher',
    icon: '🧪',
    color: '#78b4fb',
    desc: 'Join an active research project as a team member. Contribute to literature reviews, data collection, and writing.',
    requirements: ['Open to all levels', 'Eager to learn and contribute', 'Commitment to complete project milestones'],
  },
  {
    key: 'independent_researcher',
    label: 'Independent Researcher',
    icon: '📓',
    color: '#69aaec',
    desc: 'Conduct your own research independently with access to Synthica resources, guides, and community support.',
    requirements: ['Self-motivated and organized', 'Clear research topic in mind', 'No team required — solo work'],
  },
];

export default function ApplicationHub() {
  const { user, userProfile } = useUserAuth();
  const location = useLocation();
  const prefill = location.state || {};

  const [myApps, setMyApps] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState({ roleApplied: '', statement: '', projectId: prefill.projectId || '', projectTitle: prefill.projectTitle || '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'applications'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, snap => {
      setMyApps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error('Applications listener error:', err.code);
    });
    return unsub;
  }, [user]);

  const openApplication = (role) => {
    setSelectedRole(role);
    setForm(f => ({ ...f, roleApplied: role.key }));
    setSubmitted(false);
    setSubmitError('');
  };

  const submitApplication = async () => {
    if (!form.statement.trim() || !user) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await addDoc(collection(db, 'applications'), {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        roleApplied: form.roleApplied,
        statement: form.statement,
        projectId: form.projectId || '',
        projectTitle: form.projectTitle || '',
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (e) {
      console.error('Application submit error:', e);
      if (e.code === 'permission-denied' || e.code === 'PERMISSION_DENIED') {
        setSubmitError('Permission denied — Firestore rules need updating. Go to Firebase Console → Firestore → Security tab, paste in the firestore.rules file contents, and click Publish.');
      } else {
        setSubmitError('Submission failed: ' + (e.message || 'Please try again.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const alreadyApplied = (roleKey) => myApps.some(a => a.roleApplied === roleKey && a.status !== 'rejected');

  const content = (
    <div className="ah-page">
      <div className="rh-hero">
        <div className="section-badge">Opportunities</div>
        <h1 className="rh-title">Application <span className="yellow-text">Hub</span></h1>
        <p className="rh-subtitle">Apply for a role at Synthica. All roles are volunteer-based and open to high school students worldwide.</p>
      </div>

      {!user && (
        <div className="ah-login-prompt">
          <p>You need to <Link to="/login">sign in with Google</Link> to submit an application.</p>
        </div>
      )}

      <div className="ah-roles-grid">
        {ROLES.map((role, i) => (
          <motion.div
            key={role.key}
            className="ah-role-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ borderTop: `3px solid ${role.color}` }}
          >
            <span className="ah-role-icon">{role.icon}</span>
            <h3 className="ah-role-title" style={{ color: role.color }}>{role.label}</h3>
            <p className="ah-role-desc">{role.desc}</p>
            <ul className="ah-req-list">
              {role.requirements.map((r, j) => (
                <li key={j}>✓ {r}</li>
              ))}
            </ul>
            {user ? (
              alreadyApplied(role.key) ? (
                <span className="ah-applied-badge">✓ Applied</span>
              ) : (
                <button className="db-btn-primary" onClick={() => openApplication(role)}>Apply Now</button>
              )
            ) : (
              <Link to="/login" className="db-btn-secondary">Sign in to Apply</Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* My Applications */}
      {user && myApps.length > 0 && (
        <div className="ah-my-apps">
          <h2 className="db-section-title">My Applications</h2>
          <div className="ah-apps-list">
            {myApps.map(app => (
              <div key={app.id} className="ah-app-row">
                <div className="ah-app-info">
                  <strong>{ROLES.find(r => r.key === app.roleApplied)?.label || app.roleApplied}</strong>
                  {app.projectTitle && <span className="ah-app-project">Project: {app.projectTitle}</span>}
                </div>
                <span className={`ah-status-badge ah-status-${app.status}`}>{app.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Application Modal */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div className="db-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !submitted && setSelectedRole(null)}>
            <motion.div className="db-modal" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              {submitted ? (
                <div className="ah-success">
                  <span className="ah-success-icon">🎉</span>
                  <h2>Application Submitted!</h2>
                  <p>Your application for <strong>{selectedRole.label}</strong> has been received. Synthica admins will review it and update your role.</p>
                  <button className="db-btn-primary" onClick={() => setSelectedRole(null)}>Done</button>
                </div>
              ) : (
                <>
                  <h2 className="db-modal-title">Apply — {selectedRole.label}</h2>
                  {prefill.projectTitle && (
                    <div className="ah-project-note">
                      Applying to join: <strong>{prefill.projectTitle}</strong>
                    </div>
                  )}
                  <div className="db-field">
                    <label>Personal Statement</label>
                    <textarea
                      rows={5}
                      value={form.statement}
                      onChange={e => setForm(f => ({ ...f, statement: e.target.value }))}
                      placeholder={`Tell us why you want to be a ${selectedRole.label}, what experience you bring, and what you hope to achieve at Synthica…`}
                    />
                  </div>
                  <p className="ah-note">Your name ({user?.displayName}) and email ({user?.email}) will be included with your application.</p>
                  {submitError && (
                    <div className="login-error" style={{ marginTop: '0.5rem' }}>
                      {submitError}
                    </div>
                  )}
                  <div className="db-modal-actions">
                    <button className="db-btn-secondary" onClick={() => setSelectedRole(null)}>Cancel</button>
                    <button className="db-btn-primary" onClick={submitApplication} disabled={submitting || !form.statement.trim()}>
                      {submitting ? 'Submitting…' : 'Submit Application'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (user) {
    return <DashboardShell activeTab="application-hub">{content}</DashboardShell>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
      {content}
    </div>
  );
}
