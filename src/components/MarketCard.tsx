import React from 'react';
import { ChevronRight, ArrowUpRight, ArrowDownRight, Bitcoin, Cpu, Zap } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '../lib/utils';

interface MarketCardProps {
  name: string;
  symbol: string;
  price?: string;
  rewardRate: string;
  change: string;
  isPositive: boolean;
  data: { value: number }[];
  icon: React.ElementType;
  className?: string;
  glow?: boolean;
}

export const MarketCard = ({ 
  name, 
  symbol, 
  rewardRate, 
  change, 
  isPositive, 
  data, 
  icon: Icon,
  className,
  glow 
}: MarketCardProps) => {
  return (
    <div className={cn(
      "glass-card rounded-3xl p-6 transition-all duration-300 relative overflow-hidden group hover:bg-white/[0.08] hover:border-white/20",
      glow && (isPositive ? "ring-1 ring-trading-green/30 bg-trading-green/5" : "ring-1 ring-trading-red/30 bg-trading-red/5"),
      className
    )}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 backdrop-blur-xl",
            isPositive 
              ? "bg-trading-green/10 border-trading-green/20 text-trading-green shadow-[0_0_15px_rgba(0,255,157,0.1)]" 
              : "bg-trading-red/10 border-trading-red/20 text-trading-red shadow-[0_0_15px_rgba(255,59,59,0.1)]"
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight tracking-tight">{name}</h3>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{symbol} / USD</p>
          </div>
        </div>
        <button className={cn(
          "p-1.5 glass-button rounded-xl transition-all",
          isPositive ? "hover:border-trading-green/50" : "hover:border-trading-red/50"
        )}>
          <ChevronRight className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 leading-none">Market Reward</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tighter">{rewardRate}%</span>
            <div className={cn(
              "flex items-center text-[11px] font-black px-2 py-0.5 rounded-lg border",
              isPositive 
                ? "text-trading-green bg-trading-green/10 border-trading-green/20" 
                : "text-trading-red bg-trading-red/10 border-trading-red/20"
            )}>
              {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {change}%
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 -mx-6 opacity-80 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis hide domain={['auto', 'auto']} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? "#00ff9d" : "#ff3b3b"} 
              strokeWidth={3} 
              dot={false}
              className={isPositive ? "green-glow" : "red-glow"}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
