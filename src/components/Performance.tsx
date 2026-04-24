import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity,
  Zap,
  DollarSign
} from 'lucide-react';
import { cn } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Seg', profit: 1200, trades: 12 },
  { name: 'Ter', profit: 2400, trades: 15 },
  { name: 'Qua', profit: -800, trades: 10 },
  { name: 'Qui', profit: 3200, trades: 18 },
  { name: 'Sex', profit: 1800, trades: 14 },
];

export const PerformanceView = () => {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Performance Analítica</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Dados detalhados da sua conta de operações</p>
        </div>
        <div className="flex gap-4">
           <button className="px-5 py-2 glass-button rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-trading-green/30">Exportar Relatório</button>
           <button className="px-5 py-2 bg-trading-green text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-trading-green/10">Sincronizar Corretora</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Lucro Líquido', value: 'R$ 14.280,00', change: '+12.4%', isPositive: true, icon: TrendingUp },
          { label: 'Taxa de Acerto', value: '68.5%', change: '+2.1%', isPositive: true, icon: Target },
          { label: 'Drawdown Máx', value: '4.2%', change: '-0.5%', isPositive: true, icon: TrendingDown },
          { label: 'Fator de Lucro', value: '2.14', change: '+0.12', isPositive: true, icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg", stat.isPositive ? "bg-trading-green/10" : "bg-trading-red/10")}>
                 <stat.icon className={cn("w-5 h-5", stat.isPositive ? "text-trading-green" : "text-trading-red")} />
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-widest", stat.isPositive ? "text-trading-green" : "text-trading-red")}>
                {stat.change}
              </span>
            </div>
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-xl font-black text-white">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Equity Curve */}
        <div className="lg:col-span-2 glass-card rounded-[2rem] p-8 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-sm font-black uppercase tracking-widest text-white">Curva de Patrimônio (Equity Loop)</h3>
             <select className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer hover:text-white transition-colors">
               <option>Últimos 30 dias</option>
               <option>Últimos 90 dias</option>
             </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#00ff9d' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#00ff9d" strokeWidth={3} fillOpacity={1} fill="url(#equityGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Stats */}
        <div className="glass-card rounded-[2rem] p-8 border border-white/5 bg-white/[0.01] flex flex-col justify-between">
           <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Eficiência Operacional</h3>
           <div className="space-y-6">
              {[
                { label: 'Melhor Trade', value: '+ R$ 1.842', color: 'text-trading-green' },
                { label: 'Pior Trade', value: '- R$ 420', color: 'text-trading-red' },
                { label: 'Avg Trade', value: '+ R$ 242', color: 'text-white' },
                { label: 'Trades no Mês', value: '142', color: 'text-white' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.label}</span>
                  <span className={cn("text-sm font-black", item.color)}>{item.value}</span>
                </div>
              ))}
           </div>
           <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-trading-green/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-trading-green" />
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black uppercase text-white">Consistência Mensal</h5>
                    <div className="w-48 h-1.5 bg-white/5 rounded-full mt-1.5">
                       <div className="h-full bg-trading-green rounded-full w-[85%] shadow-[0_0_8px_rgba(0,255,157,0.4)]" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
