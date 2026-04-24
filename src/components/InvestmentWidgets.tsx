import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Bitcoin, Cpu, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';

export const InvestmentResults = () => {
  return (
    <div className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-trading-green/5 blur-3xl rounded-full"></div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Investment Results</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Portfolio yield overview</p>
        </div>
        <div className="p-3 bg-trading-green/10 rounded-2xl border border-trading-green/20 shadow-[0_0_15px_rgba(0,255,157,0.1)]">
          <TrendingUp className="w-5 h-5 text-trading-green" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 group/card hover:bg-white/[0.08] transition-all">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 leading-none">Total Profit</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tighter">$42,912</span>
            <span className="text-[10px] text-trading-green font-black">+12.4%</span>
          </div>
        </div>
        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 group/card hover:bg-white/[0.08] transition-all">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 leading-none">Net Return</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tighter">$8,240</span>
            <span className="text-[10px] text-trading-red font-black">-2.1%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InvestmentDistribution = () => {
  const distData = [
    { name: 'BTC', value: 45, color: '#00ff9d' },
    { name: 'ETH', value: 30, color: '#ff3b3b' },
    { name: 'USDT', value: 25, color: 'rgba(255,255,255,0.1)' },
  ];

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Distribution</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Assets allocation</p>
        </div>
      </div>
      
      <div className="relative w-full aspect-square max-w-[170px] my-6 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={6}
              dataKey="value"
              stroke="none"
              strokeWidth={0}
            >
              {distData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(5, 5, 7, 0.95)', 
                borderColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-xl font-black tracking-tighter">75%</span>
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Global</span>
        </div>
      </div>

      <div className="w-full space-y-1.5 mt-auto">
        {distData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-zinc-500">{item.name}</span>
            </div>
            <span className="text-zinc-300">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TradingSignals = () => {
  const signals = [
    { name: 'Trend Strength', value: 'Strong Buy', color: 'text-trading-green', bg: 'bg-trading-green/10', icon: TrendingUp },
    { name: 'Volume Flow', value: 'High Sell', color: 'text-trading-red', bg: 'bg-trading-red/10', icon: BarChart3 },
    { name: 'Market Sentiment', value: 'Greed', color: 'text-trading-green', bg: 'bg-trading-green/10', icon: Zap },
  ];

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Trading signals</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time indicators</p>
        </div>
        <button className="p-2 glass-button rounded-xl hover:text-trading-green transition-colors">
          <Zap className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {signals.map((sig) => (
          <div 
            key={sig.name}
            className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", sig.bg)}>
                <sig.icon className={cn("w-5 h-5", sig.color)} />
              </div>
              <span className="text-sm font-bold tracking-tight text-white">{sig.name}</span>
            </div>
            <span className={cn("text-xs font-black uppercase tracking-tighter", sig.color)}>{sig.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
