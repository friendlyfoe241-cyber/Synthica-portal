import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

export default function ArticleCard({ article, featured = false }) {
  if (!article) return null;

  if (featured) {
    return (
      <motion.div {...fadeIn}>
        <Link to={`/newsletter/${article.slug}`} className="featured-article-card">
          <div className="featured-article-image">
            {article.cover_image_url ? (
              <img src={article.cover_image_url} alt={article.title} />
            ) : (
              <div className="featured-article-image-placeholder">
                <span>Synthica</span>
              </div>
            )}
          </div>
          <div className="featured-article-content">
            <span className="article-category-badge">{article.category}</span>
            <h2 className="featured-article-title">{article.title}</h2>
            <p className="featured-article-excerpt">{article.excerpt}</p>
            <div className="featured-article-meta">
              <span className="article-author">{article.author_name}</span>
              <span className="article-date">{formatDate(article.published_at)}</span>
            </div>
            <span className="featured-article-read-more">Read More &rarr;</span>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div {...fadeIn}>
      <Link to={`/newsletter/${article.slug}`} className="article-card">
        <div className="article-card-image">
          {article.cover_image_url ? (
            <img src={article.cover_image_url} alt={article.title} />
          ) : (
            <div className="article-card-image-placeholder">
              <span>Synthica</span>
            </div>
          )}
          <span className="article-category-badge">{article.category}</span>
        </div>
        <div className="article-card-content">
          <h3 className="article-card-title">{article.title}</h3>
          <p className="article-card-excerpt">{article.excerpt}</p>
          <div className="article-card-meta">
            <span className="article-author">{article.author_name}</span>
            <span className="article-date">{formatDate(article.published_at)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
