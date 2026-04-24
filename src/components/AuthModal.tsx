import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';
import { authService, loginSchema, registerSchema, LoginInput, RegisterInput } from '../lib/authService';
import { ZodError } from 'zod';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const validated = loginSchema.parse({ email: formData.email, password: formData.password });
        await authService.signIn(validated);
      } else {
        const validated = registerSchema.parse(formData);
        await authService.signUp(validated);
        setError('Conta criada! Verifique seu email para confirmar.');
        return;
      }
      onClose();
    } catch (err: any) {
      if (err instanceof ZodError) {
        setError(err.issues[0].message);
      } else {
        setError(err.message || 'Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md glass-card rounded-[2.5rem] border border-white/10 p-8 md:p-12 overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative Background Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-trading-green/20 blur-[50px] -z-10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-trading-green/10 blur-[50px] -z-10 rounded-full" />

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="text-zinc-500 text-sm font-medium">
              {mode === 'login' ? 'Acesse o terminal operacional' : 'Comece sua jornada quantitativa'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-trading-green/50 focus:outline-none transition-all placeholder:text-zinc-700"
                    placeholder="João Silva"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-trading-green/50 focus:outline-none transition-all placeholder:text-zinc-700"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-trading-green/50 focus:outline-none transition-all placeholder:text-zinc-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-trading-green text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-trading-green/20 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Entrar' : 'Registrar'} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="ml-2 text-trading-green hover:underline"
              >
                {mode === 'login' ? 'Crie agora' : 'Faça login'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
