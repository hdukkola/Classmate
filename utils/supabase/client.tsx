import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

// Create a singleton Supabase client for auth
export const supabase = createClient(supabaseUrl, publicAnonKey);
