import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['General', 'Research', 'Education', 'Community', 'Competition'];

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export default function Admin() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();

  if (authLoading) {
    return (
      <div className="admin-page">
        <Navbar />
        <div className="admin-loading"><div className="newsletter-spinner" /></div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-page">
        <Navbar />
        <LoginForm onSignIn={signIn} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Navbar />
      <Dashboard user={user} onSignOut={signOut} />
      <Footer />
    </div>
  );
}

function LoginForm({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSignIn(email, password);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Staff Login</h2>
        <p>Sign in to manage the Synthica newsletter.</p>
        {error && <div className="admin-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="admin-btn-primary" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ user, onSignOut }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setArticles(data || []);
    } catch {
      // RLS will block if not authenticated
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    await supabase.from('articles').delete().eq('id', id);
    fetchArticles();
  };

  const handleEditorSave = () => {
    setEditingArticle(null);
    setCreating(false);
    fetchArticles();
  };

  if (editingArticle || creating) {
    return (
      <ArticleEditor
        article={editingArticle}
        userId={user.id}
        onSave={handleEditorSave}
        onCancel={() => { setEditingArticle(null); setCreating(false); }}
        onDelete={editingArticle ? (id) => { handleDelete(id); handleEditorSave(); } : null}
      />
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h2>Newsletter Admin</h2>
          <p className="admin-user-info">Signed in as {user.email}</p>
        </div>
        <div className="admin-dashboard-actions">
          <button className="admin-btn-primary" onClick={() => setCreating(true)}>
            + New Article
          </button>
          <button className="admin-btn-secondary" onClick={onSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      {loading ? (
        <div className="newsletter-loading"><div className="newsletter-spinner" /></div>
      ) : articles.length === 0 ? (
        <div className="admin-empty">
          <p>No articles yet. Create your first article!</p>
        </div>
      ) : (
        <div className="admin-article-list">
          <div className="admin-list-header">
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          {articles.map(article => (
            <div key={article.id} className="admin-list-row">
              <span className="admin-list-title">{article.title}</span>
              <span className="admin-list-category">{article.category}</span>
              <span className={`admin-status-badge ${article.status}`}>
                {article.status}
              </span>
              <span className="admin-list-date">
                {article.status === 'published' ? formatDate(article.published_at) : formatDate(article.updated_at)}
              </span>
              <div className="admin-list-actions">
                <button className="admin-btn-icon" onClick={() => setEditingArticle(article)} title="Edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button className="admin-btn-icon admin-btn-danger" onClick={() => handleDelete(article.id)} title="Delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleEditor({ article, userId, onSave, onCancel, onDelete }) {
  const isEditing = !!article;
  const [form, setForm] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    body: article?.body || '',
    category: article?.category || 'General',
    author_name: article?.author_name || 'Synthica Team',
    cover_image_url: article?.cover_image_url || '',
    is_featured: article?.is_featured || false,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (title) => {
    setForm(prev => ({ ...prev, title, slug: generateSlug(title) }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const ext = file.name.split('.').pop();
      const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(path);

      setForm(prev => ({ ...prev, cover_image_url: publicUrl }));
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (status) => {
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const now = new Date().toISOString();
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || generateSlug(form.title),
        excerpt: form.excerpt.trim(),
        body: form.body,
        category: form.category,
        author_name: form.author_name.trim() || 'Synthica Team',
        cover_image_url: form.cover_image_url,
        is_featured: form.is_featured,
        status,
        author_id: userId,
        updated_at: now,
        ...(status === 'published' && !article?.published_at ? { published_at: now } : {}),
      };

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', article.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('articles')
          .insert(payload);
        if (insertError) throw insertError;
      }

      onSave();
    } catch (err) {
      setError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-header">
        <h2>{isEditing ? 'Edit Article' : 'New Article'}</h2>
        <button className="admin-btn-secondary" onClick={onCancel}>Cancel</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-editor-form">
        <div className="admin-form-group">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Article title"
          />
        </div>

        <div className="admin-form-group">
          <label>Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="article-url-slug"
          />
        </div>

        <div className="admin-form-group">
          <label>Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Brief summary of the article..."
            rows={3}
          />
        </div>

        <div className="admin-form-group">
          <label>Body <span className="admin-form-hint">(Markdown supported)</span></label>
          <textarea
            value={form.body}
            onChange={e => setForm(prev => ({ ...prev, body: e.target.value }))}
            placeholder="Write your article content in Markdown..."
            rows={20}
            className="admin-editor-body"
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Category</label>
            <select
              value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Author</label>
            <input
              type="text"
              value={form.author_name}
              onChange={e => setForm(prev => ({ ...prev, author_name: e.target.value }))}
              placeholder="Author name"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Cover Image</label>
          <div className="admin-image-upload">
            {form.cover_image_url && (
              <div className="admin-image-preview">
                <img src={form.cover_image_url} alt="Cover preview" />
              </div>
            )}
            <label className="admin-upload-btn">
              {uploading ? 'Uploading...' : 'Choose Image'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-checkbox-label">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={e => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
            />
            Featured article
          </label>
        </div>

        <div className="admin-editor-actions">
          <button
            className="admin-btn-secondary"
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            Save as Draft
          </button>
          <button
            className="admin-btn-primary"
            onClick={() => handleSave('published')}
            disabled={saving}
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
          {isEditing && onDelete && (
            <button
              className="admin-btn-danger"
              onClick={() => onDelete(article.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
