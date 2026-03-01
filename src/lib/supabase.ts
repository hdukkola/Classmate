import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey } from '../config/supabase';

// Create a singleton Supabase client for auth
export const supabase = createClient(supabaseUrl, publicAnonKey);
