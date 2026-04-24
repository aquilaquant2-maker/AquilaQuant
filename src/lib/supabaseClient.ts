import { createClient } from '@supabase/supabase-js';

const supabaseUrlRaw = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Sanitização: Remove /rest/v1/ ou barras extras no final se o usuário colou o link errado
const supabaseUrl = supabaseUrlRaw?.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

/**
 * Singleton Supabase Client
 */
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing. Connection will not be established until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Helper para verificar se a conexão está ativa (Pillat 7 da segurança: Atomicity Check)
 */
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('[Supabase Connection Error]:', err);
    return false;
  }
};
