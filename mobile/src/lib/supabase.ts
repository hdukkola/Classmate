import { createClient } from "@supabase/supabase-js";
import { publicAnonKey, supabaseUrl } from "@/config/supabase";

export const supabase = createClient(supabaseUrl, publicAnonKey);
