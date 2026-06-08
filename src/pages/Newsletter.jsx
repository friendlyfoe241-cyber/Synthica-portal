import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { usePublishedArticles } from '../hooks/useArticles';
import { supabase } from '../lib/supabase';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
};

const CATEGORIES = ['All', 'Research', 'Education', 'Community', 'Competition', 'General'];

export default function Newsletter() {
  const { data: articles, loading, error } = usePublishedArticles();
  const [activeCategory, setActiveCategory] = useState('All');
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState(null);

  const featuredArticle = useMemo(() => {
    if (!articles.length) return null;
    return articles.find(a => a.is_featured) || articles[0];
  }, [articles]);

  const latestArticles = useMemo(() => {
    let filtered = articles;
    if (activeCategory !== 'All') {
      filtered = articles.filter(a => a.category === activeCategory);
    }
    return filtered.filter(a => a.id !== featuredArticle?.id);
  }, [articles, activeCategory, featuredArticle]);

  const archiveArticles = useMemo(() => {
    const latest = latestArticles.slice(0, 6);
    return articles.filter(a => a.id !== featuredArticle?.id && !latest.some(l => l.id === a.id));
  }, [articles, latestArticles, featuredArticle]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert({ email: subEmail.trim() });

      if (error && error.code !== '23505') throw error;
      setSubStatus('success');
      setSubEmail('');
    } catch {
      setSubStatus('error');
    }
  };

  return (
    <div className="newsletter-page">
      <section className="page-hero">
        <Navbar />
        <div className="page-hero-content">
          <span className="section-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Newsletter</span>
          <h1 className="page-hero-title">
            Synthica <span className="highlight-text">Newsletter</span>
          </h1>
          <p className="page-hero-subtitle">
            Insights, stories, and updates from the world of student research and innovation.
          </p>
        </div>
      </section>

      <section className="newsletter-content">
        <div className="newsletter-container">
          {loading && (
            <div className="newsletter-loading">
              <div className="newsletter-spinner" />
              <p>Loading articles...</p>
            </div>
          )}

          {error && (
            <div className="newsletter-error">
              <p>Unable to load articles. Please try again later.</p>
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <motion.div {...fadeIn} className="newsletter-empty">
              <h2>Coming Soon</h2>
              <p>We&apos;re working on our first articles. Check back soon!</p>
            </motion.div>
          )}

          {!loading && !error && articles.length > 0 && (
            <>
              {featuredArticle && (
                <div className="newsletter-section">
                  <h2 className="newsletter-section-title">Featured Post</h2>
                  <ArticleCard article={featuredArticle} featured />
                </div>
              )}

              <div className="newsletter-section">
                <h2 className="newsletter-section-title">Latest Posts</h2>

                <div className="category-filter">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {latestArticles.length > 0 ? (
                  <div className="articles-grid">
                    {latestArticles.map(article => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  <p className="no-articles-message">
                    No articles found in this category.
                  </p>
                )}
              </div>

              <motion.div {...fadeIn} className="newsletter-signup">
                <h3>Subscribe to our Newsletter</h3>
                <p>Get the latest articles on research, education, and innovation delivered to your inbox.</p>
                {subStatus === 'success' ? (
                  <p className="subscribe-success">Thanks for subscribing!</p>
                ) : (
                  <form className="newsletter-signup-form" onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={subEmail}
                      onChange={e => setSubEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="newsletter-signup-btn">Subscribe</button>
                  </form>
                )}
                {subStatus === 'error' && (
                  <p className="subscribe-error">Something went wrong. Please try again.</p>
                )}
              </motion.div>

              {archiveArticles.length > 0 && (
                <div className="newsletter-section">
                  <h2 className="newsletter-section-title">Article Archive</h2>
                  <div className="archive-list">
                    {archiveArticles.map(article => (
                      <a key={article.id} href={`/newsletter/${article.slug}`} className="archive-item">
                        <span className="archive-item-title">{article.title}</span>
                        <span className="archive-item-category">{article.category}</span>
                        <span className="archive-item-date">
                          {new Date(article.published_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
