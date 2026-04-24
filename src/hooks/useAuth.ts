import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    // 1. Initial Session Check
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      let isAdmin = false;
      if (session?.user) {
        // Fetch profile to check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        isAdmin = profile?.role === 'admin';
      }

      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        isAdmin,
      });
    };

    init();

    // 2. Subscription to Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      let isAdmin = false;
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        isAdmin = profile?.role === 'admin';
      }

      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        isAdmin,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};
