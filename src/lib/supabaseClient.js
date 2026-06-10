
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Validate that we have the required values
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ set' : '✗ missing');
  console.error('VITE_SUPABASE_PUBLISHABLE_KEY:', supabaseKey ? '✓ set' : '✗ missing');
}

// Create and export the Supabase client (will fail gracefully if env vars are missing)
export const supabase = createClient(supabaseUrl, supabaseKey);
