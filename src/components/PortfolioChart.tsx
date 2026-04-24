import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, Cell } from 'recharts';
import { ChevronDown } from 'lucide-react';

const data = Array.from({ length: 45 }, (_, i) => {
  const isUp = Math.random() > 0.45;
  return {
    date: `${17 + Math.floor(i/4)}/03`,
    value: 200 + Math.random() * 350,
    isUp,
  };
});

export const PortfolioChart = () => {
  return (
    <div className="glass-card rounded-3xl p-8 h-full flex flex-col border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Performance Analysis</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Live Trading Volume</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 glass-button rounded-xl text-[10px] font-black uppercase tracking-widest">
          Timeframe: 4h
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
        </button>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700 }}
              dy={15}
              minTickGap={20}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700 }}
              dx={-10}
              domain={[0, 600]}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{ 
                backgroundColor: 'rgba(5, 5, 7, 0.95)', 
                borderColor: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px',
                backdropFilter: 'blur(12px)',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            />
            <ReferenceLine y={450} stroke="rgba(0, 255, 157, 0.2)" strokeDasharray="5 5" />
            <Bar 
              dataKey="value" 
              radius={[2, 2, 0, 0]} 
              barSize={8}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isUp ? "#00ff9d" : "#ff3b3b"} 
                  fillOpacity={entry.isUp ? 0.8 : 0.6}
                  className={entry.isUp ? "green-glow" : "red-glow"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
