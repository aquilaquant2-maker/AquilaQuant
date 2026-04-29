import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface ClientProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
  access_tags: string[];
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_active?: boolean;
}

export function useAdminClients() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('AQUILA QUANT [Admin Hook]: Erro ao buscar clientes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();

    // Supabase Realtime: Inscrição em Tempo Real (Postgres Changes)
    const channel = supabase
      .channel('admin-clients-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('AQUILA QUANT [Admin Realtime]: Alteração detectada:', payload);
          
          if (payload.eventType === 'INSERT') {
            setClients(prev => [{ ...payload.new } as ClientProfile, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setClients(prev => prev.map(client => 
              client.id === payload.new.id ? { ...client, ...payload.new } as ClientProfile : client
            ));
          } else if (payload.eventType === 'DELETE') {
            setClients(prev => prev.filter(client => client.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    // Lei da Idempotência e Estado Otimista
    const prevClients = [...clients];
    const newStatus = !currentStatus;
    
    setClients(prev => prev.map(c => c.id === userId ? { ...c, is_active: newStatus } : c));

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (err) {
      console.error('AQUILA QUANT [Admin Hook]: Erro ao alternar status:', err);
      setClients(prevClients); // Rollback em caso de falha
      throw err;
    }
  };

  const updateClientTags = async (userId: string, tags: string[]) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          access_tags: tags, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (err: any) {
      console.error('AQUILA QUANT [Admin Hook]: Erro ao atualizar tags:', err.message);
      throw err;
    }
  };

  return {
    clients,
    isLoading,
    toggleUserStatus,
    updateClientTags,
    refreshClients: fetchClients
  };
}
