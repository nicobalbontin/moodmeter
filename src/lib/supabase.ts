import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client for use in Client Components
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Legacy export for compatibility
export const createSupabaseClient = () => supabase;

