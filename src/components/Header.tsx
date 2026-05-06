import React from 'react';
import { Search, Bell, Mail, ChevronDown, Menu } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export const Header = ({ currentView, user, onMenuClick }: { currentView?: string, user: User | null, onMenuClick?: () => void }) => {
  const isDashboard = currentView === 'DASHBOARD';
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';
  
  const getHeaderInfo = () => {
    if (currentView?.startsWith('ADMIN')) {
      return { title: 'Área do Administrador', desc: 'Gerenciamento de sistema, usuários e dados' };
    }
    switch (currentView) {
      case 'PROFILE': return { title: 'Perfil do Usuário', desc: `Visualizando perfil de ${fullName}` };
      case 'SUPPORT': return { title: 'Ajuda & Suporte', desc: 'Central de atendimento ao cliente' };
      case 'MINI_DOLAR': return { title: 'MINI DÓLAR', desc: 'Cálculo de regiões e performance quantitativa' };
      case 'MINI_INDICE': return { title: 'MINI ÍNDICE', desc: 'Cálculo de regiões e performance quantitativa' };
      case 'XAU_USD': return { title: 'XAU / USD', desc: 'Gráficos e performance quantitativa GOLD' };
      case 'EUR_USD': return { title: 'EUR / USD', desc: 'Gráficos e performance quantitativa FOREX' };
      case 'DASHBOARD':
      default: return { title: 'DASHBOARDS', desc: 'AQUILA QUANT Terminal v2.4.0' };
    }
  };

  const { title, desc } = getHeaderInfo();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-6 md:py-8 bg-transparent gap-4 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="header-title">
          <h1 className="text-xl md:text-3xl font-black tracking-tighter mb-1 uppercase leading-none">
            {title}
          </h1>
          <div className="flex items-center gap-2">
            {isDashboard ? (
              <>
                <div className="w-2 h-2 bg-trading-green rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,157,0.6)]"></div>
                <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest">Market Live: Connected</p>
              </>
            ) : (
              <p className="text-[10px] md:text-xs text-zinc-500 font-bold uppercase tracking-widest">{desc}</p>
            )}
          </div>
        </div>

        <button 
          onClick={onMenuClick}
          className="p-3 glass-button rounded-xl lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <Menu className="w-6 h-6 text-trading-green" />
        </button>
      </div>
      
      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto">
        <div className="relative group flex-1 md:flex-none hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-trading-green transition-colors" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-6 w-full md:w-64 lg:w-96 text-base md:text-sm focus:ring-1 focus:ring-trading-green/30 transition-all outline-none backdrop-blur-md font-medium min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <button className="p-3 glass-button rounded-xl transition-all hover:border-trading-green/30 group min-h-[44px] min-w-[44px] flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-zinc-400 group-hover:text-trading-green" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-trading-red rounded-full border-2 border-[#050507]"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
