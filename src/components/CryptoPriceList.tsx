import React from 'react';
import { Settings2, ArrowUpRight, ArrowDownRight, Bitcoin, Cpu, Zap, Wind, Database } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

const prices = [
  { name: 'BTC', full: 'Bitcoin', price: '64.124,20', change: '+2.76%', isPositive: true, icon: Bitcoin, color: '#00ff9d', data: Array.from({length: 12}, () => ({v: Math.random()})) },
  { name: 'ETH', full: 'Ethereum', price: '3.421,12', change: '+2.02%', isPositive: true, icon: Cpu, color: '#00ff9d', data: Array.from({length: 12}, () => ({v: Math.random()})) },
  { name: 'BNB', full: 'Binance coin', price: '601,07', change: '-1.82%', isPositive: false, icon: Zap, color: '#ff3b3b', data: Array.from({length: 12}, () => ({v: Math.random()})) },
  { name: 'SOL', full: 'Solana', price: '142,50', change: '+5.68%', isPositive: true, icon: Database, color: '#00ff9d', data: Array.from({length: 12}, () => ({v: Math.random()})) },
  { name: 'ADA', full: 'Cardano', price: '0,45', change: '-1.07%', isPositive: false, icon: Wind, color: '#ff3b3b', data: Array.from({length: 12}, () => ({v: Math.random()})) },
];

export const CryptoPriceList = () => {
  return (
    <div className="glass-card rounded-3xl p-8 h-full flex flex-col border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Live Market</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Real-time assets price</p>
        </div>
        <button className="p-3 glass-button rounded-xl hover:text-trading-green transition-all">
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {prices.map((item) => (
          <div key={item.name} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-2xl transition-all border border-transparent hover:border-white/5">
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 backdrop-blur-md border",
                  item.isPositive ? "bg-trading-green/10 border-trading-green/20" : "bg-trading-red/10 border-trading-red/20"
                )}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">{item.name}</h4>
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{item.full}</p>
              </div>
            </div>

            <div className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity hidden md:block">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={item.data}>
                  <Line 
                    type="step" 
                    dataKey="v" 
                    stroke={item.isPositive ? "#00ff9d" : "#ff3b3b"} 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-right">
              <p className="font-black text-sm tracking-tight">$ {item.price}</p>
              <div className={cn(
                "text-[10px] font-black flex items-center justify-end uppercase",
                item.isPositive ? "text-trading-green" : "text-trading-red"
              )}>
                {item.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                {item.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
