import React from 'react';
import { Settings2, ArrowUpRight, ArrowDownRight, Bitcoin, Cpu, Zap, Wind, Database, Coins } from 'lucide-react';
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
    <div className="glass-card rounded-[2.5rem] p-10 h-full flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-trading-green/5 blur-[100px] -z-10 rounded-full" />
      
      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
         <Coins className="w-10 h-10 text-trading-green opacity-40" />
      </div>
      
      <div className="text-center">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Criptoativos</h3>
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-2">Em Processamento pela Engine</p>
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 max-w-sm">
        <p className="text-xs text-zinc-400 leading-relaxed font-medium text-center">
          O módulo de análise de Criptomoedas está sendo calibrado com os novos algoritmos de volatilidade v5.6. <span className="text-trading-green">Disponível em breve.</span>
        </p>
      </div>
    </div>
  );
};
