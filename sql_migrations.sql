-- ============================================
-- MIGRATION: Project Applications System
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create project_applications table
CREATE TABLE IF NOT EXISTS project_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE project_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to recreate cleanly)
DROP POLICY IF EXISTS "Users can view own applications" ON project_applications;
DROP POLICY IF EXISTS "Users can create applications" ON project_applications;
DROP POLICY IF EXISTS "Lead researchers can view project applications" ON project_applications;
DROP POLICY IF EXISTS "Lead researchers can update applications" ON project_applications;

-- Create RLS policies
-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON project_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own applications
CREATE POLICY "Users can create applications" ON project_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lead researchers can view all applications for their projects
CREATE POLICY "Lead researchers can view project applications" ON project_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_applications.project_id 
      AND lead_researcher_id = auth.uid()
    )
  );

-- Lead researchers can update (approve/reject) applications
CREATE POLICY "Lead researchers can update applications" ON project_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_applications.project_id 
      AND lead_researcher_id = auth.uid()
    )
  );

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('project_application', 'team_request')),
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing notification policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;

-- Notification policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Create function to auto-create notification when application is submitted
CREATE OR REPLACE FUNCTION handle_project_application()
RETURNS TRIGGER AS $$
DECLARE
  project_lead_id UUID;
  applicant_name TEXT;
BEGIN
  -- Get the project lead researcher ID
  SELECT lead_researcher_id INTO project_lead_id
  FROM projects WHERE id = NEW.project_id;
  
  -- Get the applicant's name from profiles
  SELECT full_name INTO applicant_name
  FROM profiles WHERE id = NEW.user_id;
  
  -- Create notification for the lead researcher
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    project_lead_id,
    'project_application',
    'New Project Application',
    COALESCE(applicant_name, 'Someone') || ' wants to join your research project',
    '/dashboard'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_project_application_created ON project_applications;

-- Create trigger to automatically create notification when application is submitted
CREATE TRIGGER on_project_application_created
  AFTER INSERT ON project_applications
  FOR EACH ROW EXECUTE FUNCTION handle_project_application();

-- 4. Create indexes for performance
DROP INDEX IF EXISTS idx_project_applications_project_id;
DROP INDEX IF EXISTS idx_project_applications_user_id;
DROP INDEX IF EXISTS idx_notifications_user_id;
DROP INDEX IF EXISTS idx_notifications_unread;

CREATE INDEX idx_project_applications_project_id ON project_applications(project_id);
CREATE INDEX idx_project_applications_user_id ON project_applications(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- 5. Verify tables were created
SELECT 'project_applications table created' as result;