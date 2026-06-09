-- =============================================
-- Synthica Portal - Supabase Database Schema
-- =============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- User profiles with role assignments
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'pending' CHECK (role IN ('pending', 'chapter_leader', 'lead_researcher', 'associate_researcher', 'independent_researcher')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'pending');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PROJECTS TABLE
-- Research projects managed by lead researchers
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL CHECK (subject IN ('Biology', 'Computer Science', 'Chemistry', 'Economics', 'Mathematics', 'Physics', 'Psychology', 'Humanities', 'Other')),
  status TEXT DEFAULT 'recruiting' CHECK (status IN ('recruiting', 'active', 'completed')),
  max_members INTEGER DEFAULT 4,
  lead_researcher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  lead_researcher_name TEXT,
  member_ids UUID[] DEFAULT '{}',
  member_names JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_lead_researcher ON projects(lead_researcher_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_subject ON projects(subject);

-- =============================================
-- TASKS TABLE
-- Project tasks with kanban-style status
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  due_date DATE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- =============================================
-- ANNOUNCEMENTS TABLE
-- Project announcements from lead researchers
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_announcements_project ON announcements(project_id);

-- =============================================
-- READINGS TABLE
-- Research readings/papers for projects
-- =============================================
CREATE TABLE IF NOT EXISTS readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  description TEXT,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_readings_project ON readings(project_id);

-- =============================================
-- CHAPTERS TABLE
-- Chapter information for chapter leaders
-- =============================================
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  leader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT,
  school TEXT,
  location TEXT,
  member_count INTEGER DEFAULT 0,
  meetings INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_chapters_leader ON chapters(leader_id);

-- =============================================
-- INDEPENDENT PROGRESS TABLE
-- Personal research tracking for independent researchers
-- =============================================
CREATE TABLE IF NOT EXISTS independent_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  goals JSONB DEFAULT '[]',
  readings JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_independent_progress_user ON independent_progress(user_id);

-- =============================================
-- APPLICATIONS TABLE
-- Role applications from users
-- =============================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  user_email TEXT,
  role_applied TEXT NOT NULL CHECK (role_applied IN ('chapter_leader', 'lead_researcher', 'associate_researcher', 'independent_researcher')),
  statement TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  project_title TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_role ON applications(role_applied);

-- =============================================
-- SUBSCRIBERS TABLE
-- Newsletter subscribers
-- =============================================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- =============================================
-- ARTICLES TABLE
-- Newsletter articles
-- =============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  body TEXT,
  category TEXT DEFAULT 'General' CHECK (category IN ('General', 'Research', 'Education', 'Community', 'Competition')),
  author_name TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  cover_image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE independent_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- PROJECTS: Everyone can read, authenticated users can create, only owner can update/delete
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Lead researcher can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = lead_researcher_id);

CREATE POLICY "Lead researcher can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = lead_researcher_id);

-- TASKS: Everyone can view, project members can modify
CREATE POLICY "Anyone can view tasks" ON tasks
  FOR SELECT USING (true);

CREATE POLICY "Project members can create tasks" ON tasks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Project members can update tasks" ON tasks
  FOR UPDATE USING (true);

CREATE POLICY "Project members can delete tasks" ON tasks
  FOR DELETE USING (true);

-- ANNOUNCEMENTS: Everyone can view, project members can create
CREATE POLICY "Anyone can view announcements" ON announcements
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create announcements" ON announcements
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- READINGS: Everyone can view, project members can add
CREATE POLICY "Anyone can view readings" ON readings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create readings" ON readings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- CHAPTERS: Users can manage their own chapter
CREATE POLICY "Users can view chapters" ON chapters
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own chapter" ON chapters
  FOR ALL USING (auth.uid() = leader_id);

-- INDEPENDENT PROGRESS: Users can only see and modify their own
CREATE POLICY "Users can view own progress" ON independent_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON independent_progress
  FOR ALL USING (auth.uid() = user_id);

-- APPLICATIONS: Users can view own applications
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create applications" ON applications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- SUBSCRIBERS: Anyone can subscribe, only service role can view
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can view subscribers" ON subscribers
  FOR SELECT USING (auth.role() = 'service_role');

-- ARTICLES: Everyone can view published articles
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create articles" ON articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update their articles" ON articles
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their articles" ON articles
  FOR DELETE USING (auth.uid() = author_id);

-- =============================================
-- STORAGE BUCKET FOR ARTICLE IMAGES
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view article images" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'article-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own article images" ON storage.objects
  FOR DELETE USING (bucket_id = 'article-images' AND auth.uid() = owner);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chapters_updated_at ON chapters;
CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_independent_progress_updated_at ON independent_progress;
CREATE TRIGGER update_independent_progress_updated_at
  BEFORE UPDATE ON independent_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ENABLE REALTIME
-- =============================================

-- Enable realtime for projects table
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE readings;