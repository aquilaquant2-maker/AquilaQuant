import React from 'react';
import { Bitcoin } from 'lucide-react';

export const CalendarWidget = () => {
  return (
    <div className="glass-card rounded-3xl p-8 border border-white/5 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Event Calendar</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Global market events</p>
        </div>
      </div>
      
      <div className="bg-trading-green/90 rounded-2xl p-5 flex items-center justify-between border border-white/20 shadow-lg shadow-trading-green/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex flex-col items-center justify-center border border-white/20">
            <span className="text-xl font-black tracking-tighter text-black leading-none">20</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-black/60">Abr</span>
          </div>
          <div>
            <h4 className="font-black text-lg leading-tight text-black uppercase tracking-tighter">CPI Data</h4>
            <p className="text-[10px] text-black/70 font-bold uppercase tracking-tight">Inflation Report Release</p>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end gap-2">
          <span className="text-xs font-black text-black whitespace-nowrap">08:30 AM</span>
          <div className="w-8 h-8 bg-black/10 rounded-lg flex items-center justify-center border border-black/5">
            <Bitcoin className="w-4 h-4 text-black" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {[
          { date: '21 Abr', label: 'FED Speech', type: 'FOMC' },
          { date: '24 Abr', label: 'ETH Upgrade', type: 'Tech' },
        ].map((event, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 border-dashed">
            <span className="text-[10px] font-black text-zinc-500 uppercase">{event.date}</span>
            <span className="text-xs font-bold text-white tracking-tight">{event.label}</span>
            <span className="text-[9px] font-black px-2 py-0.5 bg-white/5 rounded-full text-zinc-400 uppercase">{event.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
