-- ============================================
-- BACKFILL: Update profiles.roles from approved applications
-- ============================================

-- This script syncs approved applications to profiles.roles array
-- Run this once to fix existing users who were approved but don't have their role in profiles

DO $$
DECLARE
  app RECORD;
BEGIN
  -- Loop through all approved applications
  FOR app IN 
    SELECT DISTINCT user_id, role_applied 
    FROM applications 
    WHERE status = 'approved'
  LOOP
    -- Update the profile to add the role if not already present
    UPDATE profiles
    SET 
      roles = COALESCE(
        (SELECT array_agg(DISTINCT elem) 
         FROM unnest(array_cat(COALESCE(roles, ARRAY[]::text[]), ARRAY[app.role_applied])) AS elem
        ), 
        ARRAY[app.role_applied]
      ),
      status = 'approved',
      updated_at = NOW()
    WHERE id = app.user_id
    AND NOT (COALESCE(roles, ARRAY[]::text[]) && ARRAY[app.role_applied]);
  END LOOP;
END $$;

-- Verify the update
SELECT id, full_name, roles, status FROM profiles WHERE roles != ARRAY[]::text[];