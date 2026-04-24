import React from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Star, 
  Crown,
  FileText,
  User,
  ExternalLink,
  MessageCircle,
  Clock,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

// --- RESULTS GALLERY ---
export const ResultsGallery = () => {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Galeria de Resultados</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Resultados comprovados de nossos membros</p>
        </div>
        <button className="px-6 py-2.5 bg-trading-green text-black rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-trading-green/10 hover:scale-[1.02] transition-transform">
           Postar meu resultado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="glass-card rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden group hover:border-trading-green/20 transition-all">
            <div className="aspect-[4/5] relative overflow-hidden bg-[#08080a]">
              <img 
                src={`https://picsum.photos/seed/result-${i}/600/800`} 
                alt="Resultado" 
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/40 to-transparent p-6 flex items-end justify-between">
                <div>
                   <p className="text-[10px] font-black text-trading-green uppercase tracking-widest mb-1">Profit Final</p>
                   <h3 className="text-2xl font-black text-white leading-none">R$ {Math.floor(Math.random() * 5000 + 1000)},00</h3>
                </div>
                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                   <span className="text-[9px] font-black text-white uppercase tracking-tight">Set-2023</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <img src={`https://picsum.photos/seed/user-${i}/64`} className="w-8 h-8 rounded-lg" referrerPolicy="no-referrer" />
                <div>
                  <p className="text-xs font-black text-white">Membro #{i}482</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase">Meta Batida no Dólar</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- LEADERBOARD ---
export const Leaderboard = () => {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-8 max-w-[1400px] mx-auto w-full">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Placar de Líderes</h2>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">Competição de Performance Quantitativa</p>
        
        <div className="flex items-center justify-center gap-4 mt-10">
           {['Dia', 'Semana', 'Mês', 'All Time'].map(tab => (
             <button key={tab} className={cn(
               "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
               tab === 'Mês' ? "bg-trading-green border-trading-green text-black" : "bg-white/5 border-white/5 text-zinc-500 hover:text-white"
             )}>
              {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-[900px] mx-auto mb-16 px-4">
        {/* 2nd Place */}
        <div className="order-2 md:order-1 flex flex-col items-center gap-4">
           <div className="relative">
              <div className="w-24 h-24 rounded-3xl border-2 border-zinc-500/50 p-1">
                <img src="https://picsum.photos/seed/user-2/200" className="w-full h-full object-cover rounded-2xl grayscale" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-[#050507]">2</div>
           </div>
           <div className="text-center">
             <h4 className="font-black text-white text-lg">Alexandre R.</h4>
             <p className="text-[10px] font-black text-zinc-500 uppercase">+R$ 14.2k</p>
           </div>
           <div className="w-full h-32 bg-linear-to-t from-white/10 to-transparent rounded-t-3xl border-t border-white/5" />
        </div>

        {/* 1st Place */}
        <div className="order-1 md:order-2 flex flex-col items-center gap-4 -translate-y-8">
           <div className="relative">
              <div className="w-32 h-32 rounded-3xl border-4 border-trading-green p-1 group">
                <img src="https://picsum.photos/seed/raven/200" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-trading-green animate-bounce">
                  <Crown className="w-8 h-8 fill-current" />
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-trading-green text-black w-10 h-10 rounded-full flex items-center justify-center font-black border-4 border-[#050507] text-xl">1</div>
           </div>
           <div className="text-center">
             <h4 className="font-black text-white text-xl uppercase tracking-tighter">Raven Welch</h4>
             <p className="text-xs font-black text-trading-green uppercase">+R$ 28.5k</p>
           </div>
           <div className="w-full h-48 bg-linear-to-t from-trading-green/20 via-trading-green/5 to-transparent rounded-t-3xl border-t border-trading-green/20 relative overflow-hidden">
             <div className="absolute inset-0 bg-linear-to-tr from-trading-green/10 to-transparent animate-pulse" />
           </div>
        </div>

        {/* 3rd Place */}
        <div className="order-3 md:order-3 flex flex-col items-center gap-4">
           <div className="relative">
              <div className="w-24 h-24 rounded-3xl border-2 border-trading-red/50 p-1">
                <img src="https://picsum.photos/seed/user-3/200" className="w-full h-full object-cover rounded-2xl grayscale" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-trading-red text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-4 border-[#050507]">3</div>
           </div>
           <div className="text-center">
             <h4 className="font-black text-white text-lg">Carla Mendes</h4>
             <p className="text-[10px] font-black text-zinc-500 uppercase">+R$ 9.8k</p>
           </div>
           <div className="w-full h-24 bg-linear-to-t from-white/10 to-transparent rounded-t-3xl border-t border-white/5" />
        </div>
      </div>

      {/* List */}
      <div className="max-w-[800px] mx-auto space-y-3">
        {[4, 5, 6, 7, 8].map((pos) => (
          <div key={pos} className="glass-card rounded-2xl p-4 border border-white/5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
             <div className="flex items-center gap-6">
                <span className="w-6 text-sm font-black text-zinc-600">#{pos}</span>
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                  <img src={`https://picsum.photos/seed/user-${pos}/64`} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                </div>
                <div>
                   <h5 className="text-sm font-black text-white">Usuário #{pos}827</h5>
                   <p className="text-[9px] font-bold text-zinc-500 uppercase">Dólar Futuro</p>
                </div>
             </div>
             <div className="flex items-center gap-8 text-right">
                <div>
                   <p className="text-[9px] font-black text-zinc-500 uppercase">Trades</p>
                   <p className="text-sm font-black text-white">42</p>
                </div>
                <div>
                   <p className="text-[9px] font-black text-zinc-500 uppercase">Win Rate</p>
                   <p className="text-sm font-black text-trading-green">84.5%</p>
                </div>
                <div className="w-24">
                   <p className="text-[10px] font-black text-white">+ R$ 5.2k</p>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- ARTICLES & STUDIES ---
export const ArticlesStudy = () => {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Artigos & Estudos</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Conhecimento compartilhado pela comunidade</p>
        </div>
        <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest text-white hover:bg-white/10 transition-all">
           Nova Publicação
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-[2rem] border border-white/5 overflow-hidden group">
              <div className="h-64 overflow-hidden relative">
                <img 
                   src={`https://picsum.photos/seed/study-${i}/1200/600`} 
                   className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                   referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-black to-transparent">
                  <div className="flex items-center gap-3 mb-3">
                     <span className="px-3 py-1 bg-trading-green text-black text-[9px] font-black uppercase tracking-tighter rounded-md">
                       Estratégia Quant
                     </span>
                     <span className="flex items-center gap-1.5 text-[10px] font-black text-white/60">
                       <Clock className="w-3 h-3" /> 15 min de leitura
                     </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Dominando o Price Action em períodos de baixa volatilidade</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-zinc-400 font-medium leading-relaxed mb-6">
                  Neste artigo, exploramos como identificar padrões de acumulação institucional mesmo quando o mercado parece parado. Discutimos ferramentas como Volume Profile e VWAP para filtrar sinais falsos...
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <div className="flex items-center gap-3">
                      <img src={`https://picsum.photos/seed/user-${i}/64`} className="w-10 h-10 rounded-xl" referrerPolicy="no-referrer" />
                      <div>
                         <p className="text-sm font-black text-white">Mentor #{i}2</p>
                         <p className="text-[10px] text-zinc-500 font-black uppercase">Especialista em B3</p>
                      </div>
                   </div>
                   <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-trading-green hover:underline">
                      Abrir Estudo <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Articles */}
        <div className="lg:col-span-4 space-y-8">
          {/* Consulting Card */}
          <div className="glass-card rounded-[2rem] p-8 border border-white/5 bg-linear-to-br from-trading-green/20 to-transparent relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Consultoria VIP</h3>
               <p className="text-xs text-zinc-400 font-medium mb-6">Acelere seu aprendizado com mentorias individuais 1-on-1 com traders de elite.</p>
               <button className="w-full py-4 bg-trading-green text-black rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-trading-green/10">
                  Ver Disponibilidade
               </button>
             </div>
             <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-trading-green/10 blur-[40px] rounded-full" />
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-2">Assuntos em Alta</h4>
            {[
              { tag: 'Swing Trade', posts: 12 },
              { tag: 'Mindset', posts: 42 },
              { tag: 'Scalping', posts: 89 },
              { tag: 'Mini Índice', posts: 156 }
            ].map(topic => (
              <button key={topic.tag} className="w-full flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-colors group">
                <span className="text-xs font-black text-white group-hover:text-trading-green">{topic.tag}</span>
                <span className="text-[10px] font-bold text-zinc-500">{topic.posts} posts</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
