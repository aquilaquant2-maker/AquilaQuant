import { createClient } from '@supabase/supabase-js';

const supabaseUrlRaw = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrlRaw || !supabaseAnonKey) {
  console.error('AQUILA QUANT [Config Error]: Variáveis de ambiente do Supabase não encontradas. Verifique os Secrets.');
} else {
  console.log('AQUILA QUANT [System]: Supabase URL detectada:', supabaseUrlRaw.substring(0, 15) + '...');
}

// Sanitização robusta: Remove /rest/v1 e barras finais de qualquer lugar do final da string
const supabaseUrl = supabaseUrlRaw
  ?.trim()
  ?.replace(/\/rest\/v1\/?$/, '') 
  ?.replace(/\/$/, '');

// Simplificação total para Auth Manual
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true, // Ainda mantemos true para que o SDK gerencie o estado na sessão ATUAL
      storage: window.sessionStorage, // Troca localStorage por sessionStorage (Limpa ao fechar aba/navegador)
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: { 'x-application-name': 'aquila-quant-elite' }
    }
  }
);

export const checkSupabaseConnection = async () => {
  try {
    // Tenta uma operação ultra leve e rápida
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true }).limit(1);
    
    if (error) {
      // Se for erro de auth/RLS, o cliente está se comunicando
      if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
        return true;
      }
      throw error;
    }
    return true;
  } catch (err) {
    console.error('[Supabase Connection Error]:', err);
    return false;
  }
};
