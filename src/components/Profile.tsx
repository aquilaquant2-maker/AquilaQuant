import React from 'react';
import { 
  Camera, 
  ShieldCheck, 
  Calendar, 
  Edit3
} from 'lucide-react';

export const Profile = () => {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-8 max-w-[1400px] mx-auto w-full">
      {/* Header / Banner Section */}
      <div className="relative group mb-8">
        <div className="h-48 rounded-3xl overflow-hidden relative border border-white/5 bg-white/[0.02]">
          <div className="absolute inset-0 bg-linear-to-r from-trading-green/10 to-transparent z-10" />
          <img 
            src="https://picsum.photos/seed/trading-banner/1920/400" 
            alt="Banner" 
            className="w-full h-full object-cover opacity-40 grayscale"
            referrerPolicy="no-referrer"
          />
          <button className="absolute bottom-4 right-4 z-20 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white/60 hover:text-white transition-all">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Avatar Overlay */}
        <div className="absolute -bottom-16 left-8 flex items-end gap-6 z-30">
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-3xl border-4 border-[#050507] overflow-hidden bg-[#08080a] shadow-2xl">
              <img 
                src="https://picsum.photos/seed/raven/200" 
                alt="Raven Welch" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-3xl">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="mb-2 pb-1 flex flex-col md:flex-row md:items-end justify-between w-full pr-8">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Raven Welch</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">@raven_quant • Pro Trader</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        <div className="lg:col-span-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bio Section */}
            <div className="glass-card rounded-3xl p-8 border border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Descrição do Perfil</h3>
                <button className="p-1 hover:text-trading-green transition-colors text-zinc-600">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-lg font-medium text-zinc-300 leading-relaxed italic border-l-4 border-trading-green/30 pl-6 py-2">
                "Especialista em análise quantitativa e mini-contratos. Buscando a consistência através da disciplina matemática."
              </p>
              
              <div className="mt-8 flex items-center gap-6">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Membro desde</span>
                  <span className="text-sm font-black text-white">Outubro de 2023</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-1">Especialidade</span>
                  <span className="text-sm font-black text-trading-green">Mini Contratos</span>
                </div>
              </div>
            </div>

            {/* Plan Info */}
            <div className="glass-card rounded-3xl p-8 border border-white/5 bg-linear-to-br from-trading-green/5 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-trading-green/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-trading-green/20 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-trading-green/20 flex items-center justify-center border border-trading-green/30 shadow-[0_0_20px_rgba(0,255,157,0.15)]">
                    <ShieldCheck className="w-7 h-7 text-trading-green" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tighter text-white">Plano AQUILA PRO</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Acesso Vitalício em andamento</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-400">
                    <span>Dias Restantes</span>
                    <span className="text-trading-green">24 Dias</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[80%] bg-trading-green shadow-[0_0_10px_rgba(0,255,157,0.5)]" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all">
                    Gerenciar Assinatura
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
