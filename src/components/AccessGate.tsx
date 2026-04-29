import React from 'react';
import { motion } from 'motion/react';
import { Lock, Crown, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AccessGateProps {
  children: React.ReactNode;
  requiredTag: 'B3' | 'Forex' | 'Cripto' | 'All_Access';
}

export const AccessGate: React.FC<AccessGateProps> = ({ children, requiredTag }) => {
  const { hasAccess, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050507]">
        <div className="w-12 h-12 border-4 border-trading-green/20 border-t-trading-green rounded-full animate-spin" />
      </div>
    );
  }

  const hasPermission = hasAccess(requiredTag);

  // Debug log for access issues
  React.useEffect(() => {
    if (!loading) {
      console.log(`AQUILA QUANT [AccessGate]: Tag required: ${requiredTag} | Has Permission: ${hasPermission}`);
    }
  }, [requiredTag, hasPermission, loading]);

  if (!hasPermission) {
    return (
      <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden bg-[#050507]">
        {/* Background Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-trading-green/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md glass-card p-8 border border-white/5 rounded-3xl text-center"
        >
          <div className="w-20 h-20 bg-trading-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-trading-green/20">
            <Lock className="w-10 h-10 text-trading-green" />
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
            Módulo Bloqueado
          </h2>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-6 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
            <Crown className="w-3 h-3 text-yellow-500" />
            Requer Acesso: {requiredTag}
          </div>

          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
            Este mercado é exclusivo para membros do plano <span className="text-white font-bold">{requiredTag}</span> ou <span className="text-white font-bold italic">Elite All Access</span>. Atualize sua assinatura para liberar os sinais em tempo real.
          </p>

          <div className="space-y-3">
            <button className="w-full h-14 bg-trading-green text-black font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(0,186,114,0.4)] transition-all flex items-center justify-center gap-2 group">
              Fazer Upgrade Agora
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="w-full h-12 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl border border-white/5 transition-all">
              Ver Planos Disponíveis
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Pagamento Seguro
            </div>
            <div className="w-1 h-1 bg-zinc-800 rounded-full" />
            <div>Garantia 7 Dias</div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
