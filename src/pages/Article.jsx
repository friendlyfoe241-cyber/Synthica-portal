import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useArticleBySlug } from '../hooks/useArticles';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' }
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function Article() {
  const { slug } = useParams();
  const { data: article, loading, error } = useArticleBySlug(slug);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Synthica Newsletter`;
      const meta = document.querySelector('meta[property="og:title"]');
      if (meta) meta.setAttribute('content', article.title);
    }
    return () => { document.title = 'Synthica'; };
  }, [article]);

  return (
    <div className="article-page">
      <section className="page-hero article-hero">
        <Navbar />
        <div className="page-hero-content">
          {article && (
            <>
              <div className="article-hero-meta">
                <span className="article-category-badge">{article.category}</span>
                <span className="article-hero-date">{formatDate(article.published_at)}</span>
              </div>
              <h1 className="article-hero-title">{article.title}</h1>
              <p className="article-hero-author">By {article.author_name}</p>
            </>
          )}
        </div>
      </section>

      {loading && (
        <div className="article-loading">
          <div className="newsletter-spinner" />
          <p>Loading article...</p>
        </div>
      )}

      {error && (
        <div className="article-error-container">
          <h2>Article Not Found</h2>
          <p>The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link to="/newsletter" className="back-to-newsletter">&larr; Back to Newsletter</Link>
        </div>
      )}

      {!loading && !error && article && (
        <>
          {article.cover_image_url && (
            <motion.div {...fadeIn} className="article-cover-image">
              <img src={article.cover_image_url} alt={article.title} />
            </motion.div>
          )}

          <motion.article {...fadeIn} className="article-body-container">
            <div className="article-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {article.body}
              </ReactMarkdown>
            </div>
            <div className="article-back-link">
              <Link to="/newsletter" className="back-to-newsletter">&larr; Back to Newsletter</Link>
            </div>
          </motion.article>
        </>
      )}

      <Footer />
    </div>
  );
}
