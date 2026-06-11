-- ============================================
-- MIGRATION: Project Applications & Notifications
-- ============================================

-- 1. Create project_applications table to track applications to join projects
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

-- Enable RLS for project_applications
ALTER TABLE project_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON project_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Lead researchers can view all applications for their projects
CREATE POLICY "Lead researchers can view project applications" ON project_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_applications.project_id 
      AND lead_researcher_id = auth.uid()
    )
  );

-- Users can create their own applications
CREATE POLICY "Users can create applications" ON project_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lead researchers can update (approve/reject) applications
CREATE POLICY "Lead researchers can update applications" ON project_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_applications.project_id 
      AND lead_researcher_id = auth.uid()
    )
  );

-- 2. Create notifications table for dashboard notifications
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

-- Enable RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notification read status
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- System can create notifications (or we can use service role)
CREATE POLICY "Users can insert own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Create function to handle new project application (triggers notification)
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
    applicant_name || ' wants to join your research project',
    '/dashboard'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create notification when application is submitted
DROP TRIGGER IF EXISTS on_project_application_created ON project_applications;
CREATE TRIGGER on_project_application_created
  AFTER INSERT ON project_applications
  FOR EACH ROW EXECUTE FUNCTION handle_project_application();

-- 4. Add helper function to check if user has associate researcher role
CREATE OR REPLACE FUNCTION user_has_role(user_uuid UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_uuid
    AND 'associate_researcher' = ANY(roles)
    AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to approve application and add user to project team
CREATE OR REPLACE FUNCTION approve_project_application(app_id UUID)
RETURNS VOID AS $$
DECLARE
  v_project_id UUID;
  v_user_id UUID;
  v_lead_id UUID;
BEGIN
  -- Get application details
  SELECT project_id, user_id INTO v_project_id, v_user_id
  FROM project_applications WHERE id = app_id;
  
  -- Verify the user making the request is the lead researcher
  SELECT lead_researcher_id INTO v_lead_id
  FROM projects WHERE id = v_project_id;
  
  IF v_lead_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  -- Add user to project team
  INSERT INTO project_members (project_id, user_id, role)
  VALUES (v_project_id, v_user_id, 'associate_researcher')
  ON CONFLICT (project_id, user_id) DO UPDATE SET role = 'associate_researcher';
  
  -- Update application status to approved
  UPDATE project_applications SET status = 'approved', updated_at = NOW()
  WHERE id = app_id;
  
  -- Mark notification as read
  UPDATE notifications 
  SET is_read = TRUE 
  WHERE user_id = v_lead_id 
  AND type = 'project_application'
  AND link = '/dashboard';
  
  -- Add associate_researcher role to user's profile if not present
  UPDATE profiles 
  SET roles = array_distinct(array_append(roles, 'associate_researcher'))
  WHERE id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to reject project application
CREATE OR REPLACE FUNCTION reject_project_application(app_id UUID)
RETURNS VOID AS $$
DECLARE
  v_project_id UUID;
  v_lead_id UUID;
BEGIN
  SELECT project_id INTO v_project_id FROM project_applications WHERE id = app_id;
  SELECT lead_researcher_id INTO v_lead_id FROM projects WHERE id = v_project_id;
  
  IF v_lead_id != auth.uid() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  UPDATE project_applications SET status = 'rejected', updated_at = NOW() WHERE id = app_id;
  
  -- Mark notification as read
  UPDATE notifications SET is_read = TRUE 
  WHERE user_id = v_lead_id AND type = 'project_application' AND link = '/dashboard';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create index for faster notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_project_applications_project_id ON project_applications(project_id);
CREATE INDEX IF NOT EXISTS idx_project_applications_user_id ON project_applications(user_id);