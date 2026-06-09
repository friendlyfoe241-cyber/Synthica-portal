import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection, addDoc, getDocs, query, where,
  doc, updateDoc, deleteDoc, serverTimestamp, orderBy, onSnapshot,
} from 'firebase/firestore';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardShell from '../../components/dashboard/DashboardShell';
import ProjectDetail from '../../components/dashboard/ProjectDetail';

const SUBJECTS = ['Biology', 'Computer Science', 'Chemistry', 'Economics', 'Mathematics', 'Physics', 'Psychology', 'Humanities', 'Other'];

export default function LeadResearcherDashboard() {
  const { user } = useUserAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', subject: 'Biology', maxMembers: 4 });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'projects'), where('leadResearcherId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  const createProject = async () => {
    if (!newProject.title.trim() || !user) return;
    setCreating(true);
    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        maxMembers: Number(newProject.maxMembers) || 4,
        leadResearcherId: user.uid,
        leadResearcherName: user.displayName,
        memberIds: [user.uid],
        memberNames: { [user.uid]: user.displayName },
        status: 'recruiting',
        createdAt: serverTimestamp(),
      });
      setNewProject({ title: '', description: '', subject: 'Biology', maxMembers: 4 });
      setShowCreateModal(false);
    } catch (e) { console.error(e); }
    setCreating(false);
  };

  if (selectedProject) {
    return (
      <DashboardShell activeTab="dashboard">
        <ProjectDetail
          project={selectedProject}
          isLead={true}
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
            <p className="db-greeting">Good to see you,</p>
            <h1 className="db-title">{user?.displayName?.split(' ')[0]}'s <span className="yellow-text">Lab</span></h1>
          </div>
          <span className="db-role-pill db-role-gold">Lead Researcher</span>
        </motion.div>

        {/* Stats row */}
        <div className="db-stats-row">
          <div className="db-stat-card">
            <span className="db-stat-icon">🔬</span>
            <div><p className="db-stat-val">{projects.length}</p><p className="db-stat-label">My Projects</p></div>
          </div>
          <div className="db-stat-card">
            <span className="db-stat-icon">✅</span>
            <div><p className="db-stat-val">{projects.filter(p => p.status === 'active').length}</p><p className="db-stat-label">Active</p></div>
          </div>
          <div className="db-stat-card">
            <span className="db-stat-icon">👥</span>
            <div><p className="db-stat-val">{projects.reduce((s, p) => s + (p.memberIds?.length || 0), 0)}</p><p className="db-stat-label">Total Members</p></div>
          </div>
        </div>

        <motion.div className="db-section-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="db-section-title">My Projects</h2>
          <button className="db-btn-primary" onClick={() => setShowCreateModal(true)}>+ New Project</button>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div className="db-empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <span className="db-empty-icon">🔭</span>
            <h3>No projects yet</h3>
            <p>Create your first project to start collaborating with researchers.</p>
            <button className="db-btn-primary" onClick={() => setShowCreateModal(true)}>Create Project</button>
          </motion.div>
        ) : (
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
                  <span className="db-project-members">👥 {p.memberIds?.length || 0} / {p.maxMembers}</span>
                  <span className="db-project-arrow">Open →</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div className="db-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)}>
              <motion.div className="db-modal" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
                <h2 className="db-modal-title">Create New Project</h2>
                <div className="db-field">
                  <label>Project Title</label>
                  <input value={newProject.title} onChange={e => setNewProject(f => ({ ...f, title: e.target.value }))} placeholder="e.g. CRISPR Gene Editing in E. coli" />
                </div>
                <div className="db-field">
                  <label>Description</label>
                  <textarea rows={3} value={newProject.description} onChange={e => setNewProject(f => ({ ...f, description: e.target.value }))} placeholder="Describe the research goals and methodology..." />
                </div>
                <div className="db-form-row">
                  <div className="db-field">
                    <label>Subject</label>
                    <select value={newProject.subject} onChange={e => setNewProject(f => ({ ...f, subject: e.target.value }))}>
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="db-field">
                    <label>Max Members</label>
                    <input type="number" min="2" max="10" value={newProject.maxMembers} onChange={e => setNewProject(f => ({ ...f, maxMembers: e.target.value }))} />
                  </div>
                </div>
                <div className="db-modal-actions">
                  <button className="db-btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button className="db-btn-primary" onClick={createProject} disabled={creating || !newProject.title.trim()}>
                    {creating ? 'Creating…' : 'Create Project'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
}
