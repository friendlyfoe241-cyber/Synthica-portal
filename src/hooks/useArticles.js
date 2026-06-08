import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'synthica_articles';

const MOCK_ARTICLES = [
  {
    id: '1',
    title: 'How Student Researchers Are Using AI to Tackle Climate Change',
    slug: 'student-researchers-ai-climate-change',
    excerpt: 'From predicting wildfire patterns to optimizing renewable energy grids, student-led AI projects are making real impact on climate research. We explore three groundbreaking projects from our latest cohort.',
    body: `## The Next Generation of Climate Science

Student researchers around the world are leveraging artificial intelligence to address one of the most pressing challenges of our time: climate change. What was once the exclusive domain of well-funded government labs is now accessible to talented students with a laptop and a vision.

### Predicting Wildfire Patterns with Machine Learning

A team of three high school students from California developed a neural network that predicts wildfire spread patterns with 87% accuracy, outperforming several existing commercial models.

> "We trained our model on 15 years of satellite imagery and weather data. The key insight was combining wind pattern analysis with vegetation moisture levels." — Sarah Chen, Student Researcher

The team used a combination of **convolutional neural networks** and **recurrent neural networks** to process both spatial and temporal data. Their approach has already been adopted by two local fire departments.

### Optimizing Renewable Energy Distribution

Another group focused on energy grid optimization, using reinforcement learning to determine the most efficient distribution of solar and wind power across regional grids.

Key findings from their research:

- **23% improvement** in energy distribution efficiency during peak hours
- **Reduced waste** by predicting overgeneration events 6 hours in advance
- **Cost savings** estimated at $2.1M annually for a mid-sized grid operator

### What's Next?

These projects represent just a fraction of the innovation happening in student research. The Synthica platform provides the tools, mentorship, and community to help turn these ideas into published work.

---

*Interested in starting your own research project? [Join our community](https://discord.gg/8wPzZkGy5Z) to connect with mentors and fellow researchers.*`,
    cover_image_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=500&fit=crop',
    category: 'Research',
    author_name: 'Synthica Research Team',
    status: 'published',
    is_featured: true,
    published_at: '2026-04-15T10:00:00Z',
    created_at: '2026-04-14T08:00:00Z',
    updated_at: '2026-04-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'The State of STEM Education in 2026: Trends and Opportunities',
    slug: 'state-of-stem-education-2026',
    excerpt: 'A deep dive into how STEM education is evolving — from AI-assisted tutoring to virtual lab simulations — and what it means for the next generation of scientists and engineers.',
    body: `## STEM Education Is Undergoing a Revolution

The landscape of STEM education has shifted dramatically. Traditional lecture-based learning is giving way to hands-on, project-driven curricula that mirror real-world research environments.

### Key Trends

**1. AI-Assisted Learning**
Personalized AI tutors are now helping students grasp complex concepts at their own pace, adapting difficulty and teaching style in real-time.

**2. Virtual Lab Simulations**
Students can now conduct experiments in virtual environments that replicate real laboratory conditions — from chemistry titrations to physics experiments.

**3. Cross-Disciplinary Projects**
The boundaries between biology, computer science, and engineering are blurring. Modern STEM education encourages students to work across disciplines.

### The Numbers

| Metric | 2024 | 2026 |
|--------|------|------|
| Schools with AI tutoring | 12% | 41% |
| Students in virtual labs | 5% | 28% |
| Cross-discipline programs | 15% | 52% |

### What This Means for Students

The opportunities have never been greater. Students who engage with these new tools and approaches are finding themselves better prepared for both college and industry roles.`,
    cover_image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=500&fit=crop',
    category: 'Education',
    author_name: 'Dr. Emily Torres',
    status: 'published',
    is_featured: false,
    published_at: '2026-04-12T14:00:00Z',
    created_at: '2026-04-11T09:00:00Z',
    updated_at: '2026-04-12T14:00:00Z'
  },
  {
    id: '3',
    title: 'Meet the Winners of the 2026 Global Research Challenge',
    slug: 'winners-2026-global-research-challenge',
    excerpt: 'Over 2,000 students from 47 countries competed in this year\'s challenge. Here are the projects that took home the top prizes and the stories behind them.',
    body: `## Celebrating Innovation and Excellence

The 2026 Global Research Challenge brought together some of the brightest young minds from around the world. After months of research, prototyping, and presentations, the winners have been announced.

### Grand Prize: BioTech Solutions Team

A team of four students from Singapore developed a low-cost biosensor that can detect water contamination in under 30 seconds — 10x faster than existing solutions.

### Second Place: Quantum Computing Pioneers

Students from MIT and Stanford collaborated on a quantum algorithm that optimizes supply chain logistics, reducing computational time by 95%.

### Third Place: Environmental Data Collective

A multinational team created an open-source platform for aggregating and analyzing environmental sensor data from citizen scientists worldwide.

### Looking Ahead

Registration for the 2027 challenge opens in September. Start forming your teams and brainstorming ideas now!`,
    cover_image_url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=500&fit=crop',
    category: 'Competition',
    author_name: 'Synthica Team',
    status: 'published',
    is_featured: false,
    published_at: '2026-04-08T09:00:00Z',
    created_at: '2026-04-07T08:00:00Z',
    updated_at: '2026-04-08T09:00:00Z'
  },
  {
    id: '4',
    title: 'Building a Research Community: Lessons from Our University Partners',
    slug: 'building-research-community-university-partners',
    excerpt: 'How three universities transformed their undergraduate research programs by fostering collaboration, peer mentorship, and cross-departmental partnerships.',
    body: `## What Makes a Research Community Thrive?

After partnering with over 20 universities, we've identified the key ingredients that separate thriving research communities from stagnant ones.

### The Three Pillars

1. **Peer Mentorship**: Senior students guiding newcomers creates a self-sustaining cycle of knowledge transfer
2. **Cross-Department Collaboration**: Breaking down silos between departments leads to innovative interdisciplinary research
3. **Celebration of Failure**: Normalizing failed experiments and dead-end hypotheses encourages bold thinking

### Case Study: Stanford's Undergraduate Research Initiative

Stanford restructured their undergraduate research program around these three pillars. Within two years:

- Student publication rates increased by 340%
- Cross-departmental projects went from 8% to 47% of all projects
- Student satisfaction scores reached an all-time high

The key takeaway? Community building is not a nice-to-have — it's the foundation of productive research.`,
    cover_image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop',
    category: 'Community',
    author_name: 'Prof. James Liu',
    status: 'published',
    is_featured: false,
    published_at: '2026-04-03T11:00:00Z',
    created_at: '2026-04-02T08:00:00Z',
    updated_at: '2026-04-03T11:00:00Z'
  },
  {
    id: '5',
    title: 'A Beginner\'s Guide to Publishing Your First Research Paper',
    slug: 'beginners-guide-publishing-first-research-paper',
    excerpt: 'Everything you need to know about the publication process — from choosing a journal to responding to peer review. A practical guide for first-time student authors.',
    body: `## From Idea to Publication

Publishing your first research paper can feel daunting, but it doesn't have to be. Here's a step-by-step guide to help you navigate the process.

### Step 1: Choose the Right Journal

Not all journals are created equal. Consider:

- **Scope**: Does your work fit the journal's focus area?
- **Audience**: Who will read your paper?
- **Reputation**: Is the journal well-regarded in your field?
- **Open Access**: Do you want your paper freely available?

### Step 2: Write a Compelling Abstract

Your abstract is your elevator pitch. It should contain:

- The problem you're addressing
- Your approach or methodology
- Key results
- Significance of your findings

### Step 3: Navigate Peer Review

Peer review is your friend. Reviewers provide valuable feedback that strengthens your work. Here's how to handle it:

1. Read all comments carefully
2. Address every point raised
3. Be respectful in your responses
4. Revise and resubmit promptly

### Step 4: Celebrate!

Getting published is a significant achievement. Take time to celebrate before starting your next project.`,
    cover_image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop',
    category: 'Education',
    author_name: 'Dr. Maria Santos',
    status: 'published',
    is_featured: false,
    published_at: '2026-03-28T13:00:00Z',
    created_at: '2026-03-27T08:00:00Z',
    updated_at: '2026-03-28T13:00:00Z'
  },
  {
    id: '6',
    title: 'Synthica Spring 2026 Update: New Features and What\'s Coming Next',
    slug: 'synthica-spring-2026-update',
    excerpt: 'An overview of new platform features including the newsletter you\'re reading right now, upcoming mentorship matching, and our roadmap for the rest of the year.',
    body: `## What's New at Synthica

Spring 2026 has been a season of growth for Synthica. Here's what we've been building and what's on the horizon.

### New Features

- **Newsletter Platform**: You're reading it! A dedicated space for research insights, community stories, and program updates.
- **Improved Project Dashboard**: Better tracking for milestones, deliverables, and collaboration.
- **Mobile-Friendly Interface**: All Synthica features now work seamlessly on phones and tablets.

### Coming This Summer

- **AI Mentorship Matching**: Get paired with mentors based on your research interests and learning style.
- **Research Collaboration Hub**: Find collaborators across institutions with complementary skills.
- **Virtual Conference Series**: Present your research to a global audience from anywhere.

### Join the Conversation

Have ideas for features you'd like to see? Join our Discord community and let us know!`,
    cover_image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop',
    category: 'General',
    author_name: 'Synthica Team',
    status: 'published',
    is_featured: false,
    published_at: '2026-03-20T10:00:00Z',
    created_at: '2026-03-19T08:00:00Z',
    updated_at: '2026-03-20T10:00:00Z'
  }
];

function loadArticles() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ARTICLES));
  return MOCK_ARTICLES;
}

function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

export function usePublishedArticles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(loadArticles().filter(a => a.status === 'published'));
    setLoading(false);
  }, []);

  return { data, loading, error: null };
}

export function useArticleBySlug(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const article = loadArticles().find(a => a.slug === slug && a.status === 'published');
    if (article) setData(article);
    else setError('Article not found');
    setLoading(false);
  }, [slug]);

  return { data, loading, error };
}

export function useAllArticles() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    setData(loadArticles());
    setLoading(false);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const save = (article) => {
    const articles = loadArticles();
    const now = new Date().toISOString();
    if (article.id && articles.some(a => a.id === article.id)) {
      const updated = articles.map(a => a.id === article.id ? { ...article, updated_at: now } : a);
      saveArticles(updated);
    } else {
      const newArticle = {
        ...article,
        id: article.id || crypto.randomUUID(),
        created_at: now,
        updated_at: now,
      };
      saveArticles([newArticle, ...articles]);
    }
    refetch();
  };

  const remove = (id) => {
    saveArticles(loadArticles().filter(a => a.id !== id));
    refetch();
  };

  return { data, loading, error: null, refetch, save, remove };
}
