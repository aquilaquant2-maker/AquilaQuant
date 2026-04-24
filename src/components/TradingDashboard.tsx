import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Clock,
  RefreshCw,
  Edit3,
  FileUp,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';
import { XAUUSDWidgets } from './XAUUSDWidgets';

interface TradingDashboardProps {
  assetName: string;
  assetCode: string;
  category: 'B3' | 'FOREX';
}

const mockChartData = [
  { name: '1', a: 40, b: 20 },
  { name: '2', a: 60, b: 10 },
  { name: '3', a: 80, b: -30 },
  { name: '4', a: 65, b: -10 },
  { name: '5', a: 70, b: -5 },
  { name: '6', a: 90, b: 0 },
  { name: '7', a: 85, b: 15 },
  { name: '8', a: 80, b: 40 },
  { name: '9', a: 75, b: 25 },
  { name: '10', a: 70, b: 0 },
  { name: '11', a: 95, b: 20 },
  { name: '12', a: 80, b: -40 },
  { name: '13', a: 110, b: -60 },
  { name: '14', a: 120, b: -80 },
  { name: '15', a: 110, b: -40 },
  { name: '16', a: 130, b: 0 },
  { name: '17', a: 150, b: 20 },
  { name: '18', a: 180, b: -50 },
  { name: '19', a: 220, b: -10 },
  { name: '20', a: 280, b: 30 },
];

const pointsData = [
  { name: '1', value: 318, model: 'A' },
  { name: '2', value: -37, model: 'B' },
];

const assertivenessData = [
  { name: 'A', value: 50 },
  { name: 'B', value: 25 },
];

const rMultiplesData = [
  { name: '1', value: 9.36, model: 'A' },
  { name: '2', value: -7.23, model: 'B' },
];

export const TradingDashboard = ({ assetName, assetCode, category }: TradingDashboardProps) => {
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [opening, setOpening] = useState('');
  const [showError, setShowError] = useState(false);

  // Reset state when asset changes
  React.useEffect(() => {
    setStep('input');
    setOpening('');
  }, [assetCode]);

  const [performanceUnlocked, setPerformanceUnlocked] = useState(false);
  const [randomModel] = useState(Math.random() > 0.5 ? 'A' : 'B');

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const selectedDate = new Date(date);
    
    if (selectedDate > today) {
      setShowError(true);
      return;
    }
    
    setShowError(false);
    setStep('results');
  };

  if (step === 'input') {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-transparent">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full max-w-xl rounded-[2.5rem] p-10 border border-white/5 bg-white/[0.01] relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-trading-green/5 blur-[100px] -z-10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-trading-red/5 blur-[100px] -z-10 rounded-full" />

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
               <Activity className="w-8 h-8 text-trading-green" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Configurar {assetName}</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2">Relatório Quantitativo v.10</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Data para Cálculo</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-trading-green/30 transition-all uppercase"
                />
              </div>
              {showError && (
                <div className="flex items-center gap-2 mt-2 px-1 text-trading-red">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-tight">Data futura não permitida! Selecione hoje ou dias passados.</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Valor de Abertura</label>
                <div className="group relative">
                  <AlertCircle className="w-3.5 h-3.5 text-zinc-500 cursor-help" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                    <p className="text-[9px] font-bold text-zinc-400 leading-relaxed uppercase">
                      Inserir manualmente o valor de abertura garante maior precisão no cálculo das regiões do dia, evitando distorções de feed.
                    </p>
                  </div>
                </div>
              </div>
              <input 
                type="text" 
                value={opening}
                onChange={(e) => setOpening(e.target.value)}
                placeholder="Ex: 5.250,50"
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-trading-green/30 transition-all placeholder:text-zinc-700"
                required
              />
              <div className="p-4 bg-trading-green/5 border border-trading-green/10 rounded-xl mt-4">
                 <p className="text-[9px] font-black text-trading-green uppercase leading-relaxed text-center tracking-widest">
                   Confira bem o valor antes de prosseguir. Ele deve ser referente à abertura oficial do ativo na data escolhida.
                 </p>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-trading-green text-black rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-lg shadow-trading-green/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
               Calcular Regiões <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-8 max-w-[1600px] mx-auto w-full space-y-8 animate-in fade-in duration-700">
      
      {/* Box Superior */}
      <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-trading-green/10 rounded-3xl flex items-center justify-center border border-trading-green/20 relative">
               <Zap className="w-8 h-8 text-trading-green fill-trading-green/20" />
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-trading-green rounded-full shadow-[0_0_10px_rgba(0,255,157,1)]" />
            </div>
            <div>
               <div className="flex items-center gap-3">
                 <h2 className="text-3xl font-black uppercase tracking-tighter text-white">{assetName}</h2>
                 <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black text-zinc-400">{assetCode}</span>
               </div>
               <div className="flex items-center gap-2 mt-1">
                 <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                 <span className="text-xs font-bold text-zinc-500">{new Date(date).toLocaleDateString()}</span>
                 <span className="text-zinc-700 mx-2">•</span>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Abertura: <span className="text-white">{opening}</span></p>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <button 
              onClick={() => setStep('input')}
              className="px-5 py-2.5 glass-button rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10"
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar Dados
            </button>
            <button className="px-5 py-2.5 glass-button rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10">
              <RefreshCw className="w-3.5 h-3.5" /> Atualizar
            </button>
         </div>
      </div>

      {/* Box Central - Regiões Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Card: Desvio Padrão */}
        <div className="lg:col-span-8 glass-card rounded-[2.5rem] p-8 border border-white/5 bg-white/[0.01]">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Desvio Padrão (Regions)</h3>
              </div>
              {category === 'B3' && (
                <div className="flex items-center gap-8">
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-zinc-500 uppercase">Gain</span>
                      <span className="text-lg font-black text-trading-green leading-none">30,5</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-zinc-500 uppercase">Loss</span>
                      <span className="text-lg font-black text-trading-red leading-none">6,0</span>
                   </div>
                </div>
              )}
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: '0.8 Desvio', val: '5250,5', sub: '5265,75' },
                { label: '0.8 Desvio', val: '5281', sub: '5296,25' },
                { label: '0.8 Desvio 0.5', val: '5311,5', sub: '5326,75' },
                { label: '0.8 Desvio 0.5', val: '5342', sub: '5357,25' },
                { label: 'Sup Inverso', val: '5189,5', sub: '5174,25' },
                { label: 'Sup Inverso', val: '5159', sub: '5143,75' },
                { label: 'Sup Inverso -0.5', val: '5128,5', sub: '5113,25' },
                { label: 'Sup Inverso -0.5', val: '5098', sub: '5082,75' },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 text-center group hover:border-trading-green/20 transition-all">
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-2 tracking-tighter">{item.label}</p>
                  <p className="text-xl font-black text-white">{item.val}</p>
                  <p className="text-[10px] font-bold text-zinc-500 mt-1">{item.sub}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Right Column: Max/Min & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           {/* Máxima & Mínima */}
           <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Máxima & Mínima</h3>
              </div>
              <div className="grid grid-cols-2 gap-8 px-2">
                 <div className="flex items-center gap-4">
                    <TrendingUp className="w-10 h-10 text-trading-green opacity-20" />
                    <div className="space-y-1">
                       <p className="text-xl font-black text-white">5250</p>
                       <p className="text-[10px] font-bold text-zinc-500">5265,25</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <TrendingDown className="w-10 h-10 text-trading-red opacity-20" />
                    <div className="space-y-1">
                       <p className="text-xl font-black text-white">5190</p>
                       <p className="text-[10px] font-bold text-zinc-500">5174,75</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Frequência Estatística (B3) ou Gain/Loss (Forex) */}
           {category === 'B3' ? (
             <div className="flex-1 glass-card rounded-[2.5rem] p-8 border border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Frequência Estatística</h3>
                </div>
                <div className="flex items-center justify-around">
                   <div className="text-center">
                      <p className="text-2xl font-black text-white">5195,5</p>
                      <p className="text-[9px] font-black text-zinc-600 uppercase mt-1">Frequência A</p>
                   </div>
                   <div className="w-px h-12 bg-white/5" />
                   <div className="text-center">
                      <p className="text-2xl font-black text-white">5182,5</p>
                      <p className="text-[9px] font-black text-zinc-600 uppercase mt-1">Frequência B</p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex-1 glass-card rounded-[2.5rem] p-8 border border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Gain & Loss Máximo</h3>
                </div>
                <div className="flex items-center justify-around">
                   <div className="text-center">
                      <p className="text-3xl font-black text-trading-green">30,5</p>
                      <p className="text-[9px] font-black text-zinc-600 uppercase mt-1">Gain Máximo</p>
                   </div>
                   <div className="w-px h-12 bg-white/5" />
                   <div className="text-center">
                      <p className="text-3xl font-black text-trading-red">6,0</p>
                      <p className="text-[9px] font-black text-zinc-600 uppercase mt-1">Loss Máximo</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Box Inferior - Performance */}
      <div className="relative">
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-8 transition-all duration-700",
          !performanceUnlocked ? "blur-sm opacity-50 grayscale select-none pointer-events-none" : "opacity-100 grayscale-0"
        )}>
           {/* Chart: Model A vs B Line */}
           <div className="lg:col-span-8 glass-card rounded-[2.5rem] p-8 border border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black uppercase tracking-widest text-white">Performance do modelo A x B</h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-1 bg-trading-green rounded-full" />
                       <span className="text-[9px] font-black uppercase text-zinc-500">Modelo A</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-1 bg-blue-500 rounded-full" />
                       <span className="text-[9px] font-black uppercase text-zinc-500">Modelo B</span>
                    </div>
                 </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceUnlocked ? mockChartData : []}>
                    <defs>
                      <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                    <XAxis dataKey="name" fontSize={9} fontWeight="bold" stroke="#ffffff20" axisLine={false} tickLine={false} />
                    <YAxis fontSize={9} fontWeight="bold" stroke="#ffffff20" axisLine={false} tickLine={false} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="a" stroke="#00ff9d" strokeWidth={3} fillOpacity={1} fill="url(#colorA)" />
                    <Area type="monotone" dataKey="b" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorB)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="lg:col-span-4 grid grid-cols-2 gap-6">
              {/* Pontos */}
              <div className="glass-card rounded-[2rem] p-6 border border-white/5 bg-white/[0.01] flex flex-col">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 text-center">Pontos Acumulados</h4>
                 <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pointsData}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                           {pointsData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.model === 'A' ? '#00ff9d' : '#3b82f6'} />
                           ))}
                        </Bar>
                        <XAxis dataKey="model" hide />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex justify-around mt-4">
                    <div className="text-center">
                       <p className="text-xs font-black text-trading-green">318</p>
                       <p className="text-[8px] font-black uppercase text-zinc-600">A</p>
                    </div>
                    <div className="text-center">
                       <p className="text-xs font-black text-trading-red">-37</p>
                       <p className="text-[8px] font-black uppercase text-zinc-600">B</p>
                    </div>
                 </div>
              </div>

              {/* Assertividade */}
              <div className="glass-card rounded-[2rem] p-6 border border-white/5 bg-white/[0.01] flex flex-col">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 text-center">Assertividade</h4>
                 <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assertivenessData}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                           {assertivenessData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.name === 'A' ? '#00ff9d' : '#3b82f6'} />
                           ))}
                        </Bar>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex justify-around mt-4">
                    <span className="text-xs font-black text-trading-green">50%</span>
                    <span className="text-xs font-black text-blue-500">25%</span>
                 </div>
              </div>

              {/* R-Múltiplos */}
              <div className="glass-card rounded-[2rem] p-6 border border-white/5 bg-white/[0.01] flex flex-col">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 text-center">R-Múltiplos</h4>
                 <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rMultiplesData}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                           {rMultiplesData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.model === 'A' ? '#00ff9d' : '#3b82f6'} />
                           ))}
                        </Bar>
                        <XAxis dataKey="model" hide />
                        <YAxis hide />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex justify-around mt-4">
                    <span className="text-xs font-black text-trading-green">9.36</span>
                    <span className="text-xs font-black text-trading-red">-7.23</span>
                 </div>
              </div>

              {/* Day Probability */}
              <div className={cn(
                "glass-card rounded-[2rem] p-6 border flex flex-col items-center justify-center text-center",
                randomModel === 'A' ? "bg-trading-green/10 border-trading-green/20" : "bg-trading-red/10 border-trading-red/20"
              )}>
                 <div className={cn(
                   "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border shadow-lg",
                   randomModel === 'A' ? "bg-trading-green border-trading-green text-black shadow-trading-green/20" : "bg-trading-red border-trading-red text-white shadow-trading-red/20"
                 )}>
                    <Target className="w-6 h-6" />
                 </div>
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Cenário Provável</p>
                 <h5 className={cn("text-2xl font-black uppercase tracking-tighter", randomModel === 'A' ? "text-trading-green" : "text-trading-red")}>
                   MODELO {randomModel}
                 </h5>
              </div>
           </div>
        </div>

        {/* Lock Overlay */}
        {!performanceUnlocked && (
          <div 
            onClick={() => setPerformanceUnlocked(true)}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer group"
          >
             <div className="glass-card p-10 rounded-[3rem] border border-white/10 bg-white/[0.05] backdrop-blur-3xl flex flex-col items-center gap-6 group-hover:scale-105 transition-all duration-500 shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-trading-green/30 transition-colors">
                   <FileUp className="w-8 h-8 text-trading-green" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white">Liberar Performance</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Faça o upload da planilha para calcular os dados ao vivo</p>
                </div>
                <button className="px-8 py-3 bg-trading-green text-black rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-trading-green/20 active:scale-95 transition-all">
                  Upload Planilha (.xlsx)
                </button>
             </div>
          </div>
        )}
      </div>

      {/* TradingView Widgets for XAUUSD */}
      {assetCode === 'XAU / USD' && (
        <XAUUSDWidgets symbol="OANDA:XAUUSD" />
      )}

    </div>
  );
};
