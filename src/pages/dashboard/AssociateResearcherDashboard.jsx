import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardShell from '../../components/dashboard/DashboardShell';
import ProjectDetail from '../../components/dashboard/ProjectDetail';
import { Link } from 'react-router-dom';

export default function AssociateResearcherDashboard() {
  const { user } = useUserAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'projects'),
      where('memberIds', 'array-contains', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  if (selectedProject) {
    return (
      <DashboardShell activeTab="dashboard">
        <ProjectDetail
          project={selectedProject}
          isLead={false}
          onBack={() => setSelectedProject(null)}
          onProjectUpdate={(updated) => setSelectedProject(updated)}
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell activeTab="dashboard">
      <div className="db-page">
        <motion.div className="db-page-header" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <p className="db-greeting">Welcome back,</p>
            <h1 className="db-title">{user?.displayName?.split(' ')[0]}'s <span className="yellow-text">Projects</span></h1>
          </div>
          <span className="db-role-pill db-role-light-blue">Associate Researcher</span>
        </motion.div>

        <div className="db-stats-row">
          <div className="db-stat-card">
            <span className="db-stat-icon">📂</span>
            <div><p className="db-stat-val">{projects.length}</p><p className="db-stat-label">My Projects</p></div>
          </div>
          <div className="db-stat-card">
            <span className="db-stat-icon">🟢</span>
            <div><p className="db-stat-val">{projects.filter(p => p.status === 'active').length}</p><p className="db-stat-label">Active</p></div>
          </div>
        </div>

        {loading ? (
          <div className="db-loading-row"><div className="dashboard-spinner" /></div>
        ) : projects.length === 0 ? (
          <motion.div className="db-empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="db-empty-icon">🔭</span>
            <h3>You're not in any projects yet</h3>
            <p>Browse the Research Hub to find projects and apply to join a team.</p>
            <Link to="/research-hub" className="db-btn-primary">Browse Research Hub</Link>
          </motion.div>
        ) : (
          <>
            <h2 className="db-section-title" style={{ marginBottom: '1.25rem' }}>My Projects</h2>
            <div className="db-project-grid">
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="db-project-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedProject(p)}
                >
                  <div className="db-project-card-header">
                    <span className="db-subject-badge">{p.subject}</span>
                    <span className={`db-status-badge db-status-${p.status}`}>{p.status}</span>
                  </div>
                  <h3 className="db-project-title">{p.title}</h3>
                  <p className="db-project-desc">{p.description}</p>
                  <div className="db-project-footer">
                    <span className="db-lead-label">Led by {p.leadResearcherName}</span>
                    <span className="db-project-arrow">Enter →</span>
                  </div>
                  <div className="db-project-team">
                    {Object.values(p.memberNames || {}).slice(0, 4).map((name, j) => (
                      <span key={j} className="db-member-chip">{name.split(' ')[0]}</span>
                    ))}
                    {Object.keys(p.memberNames || {}).length > 4 && (
                      <span className="db-member-chip db-member-more">+{Object.keys(p.memberNames).length - 4}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
