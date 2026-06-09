import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useUserAuth } from '../../hooks/useUserAuth';

const STATUS_COLS = [
  { key: 'todo', label: 'To Do', color: '#6B7280' },
  { key: 'in_progress', label: 'In Progress', color: '#78b4fb' },
  { key: 'done', label: 'Done', color: '#4ade80' },
];

export default function ProjectDetail({ project, isLead, onBack }) {
  const { user } = useUserAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [readings, setReadings] = useState([]);
  const [newAnn, setNewAnn] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo', due_date: '' });
  const [newReading, setNewReading] = useState({ title: '', url: '', description: '' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showReadingForm, setShowReadingForm] = useState(false);
  const [postingAnn, setPostingAnn] = useState(false);

  useEffect(() => {
    const projectId = project.id;

    const fetchData = async () => {
      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      setTasks(tasksData || []);

      // Fetch announcements
      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      setAnnouncements(announcementsData || []);

      // Fetch readings
      const { data: readingsData } = await supabase
        .from('readings')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      setReadings(readingsData || []);
    };

    fetchData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('project-detail-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `project_id=eq.${projectId}` }, handleTaskChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements', filter: `project_id=eq.${projectId}` }, handleAnnouncementChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'readings', filter: `project_id=eq.${projectId}` }, handleReadingChange)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [project.id]);

  const handleTaskChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      setTasks(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
    } else if (payload.eventType === 'DELETE') {
      setTasks(prev => prev.filter(t => t.id !== payload.old.id));
    }
  };

  const handleAnnouncementChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      setAnnouncements(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setAnnouncements(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
    } else if (payload.eventType === 'DELETE') {
      setAnnouncements(prev => prev.filter(a => a.id !== payload.old.id));
    }
  };

  const handleReadingChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      setReadings(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setReadings(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
    } else if (payload.eventType === 'DELETE') {
      setReadings(prev => prev.filter(r => r.id !== payload.old.id));
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    const { error } = await supabase
      .from('tasks')
      .insert({
        project_id: project.id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        due_date: newTask.due_date,
        created_by: user.id,
      });
    if (!error) {
      setNewTask({ title: '', description: '', status: 'todo', due_date: '' });
      setShowTaskForm(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    await supabase.from('tasks').update({ status }).eq('id', taskId);
  };

  const deleteTask = async (taskId) => {
    await supabase.from('tasks').delete().eq('id', taskId);
  };

  const postAnnouncement = async () => {
    if (!newAnn.trim()) return;
    setPostingAnn(true);
    await supabase.from('announcements').insert({
      project_id: project.id,
      content: newAnn,
      author_id: user.id,
      author_name: user.user_metadata?.full_name || user.email,
    });
    setNewAnn('');
    setPostingAnn(false);
  };

  const addReading = async () => {
    if (!newReading.title.trim()) return;
    await supabase.from('readings').insert({
      project_id: project.id,
      title: newReading.title,
      url: newReading.url,
      description: newReading.description,
      added_by: user.id,
    });
    setNewReading({ title: '', url: '', description: '' });
    setShowReadingForm(false);
  };

  const members = Object.entries(project.member_names || {}).map(([uid, name]) => ({
    uid, name, isLead: uid === project.lead_researcher_id
  }));

  return (
    <div className="db-page">
      <div className="db-project-detail-header">
        <button className="db-back-btn" onClick={onBack}>← All Projects</button>
        <div className="db-project-detail-meta">
          <span className="db-subject-badge">{project.subject}</span>
          <span className={`db-status-badge db-status-${project.status}`}>{project.status}</span>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="db-title">{project.title}</h1>
        <p className="db-project-full-desc">{project.description}</p>
      </motion.div>

      {/* Tabs */}
      <div className="db-tabs db-tabs-detail">
        {['tasks', 'announcements', 'readings', 'team'].map(t => (
          <button key={t} className={`db-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* TASKS */}
        {activeTab === 'tasks' && (
          <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {isLead && (
              <div className="db-tab-actions">
                <button className="db-btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
                  {showTaskForm ? 'Cancel' : '+ Add Task'}
                </button>
              </div>
            )}
            {showTaskForm && isLead && (
              <motion.div className="db-card db-task-form" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="db-form-row">
                  <div className="db-field db-field-grow">
                    <label>Task Title</label>
                    <input value={newTask.title} onChange={e => setNewTask(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Write literature review" />
                  </div>
                  <div className="db-field">
                    <label>Due Date</label>
                    <input type="date" value={newTask.due_date} onChange={e => setNewTask(f => ({ ...f, due_date: e.target.value }))} />
                  </div>
                </div>
                <div className="db-field">
                  <label>Description</label>
                  <textarea rows={2} value={newTask.description} onChange={e => setNewTask(f => ({ ...f, description: e.target.value }))} placeholder="Task details..." />
                </div>
                <button className="db-btn-primary" onClick={addTask}>Add Task</button>
              </motion.div>
            )}

            <div className="db-kanban">
              {STATUS_COLS.map(col => (
                <div key={col.key} className="db-kanban-col">
                  <div className="db-kanban-header" style={{ borderTop: `3px solid ${col.color}` }}>
                    <span style={{ color: col.color }}>{col.label}</span>
                    <span className="db-kanban-count">{tasks.filter(t => t.status === col.key).length}</span>
                  </div>
                  <div className="db-kanban-cards">
                    {tasks.filter(t => t.status === col.key).map(task => (
                      <div key={task.id} className="db-task-card">
                        <p className="db-task-title">{task.title}</p>
                        {task.description && <p className="db-task-desc">{task.description}</p>}
                        {task.due_date && <p className="db-task-due">Due: {task.due_date}</p>}
                        <div className="db-task-actions">
                          {col.key !== 'todo' && (
                            <button className="db-task-btn" onClick={() => updateTaskStatus(task.id, STATUS_COLS[STATUS_COLS.findIndex(c => c.key === col.key) - 1].key)}>← Back</button>
                          )}
                          {col.key !== 'done' && (
                            <button className="db-task-btn db-task-btn-primary" onClick={() => updateTaskStatus(task.id, STATUS_COLS[STATUS_COLS.findIndex(c => c.key === col.key) + 1].key)}>Move →</button>
                          )}
                          {isLead && <button className="db-task-btn db-task-btn-danger" onClick={() => deleteTask(task.id)}>✕</button>}
                        </div>
                      </div>
                    ))}
                    {tasks.filter(t => t.status === col.key).length === 0 && (
                      <div className="db-kanban-empty">No tasks here</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <motion.div key="anns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {isLead && (
              <div className="db-card db-announce-form">
                <textarea rows={3} value={newAnn} onChange={e => setNewAnn(e.target.value)} placeholder="Post an announcement to your team…" />
                <button className="db-btn-primary" onClick={postAnnouncement} disabled={postingAnn || !newAnn.trim()}>
                  {postingAnn ? 'Posting…' : 'Post Announcement'}
                </button>
              </div>
            )}
            <div className="db-announce-list">
              {announcements.length === 0 ? (
                <div className="db-empty-state">
                  <span className="db-empty-icon">📢</span>
                  <h3>No announcements yet</h3>
                  {isLead && <p>Post an announcement to keep your team informed.</p>}
                </div>
              ) : announcements.map((a, i) => (
                <motion.div key={a.id} className="db-announce-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="db-announce-meta">
                    <strong>{a.author_name}</strong>
                    <span>{a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Just now'}</span>
                  </div>
                  <p>{a.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* READINGS */}
        {activeTab === 'readings' && (
          <motion.div key="readings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {isLead && (
              <div className="db-tab-actions">
                <button className="db-btn-primary" onClick={() => setShowReadingForm(!showReadingForm)}>
                  {showReadingForm ? 'Cancel' : '+ Add Reading'}
                </button>
              </div>
            )}
            {showReadingForm && isLead && (
              <motion.div className="db-card db-task-form" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="db-field">
                  <label>Title / Citation</label>
                  <input value={newReading.title} onChange={e => setNewReading(f => ({ ...f, title: e.target.value }))} placeholder="Paper title or citation" />
                </div>
                <div className="db-field">
                  <label>URL (optional)</label>
                  <input value={newReading.url} onChange={e => setNewReading(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
                </div>
                <div className="db-field">
                  <label>Notes</label>
                  <textarea rows={2} value={newReading.description} onChange={e => setNewReading(f => ({ ...f, description: e.target.value }))} placeholder="Why this is relevant..." />
                </div>
                <button className="db-btn-primary" onClick={addReading}>Add Reading</button>
              </motion.div>
            )}
            <div className="db-readings-list">
              {readings.length === 0 ? (
                <div className="db-empty-state">
                  <span className="db-empty-icon">📚</span>
                  <h3>No readings assigned yet</h3>
                </div>
              ) : readings.map((r, i) => (
                <motion.div key={r.id} className="db-reading-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="db-reading-icon">📄</div>
                  <div className="db-reading-content">
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="db-reading-title">{r.title}</a>
                    ) : (
                      <p className="db-reading-title">{r.title}</p>
                    )}
                    {r.description && <p className="db-reading-desc">{r.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TEAM */}
        {activeTab === 'team' && (
          <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="db-team-grid">
              {members.map((m, i) => (
                <motion.div key={m.uid} className="db-team-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <div className="db-team-avatar">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="db-team-name">{m.name}</p>
                  <span className={`db-role-pill ${m.isLead ? 'db-role-gold' : 'db-role-light-blue'}`} style={{ fontSize: '0.7rem' }}>
                    {m.isLead ? 'Lead Researcher' : 'Associate Researcher'}
                  </span>
                </motion.div>
              ))}
            </div>
            <p className="db-team-capacity">
              {members.length} / {project.maxMembers} members
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
