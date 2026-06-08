import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardShell from '../../components/dashboard/DashboardShell';

const RESOURCES = [
  { title: 'Beginner Research Guide', desc: 'Start your research journey from scratch', url: 'https://discord.gg/8wPzZkGy5Z', icon: '🚀', type: 'Guide' },
  { title: 'Literature Review Template', desc: 'How to find and synthesize sources', url: 'https://discord.gg/8wPzZkGy5Z', icon: '📚', type: 'Template' },
  { title: 'Research Question Worksheet', desc: 'Formulate a clear, testable hypothesis', url: 'https://discord.gg/8wPzZkGy5Z', icon: '❓', type: 'Worksheet' },
  { title: 'Data Analysis Basics', desc: 'Intro to statistical methods for research', url: 'https://discord.gg/8wPzZkGy5Z', icon: '📊', type: 'Guide' },
  { title: 'APA Citation Guide', desc: 'Format your references correctly', url: 'https://discord.gg/8wPzZkGy5Z', icon: '🔖', type: 'Reference' },
  { title: 'Synthica Journal — Submit', desc: 'Submit your finished research paper', url: '/journal', icon: '📄', type: 'Action' },
];

const genId = () => Math.random().toString(36).slice(2, 9);

export default function IndependentResearcherDashboard() {
  const { user } = useUserAuth();
  const [activeTab, setActiveTab] = useState('tracker');
  const [goals, setGoals] = useState([]);
  const [readings, setReadings] = useState([]);
  const [notes, setNotes] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newReading, setNewReading] = useState({ title: '', url: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addingReading, setAddingReading] = useState(false);

  useEffect(() => { loadProgress(); }, [user]);

  const loadProgress = async () => {
    if (!user) return;
    try {
      const snap = await getDoc(doc(db, 'independentProgress', user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setGoals(d.goals || []);
        setReadings(d.readings || []);
        setNotes(d.notes || '');
      }
    } catch (e) { console.error(e); }
  };

  const saveProgress = async (updatedGoals = goals, updatedReadings = readings, updatedNotes = notes) => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'independentProgress', user.uid), {
        goals: updatedGoals,
        readings: updatedReadings,
        notes: updatedNotes,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    const updated = [...goals, { id: genId(), text: newGoal, done: false }];
    setGoals(updated);
    setNewGoal('');
    saveProgress(updated, readings, notes);
  };

  const toggleGoal = (id) => {
    const updated = goals.map(g => g.id === id ? { ...g, done: !g.done } : g);
    setGoals(updated);
    saveProgress(updated, readings, notes);
  };

  const removeGoal = (id) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    saveProgress(updated, readings, notes);
  };

  const addReading = () => {
    if (!newReading.title.trim()) return;
    const updated = [...readings, { id: genId(), ...newReading, done: false }];
    setReadings(updated);
    setNewReading({ title: '', url: '' });
    setAddingReading(false);
    saveProgress(goals, updated, notes);
  };

  const toggleReading = (id) => {
    const updated = readings.map(r => r.id === id ? { ...r, done: !r.done } : r);
    setReadings(updated);
    saveProgress(goals, updated, notes);
  };

  const removeReading = (id) => {
    const updated = readings.filter(r => r.id !== id);
    setReadings(updated);
    saveProgress(goals, updated, notes);
  };

  const completedGoals = goals.filter(g => g.done).length;
  const completedReadings = readings.filter(r => r.done).length;
  const progress = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  return (
    <DashboardShell activeTab="dashboard">
      <div className="db-page">
        <motion.div className="db-page-header" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <p className="db-greeting">Welcome back,</p>
            <h1 className="db-title">{user?.displayName?.split(' ')[0]}'s <span className="yellow-text">Research</span></h1>
          </div>
          <span className="db-role-pill db-role-teal">Independent Researcher</span>
        </motion.div>

        {/* Progress bar */}
        <motion.div className="db-card db-progress-overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="db-progress-header">
            <div>
              <h3>Research Progress</h3>
              <p>{completedGoals} of {goals.length} goals completed</p>
            </div>
            <span className="db-progress-pct">{progress}%</span>
          </div>
          <div className="db-progress-bar-track">
            <div className="db-progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="db-mini-stats">
            <span>📋 {goals.length} Goals</span>
            <span>📖 {completedReadings}/{readings.length} Readings Done</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="db-tabs">
          <button className={`db-tab ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => setActiveTab('tracker')}>Research Tracker</button>
          <button className={`db-tab ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>Resources</button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'tracker' ? (
            <motion.div key="tracker" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="db-two-col">
                {/* Goals */}
                <div className="db-card">
                  <h2 className="db-card-title">🎯 Research Goals</h2>
                  <p className="db-card-sub">Break your project into achievable milestones.</p>
                  <div className="db-checklist">
                    {goals.map(g => (
                      <div key={g.id} className={`db-check-item ${g.done ? 'done' : ''}`}>
                        <button className="db-check-btn" onClick={() => toggleGoal(g.id)}>
                          {g.done ? '✓' : ''}
                        </button>
                        <span className="db-check-text">{g.text}</span>
                        <button className="db-check-remove" onClick={() => removeGoal(g.id)}>×</button>
                      </div>
                    ))}
                    {goals.length === 0 && <p className="db-empty-hint">Add your first research goal below.</p>}
                  </div>
                  <div className="db-add-row">
                    <input
                      value={newGoal}
                      onChange={e => setNewGoal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addGoal()}
                      placeholder="Add a goal…"
                    />
                    <button className="db-btn-primary db-btn-sm" onClick={addGoal}>Add</button>
                  </div>
                </div>

                {/* Reading List */}
                <div className="db-card">
                  <h2 className="db-card-title">📖 Reading List</h2>
                  <p className="db-card-sub">Track papers, articles, and books you need to read.</p>
                  <div className="db-checklist">
                    {readings.map(r => (
                      <div key={r.id} className={`db-check-item ${r.done ? 'done' : ''}`}>
                        <button className="db-check-btn" onClick={() => toggleReading(r.id)}>
                          {r.done ? '✓' : ''}
                        </button>
                        <div className="db-check-content">
                          {r.url ? (
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="db-check-link">{r.title}</a>
                          ) : (
                            <span className="db-check-text">{r.title}</span>
                          )}
                        </div>
                        <button className="db-check-remove" onClick={() => removeReading(r.id)}>×</button>
                      </div>
                    ))}
                    {readings.length === 0 && <p className="db-empty-hint">Track papers and articles here.</p>}
                  </div>
                  {addingReading ? (
                    <div className="db-add-reading-form">
                      <input value={newReading.title} onChange={e => setNewReading(f => ({ ...f, title: e.target.value }))} placeholder="Title or citation" />
                      <input value={newReading.url} onChange={e => setNewReading(f => ({ ...f, url: e.target.value }))} placeholder="URL (optional)" />
                      <div className="db-form-row-btns">
                        <button className="db-btn-primary db-btn-sm" onClick={addReading}>Add</button>
                        <button className="db-btn-ghost db-btn-sm" onClick={() => setAddingReading(false)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button className="db-btn-ghost db-btn-sm" onClick={() => setAddingReading(true)}>+ Add Reading</button>
                  )}
                </div>

                {/* Notes */}
                <div className="db-card db-card-full">
                  <h2 className="db-card-title">📝 Research Notes</h2>
                  <p className="db-card-sub">Your personal research journal — ideas, observations, references.</p>
                  <textarea
                    className="db-notes-area"
                    rows={8}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Write your research notes here. Ideas, methodology thoughts, key findings..."
                  />
                  <button className="db-btn-primary" onClick={() => saveProgress(goals, readings, notes)} disabled={saving}>
                    {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="resources" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="db-resource-grid">
                {RESOURCES.map((r, i) => (
                  <motion.a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="db-resource-card"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <span className="db-resource-card-icon">{r.icon}</span>
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
                    <span className="db-resource-type">{r.type}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
}
