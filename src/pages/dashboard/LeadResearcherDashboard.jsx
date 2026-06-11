import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardShell from '../../components/dashboard/DashboardShell';
import ProjectDetail from '../../components/dashboard/ProjectDetail';

const SUBJECTS = ['Biology', 'Computer Science', 'Chemistry', 'Economics', 'Mathematics', 'Physics', 'Psychology', 'Humanities', 'Other'];

export default function LeadResearcherDashboard() {
  const { user } = useUserAuth();
  const [projects, setProjects] = useState([]);
  const [pendingCounts, setPendingCounts] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', subject: 'Biology', maxMembers: 4 });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('lead_researcher_id', user.id)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        return;
      }
      setProjects(projectsData || []);

      // Fetch pending application counts for each project
      if (projectsData && projectsData.length > 0) {
        const projectIds = projectsData.map(p => p.id);
        const { data: applicationsData } = await supabase
          .from('project_applications')
          .select('project_id')
          .in('project_id', projectIds)
          .eq('status', 'pending');

        // Count pending applications per project
        const counts = {};
        (applicationsData || []).forEach(app => {
          counts[app.project_id] = (counts[app.project_id] || 0) + 1;
        });
        setPendingCounts(counts);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('projects-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects', filter: `lead_researcher_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProjects(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProjects(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
          } else if (payload.eventType === 'DELETE') {
            setProjects(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'project_applications' },
        (payload) => {
          if (payload.new.status === 'pending') {
            setPendingCounts(prev => ({
              ...prev,
              [payload.new.project_id]: (prev[payload.new.project_id] || 0) + 1
            }));
          }
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'project_applications' },
        (payload) => {
          // If status changed from pending, decrement count
          if (payload.old?.status === 'pending' && payload.new?.status !== 'pending') {
            setPendingCounts(prev => ({
              ...prev,
              [payload.new.project_id]: Math.max(0, (prev[payload.new.project_id] || 0) - 1)
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const createProject = async () => {
    if (!newProject.title.trim() || !user) return;
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: newProject.title,
          description: newProject.description,
          subject: newProject.subject,
          max_members: Number(newProject.maxMembers) || 4,
          lead_researcher_id: user.id,
          lead_researcher_name: user.user_metadata?.full_name || user.email,
          member_ids: [user.id],
          member_names: { [user.id]: user.user_metadata?.full_name || user.email },
          status: 'recruiting',
        })
        .select()
        .single();

      if (error) throw error;
      
      setNewProject({ title: '', description: '', subject: 'Biology', maxMembers: 4 });
      setShowCreateModal(false);
    } catch (e) { 
      console.error('Error creating project:', e); 
    }
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
            <h1 className="db-title">{user?.user_metadata?.full_name?.split(' ')[0]}'s <span className="yellow-text">Lab</span></h1>
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
            <div><p className="db-stat-val">{projects.reduce((s, p) => s + (p.member_ids?.length || 0), 0)}</p><p className="db-stat-label">Total Members</p></div>
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
            {projects.map((p, i) => {
              const pendingCount = pendingCounts[p.id] || 0;
              return (
                <motion.div
                  key={p.id}
                  className="db-project-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleProjectClick(p)}
                >
                  <div className="db-project-card-header">
                    <span className="db-subject-badge">{p.subject}</span>
                    <span className={`db-status-badge db-status-${p.status}`}>{p.status}</span>
                    {pendingCount > 0 && (
                      <span style={{
                        background: '#EF4444',
                        color: 'white',
                        borderRadius: '10px',
                        padding: '0.15rem 0.5rem',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        marginLeft: 'auto'
                      }}>
                        {pendingCount} new
                      </span>
                    )}
                  </div>
                  <h3 className="db-project-title">{p.title}</h3>
                  <p className="db-project-desc">{p.description}</p>
                  <div className="db-project-footer">
                    <span className="db-project-members">👥 {p.member_ids?.length || 0} / {p.max_members}</span>
                    <span className="db-project-arrow">Open →</span>
                  </div>
                </motion.div>
              );
            })}
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
