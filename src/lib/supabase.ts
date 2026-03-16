import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rrpxcuzaovyqfvwjaqwe.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wbSVOdfAIgaMM7VcbfLu1Q_CEe03dfi';

export const supabase = createClient(supabaseUrl, supabaseKey);
