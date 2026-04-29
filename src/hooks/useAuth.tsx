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

    // Direct listener for auth changes - standard practice
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

      if (session?.user) {
        const isFounder = session.user.email?.toLowerCase() === 'aquilaquant2@gmail.com';
        
        try {
          // Fetch profile data
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
            setAuthState(prev => ({ 
              ...prev, 
              user: session.user, 
              session: session,
              isAdmin: isFounder,
              loading: false, 
              isInitializing: false 
            }));
          }
        }
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
