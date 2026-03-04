import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtnpdeuazexrpjolkzjo.supabase.co';
const supabaseKey = 'sb_publishable_uVMeemxMGy5jwrxIewnWbw_rf21IsxZ';

export const supabase = createClient(supabaseUrl, supabaseKey);
