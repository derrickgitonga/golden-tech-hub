
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase credentials. Please check your .env file.");
}

// Ensure we have valid strings for the client, even if they are empty (which will cause auth errors but prevent crash)
const validSupabaseUrl = supabaseUrl || 'https://placeholder.supabase.co';
const validSupabaseKey = supabaseKey || 'placeholder';

export const supabase = createClient(validSupabaseUrl, validSupabaseKey);
