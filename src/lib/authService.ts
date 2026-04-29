import { z } from 'zod';
import { supabase } from './supabaseClient';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const authService = {
  async signIn({ email, password }: LoginInput, _remember: boolean = false) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  },

  async signUp({ email, password, fullName }: RegisterInput, remember: boolean = true) {
    console.log('AQUILA QUANT [Auth Service]: Attempting signUp for:', email);
    
    if (!remember) {
      localStorage.setItem('aquila_session_only', 'true');
    } else {
      localStorage.removeItem('aquila_session_only');
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('AQUILA QUANT [Auth Service]: signUp error:', error);
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('AQUILA QUANT [Auth Service]: signUp exception:', err);
      throw err;
    }
  },

  async signOut() {
    try {
      console.log('AQUILA QUANT [Auth Service]: Terminating session...');
      const { error } = await supabase.auth.signOut();
      
      // Cleanup de segurança total
      localStorage.removeItem('aquila_session_only');
      
      if (error) throw error;
    } catch (err) {
      console.error('AQUILA QUANT [Auth Service]: signOut error:', err);
      // Forçamos limpeza local mesmo se a API falhar
      localStorage.clear();
      sessionStorage.clear();
      throw err;
    }
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
};
