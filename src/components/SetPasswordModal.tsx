import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { cn } from '../lib/utils';

interface SetPasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export const SetPasswordModal = ({ isOpen, onSuccess }: SetPasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações Básicas
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusMessage('Sincronizando...');

    const safetyTimeout = setTimeout(() => {
      setIsLoading(false);
      setError('A resposta do servidor está demorando mais que o esperado. Por favor, tente recarregar a página e usar o link do e-mail novamente.');
    }, 30000);

    try {
      // 1. Garantir Sessão Fresh
      console.log('🔄 Sincronizando acesso...');
      setStatusMessage('Validando acesso...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        // Fallback: Tenta pegar do hash se o SDK ainda não processou
        console.warn('⚠️ Sessão não encontrada pelo SDK, tentando via Hash...');
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
           const params = new URLSearchParams(hash.replace('#', ''));
           const access = params.get('access_token');
           const refresh = params.get('refresh_token');
           if (access && refresh) {
             const { error: setErr } = await supabase.auth.setSession({ access_token: access!, refresh_token: refresh! });
             if (setErr) console.warn('SetSession error:', setErr);
           }
        } else {
          throw new Error('Não foi possível encontrar sua sessão de ativação. Por favor, reabra o link do e-mail.');
        }
      }

      // 2. Listener de Emergência (Detecta o sucesso via evento se a promessa travar)
      let resolved = false;
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'USER_UPDATED' && !resolved) {
          console.log('✅ Sucesso detectado via Auth Event!');
          handleSuccess();
        }
      });

      const handleSuccess = () => {
        if (resolved) return;
        resolved = true;
        if (subscription) subscription.unsubscribe();
        clearTimeout(safetyTimeout);
        
        setStatusMessage('Sucesso!');
        setIsSuccess(true);
        console.log('🎉 Finalizando flow de senha...');
        
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch (e) {
          window.location.hash = '';
        }

        setTimeout(() => {
          onSuccess();
        }, 1000);
      };

      // 3. Atualização Atômica de Senha
      console.log('📡 Salvando nova senha...');
      setStatusMessage('Protegendo conta...');
      
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (updateError) {
        // Se já resolveu via listener, não joga erro
        if (resolved) return;
        
        if (updateError.message?.includes('New password should be different')) {
          handleSuccess();
          return;
        }
        throw updateError;
      }

      handleSuccess();
    } catch (err: any) {
      clearTimeout(safetyTimeout);
      console.error('🔴 ERRO FATAL NO MODAL:', err);
      setError(err.message || 'Erro inesperado. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay - Não fecha ao clicar para forçar a ação */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md" 
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-card rounded-[2.5rem] border border-white/10 bg-[#0a0a0c] p-8 md:p-10 shadow-2xl"
          >
            {isSuccess ? (
              <div className="flex flex-col items-center text-center py-12">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-trading-green rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,157,0.3)]"
                >
                  <ShieldCheck className="w-10 h-10 text-black" />
                </motion.div>
                <h2 className="text-2xl font-black text-white tracking-tight mb-2">Acesso Confirmado!</h2>
                <p className="text-zinc-500 text-sm font-medium">Sua conta foi ativada com sucesso. Redirecionando...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-trading-green/10 rounded-2xl flex items-center justify-center mb-6 border border-trading-green/20">
                <ShieldCheck className="w-8 h-8 text-trading-green" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">Bem-vindo ao Aquila Quant</h2>
              <p className="text-zinc-500 text-sm font-medium">Defina sua senha de acesso exclusivo para começar a operar.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Nova Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-trading-green transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-trading-green/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Confirmar Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-trading-green transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-trading-green/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full bg-trading-green text-black font-black uppercase text-[11px] tracking-widest py-4 rounded-2xl shadow-lg shadow-trading-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4",
                  isLoading && "opacity-80 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>{statusMessage}</span>
                  </>
                ) : (
                  <>
                    Definir Senha e Acessar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
            </>
            )}

            <p className="text-[8px] text-zinc-600 font-bold text-center mt-8 uppercase tracking-widest">
              Segurança Criptografada de Ponta a Ponta
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
