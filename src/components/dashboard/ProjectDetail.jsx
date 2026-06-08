import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection, addDoc, onSnapshot, orderBy, query,
  doc, updateDoc, deleteDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
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
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo', dueDate: '' });
  const [newReading, setNewReading] = useState({ title: '', url: '', description: '' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showReadingForm, setShowReadingForm] = useState(false);
  const [postingAnn, setPostingAnn] = useState(false);

  useEffect(() => {
    const base = `projects/${project.id}`;
    const unsub1 = onSnapshot(query(collection(db, base, 'tasks'), orderBy('createdAt', 'desc')), snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsub2 = onSnapshot(query(collection(db, base, 'announcements'), orderBy('createdAt', 'desc')), snap => {
      setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsub3 = onSnapshot(query(collection(db, base, 'readings'), orderBy('createdAt', 'desc')), snap => {
      setReadings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsub1(); unsub2(); unsub3(); };
  }, [project.id]);

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    await addDoc(collection(db, `projects/${project.id}/tasks`), {
      ...newTask,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
    });
    setNewTask({ title: '', description: '', status: 'todo', dueDate: '' });
    setShowTaskForm(false);
  };

  const updateTaskStatus = async (taskId, status) => {
    await updateDoc(doc(db, `projects/${project.id}/tasks`, taskId), { status });
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, `projects/${project.id}/tasks`, taskId));
  };

  const postAnnouncement = async () => {
    if (!newAnn.trim()) return;
    setPostingAnn(true);
    await addDoc(collection(db, `projects/${project.id}/announcements`), {
      content: newAnn,
      authorId: user.uid,
      authorName: user.displayName,
      createdAt: serverTimestamp(),
    });
    setNewAnn('');
    setPostingAnn(false);
  };

  const addReading = async () => {
    if (!newReading.title.trim()) return;
    await addDoc(collection(db, `projects/${project.id}/readings`), {
      ...newReading,
      addedBy: user.uid,
      createdAt: serverTimestamp(),
    });
    setNewReading({ title: '', url: '', description: '' });
    setShowReadingForm(false);
  };

  const members = Object.entries(project.memberNames || {}).map(([uid, name]) => ({
    uid, name, isLead: uid === project.leadResearcherId
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
                    <input type="date" value={newTask.dueDate} onChange={e => setNewTask(f => ({ ...f, dueDate: e.target.value }))} />
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
                        {task.dueDate && <p className="db-task-due">Due: {task.dueDate}</p>}
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
                    <strong>{a.authorName}</strong>
                    <span>{a.createdAt?.toDate?.()?.toLocaleDateString() || 'Just now'}</span>
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
