import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== '' &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('dummy_anon_key')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
