import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isInitializing: boolean;
  isAdmin: boolean;
  accessTags: string[];
  hasAccess: (requiredTag: string) => boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<Omit<AuthState, 'hasAccess'>>({
    user: null,
    session: null,
    loading: true,
    isInitializing: true,
    isAdmin: false,
    accessTags: [],
  });

  const hasAccess = (requiredTag: string) => {
    // LEI DO FUNDADOR: Acesso total irrestrito para o CEO
    if (authState.isAdmin) return true;
    if (authState.user?.email?.toLowerCase() === 'aquilaquant2@gmail.com') return true;
    
    if (!authState.accessTags || authState.accessTags.length === 0) return false;

    // Normalização agressiva: lowercase + remove espaços
    const normalizedTags = authState.accessTags.map(t => t.toLowerCase().replace(/\s+/g, ''));
    const normalizedRequired = requiredTag.toLowerCase().replace(/\s+/g, '');

    const hasAllAccess = normalizedTags.includes('all_access') || 
                        normalizedTags.includes('allaccess') || 
                        normalizedTags.includes('elite_all_access') ||
                        normalizedTags.includes('eliteallaccess');

    if (hasAllAccess) return true;
    
    return normalizedTags.includes(normalizedRequired);
  };

  useEffect(() => {
    let isMounted = true;

    // Função para tratar sessões de forma centralizada
    const handleSession = async (session: Session | null) => {
      if (!session) {
        if (isMounted) {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isInitializing: false,
            isAdmin: false,
            accessTags: []
          });
        }
        return;
      }

      const isFounder = session.user.email?.toLowerCase() === 'aquilaquant2@gmail.com';
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, access_tags')
          .eq('id', session.user.id)
          .maybeSingle();

        if (isMounted) {
          setAuthState({
            user: session.user,
            session: session,
            isAdmin: isFounder || profile?.role === 'admin',
            accessTags: profile?.access_tags || [],
            loading: false,
            isInitializing: false
          });
        }
      } catch (error) {
        console.error('AQUILA QUANT [Auth]: Error fetching profile:', error);
        if (isMounted) {
          setAuthState({ 
            user: session.user, 
            session: session,
            isAdmin: isFounder,
            accessTags: [],
            loading: false, 
            isInitializing: false 
          });
        }
      }
    };

    // 1. Busca a sessão inicial IMEDIATAMENTE
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        handleSession(session);
      }
    });

    // 2. Listener para mudanças futuras
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        handleSession(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
