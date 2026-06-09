import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardShell from '../../components/dashboard/DashboardShell';

const RESOURCES = [
  { title: 'Research Methodology Guide', desc: 'Step-by-step guide to conducting academic research', url: 'https://discord.gg/8wPzZkGy5Z', type: 'Guide', icon: '📖' },
  { title: 'How to Write a Literature Review', desc: 'Templates and examples for literature reviews', url: 'https://discord.gg/8wPzZkGy5Z', type: 'Template', icon: '📝' },
  { title: 'Chapter Operations Handbook', desc: 'Everything you need to run a successful chapter', url: 'https://discord.gg/8wPzZkGy5Z', type: 'Guide', icon: '📗' },
  { title: 'Citation & Formatting Standards', desc: 'APA, MLA, and Chicago citation guides', url: 'https://discord.gg/8wPzZkGy5Z', type: 'Reference', icon: '🔖' },
  { title: 'Recruiting Members Playbook', desc: 'Strategies to grow your chapter', url: 'https://discord.gg/8wPzZkGy5Z', type: 'Guide', icon: '🎯' },
  { title: 'Journal Submission Checklist', desc: 'Prepare papers for Synthica Journal', url: '/journal', type: 'Checklist', icon: '✅' },
];

export default function ChapterLeaderDashboard() {
  const { user, userProfile } = useUserAuth();
  const [chapter, setChapter] = useState(null);
  const [form, setForm] = useState({ name: '', school: '', location: '', member_count: '', meetings: '', projects_completed: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadChapter();
  }, [user]);

  const loadChapter = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('leader_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading chapter:', error);
        return;
      }
      
      if (data) {
        setChapter(data);
        setForm({
          name: data.name || '',
          school: data.school || '',
          location: data.location || '',
          member_count: data.member_count || '',
          meetings: data.meetings || '',
          projects_completed: data.projects_completed || '',
          notes: data.notes || '',
        });
      }
    } catch (e) { console.error(e); }
  };

  const saveChapter = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        school: form.school,
        location: form.location,
        member_count: Number(form.member_count) || 0,
        meetings: Number(form.meetings) || 0,
        projects_completed: Number(form.projects_completed) || 0,
        notes: form.notes,
        leader_id: user.id,
        leader_name: user.user_metadata?.full_name || user.email,
      };

      const { error } = await supabase
        .from('chapters')
        .upsert(payload, { onConflict: 'leader_id' });
      
      if (error) throw error;
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const stats = [
    { label: 'Chapter Members', value: form.member_count || '—', icon: '👥' },
    { label: 'Meetings Held', value: form.meetings || '—', icon: '📅' },
    { label: 'Projects Completed', value: form.projects_completed || '—', icon: '🏆' },
  ];

  return (
    <DashboardShell activeTab="dashboard">
      <div className="db-page">
        <motion.div className="db-page-header" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <p className="db-greeting">Good to see you,</p>
            <h1 className="db-title">{user?.user_metadata?.full_name?.split(' ')[0]} <span className="yellow-text">Chapter</span></h1>
          </div>
          <span className="db-role-pill db-role-blue">Chapter Leader</span>
        </motion.div>

        {/* Stats */}
        <div className="db-stats-row">
          {stats.map((s, i) => (
            <motion.div key={s.label} className="db-stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <span className="db-stat-icon">{s.icon}</span>
              <div>
                <p className="db-stat-val">{s.value}</p>
                <p className="db-stat-label">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="db-two-col">
          {/* Chapter Info Form */}
          <motion.div className="db-card db-card-full" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="db-card-title">📋 Chapter Info & Progress</h2>
            <p className="db-card-sub">Update your chapter details and track your progress.</p>
            <div className="db-form-grid">
              <div className="db-field">
                <label>Chapter Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Westfield HS Chapter" />
              </div>
              <div className="db-field">
                <label>School / Institution</label>
                <input value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))} placeholder="e.g. Westfield High School" />
              </div>
              <div className="db-field">
                <label>Location (City, Country)</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. New York, USA" />
              </div>
              <div className="db-field">
                <label>Active Members</label>
                <input type="number" min="0" value={form.member_count} onChange={e => setForm(f => ({ ...f, member_count: e.target.value }))} placeholder="0" />
              </div>
              <div className="db-field">
                <label>Meetings Held This Semester</label>
                <input type="number" min="0" value={form.meetings} onChange={e => setForm(f => ({ ...f, meetings: e.target.value }))} placeholder="0" />
              </div>
              <div className="db-field">
                <label>Projects Completed</label>
                <input type="number" min="0" value={form.projects_completed} onChange={e => setForm(f => ({ ...f, projects_completed: e.target.value }))} placeholder="0" />
              </div>
              <div className="db-field db-field-full">
                <label>Progress Notes</label>
                <textarea rows={4} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Share what your chapter is working on, upcoming events, challenges..." />
              </div>
            </div>
            <div className="db-form-actions">
              <button className="db-btn-primary" onClick={saveChapter} disabled={saving}>
                {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Progress'}
              </button>
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div className="db-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="db-card-title">📚 Resources</h2>
            <p className="db-card-sub">Guides, templates, and references for you and your members.</p>
            <div className="db-resource-list">
              {RESOURCES.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="db-resource-item">
                  <span className="db-resource-icon">{r.icon}</span>
                  <div className="db-resource-info">
                    <p className="db-resource-title">{r.title}</p>
                    <p className="db-resource-desc">{r.desc}</p>
                  </div>
                  <span className="db-resource-type">{r.type}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
}
