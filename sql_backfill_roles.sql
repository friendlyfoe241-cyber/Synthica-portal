-- ============================================
-- BACKFILL: Update profiles.roles from approved applications
-- Run this in Supabase SQL Editor to sync roles for existing users
-- ============================================

-- Sync approved applications to profiles.roles array
DO $$
DECLARE
  app RECORD;
BEGIN
  FOR app IN 
    SELECT DISTINCT user_id, role_applied 
    FROM applications 
    WHERE status = 'approved'
  LOOP
    UPDATE profiles
    SET 
      roles = COALESCE(
        (SELECT array_agg(DISTINCT elem) 
         FROM unnest(array_cat(COALESCE(roles, ARRAY[]::text[]), ARRAY[app.role_applied])) AS elem
        ), 
        ARRAY[app.role_applied]
      ),
      updated_at = NOW()
    WHERE id = app.user_id
    AND NOT (COALESCE(roles, ARRAY[]::text[]) && ARRAY[app.role_applied]);
  END LOOP;
END $$;

-- Verify the update
SELECT id, full_name, roles FROM profiles;