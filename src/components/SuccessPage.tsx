import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, ArrowRight, Loader2 } from 'lucide-react';

interface SuccessPageProps {
  onReturn: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onReturn }) => {
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReturn();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReturn]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#050507] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-trading-green/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8 relative z-10"
      >
        <div className="flex justify-center">
          <div className="relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="w-24 h-24 bg-trading-green/20 rounded-full flex items-center justify-center border border-trading-green/30"
            >
              <CheckCircle2 className="w-12 h-12 text-trading-green" />
            </motion.div>
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-trading-green/20 blur-xl"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
            Bem-vindo à Elite
          </h1>
          <p className="text-zinc-400 font-medium leading-relaxed">
            Sua assinatura foi confirmada com sucesso. Você acaba de dar o passo definitivo para sua profissionalização no mercado.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-start gap-4 text-left"
        >
          <div className="p-3 bg-trading-green/10 rounded-xl">
            <Mail className="w-6 h-6 text-trading-green" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Verifique seu E-mail</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Enviamos um convite oficial. Clique no link para **definir sua senha** e liberar seu acesso imediato ao dashboard.
            </p>
          </div>
        </motion.div>

        <div className="pt-8 space-y-4">
          <div className="flex items-center justify-center gap-3 text-zinc-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Redirecionando em {countdown}s
            </span>
          </div>
          
          <button 
            onClick={onReturn}
            className="group flex items-center gap-2 mx-auto text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            Voltar agora
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Binary Rain Effect Placeholder or Subtle Lines */}
        <div className="flex justify-center gap-1 opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ height: [10, 20, 10] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 bg-trading-green rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
