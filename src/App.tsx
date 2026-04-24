import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MarketCard } from './components/MarketCard';
import { PortfolioChart } from './components/PortfolioChart';
import { CryptoPriceList } from './components/CryptoPriceList';
import { InvestmentResults, InvestmentDistribution, TradingSignals } from './components/InvestmentWidgets';
import { CalendarWidget } from './components/Calendar';
import { Profile } from './components/Profile';
import { SupportView } from './components/Support';
import { ResultsGallery, Leaderboard, ArticlesStudy } from './components/CommunityViews';
import { LiveChat } from './components/LiveChat';
import { PerformanceView } from './components/Performance';
import { TradingDashboard } from './components/TradingDashboard';
import { LandingPage } from './components/LandingPage';
import { AdminView } from './components/AdminView';
import { HomeDashboardWidgets } from './components/HomeDashboardWidgets';
import { AuthModal } from './components/AuthModal';
import { Bitcoin, Cpu, Zap, ChevronDown, Shield, Lock, Loader2 } from 'lucide-react';
import { checkSupabaseConnection } from './lib/supabaseClient';
import { useAuth } from './hooks/useAuth';

const btcData = [{value: 40}, {value: 35}, {value: 55}, {value: 45}, {value: 70}, {value: 60}, {value: 90}];
const ethData = [{value: 30}, {value: 45}, {value: 35}, {value: 60}, {value: 50}, {value: 75}, {value: 65}];
const bnbData = [{value: 80}, {value: 70}, {value: 85}, {value: 60}, {value: 75}, {value: 55}, {value: 45}];

export default function App() {
  const [currentView, setCurrentView] = useState('DASHBOARD');
  const [isChatPiP, setIsChatPiP] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    const init = async () => {
      const isConnected = await checkSupabaseConnection();
      if (isConnected) {
        console.log('✅ AQUILA QUANT: Supabase Link Stable');
      } else {
        console.warn('⚠️ AQUILA QUANT: Supabase Link Pending Configuration');
      }
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#050507] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-12 h-12 text-trading-green animate-pulse" />
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage onStart={() => setIsAuthModalOpen(true)} />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </>
    );
  }

  const handleToggleChatPiP = () => {
    setIsChatPiP(!isChatPiP);
    if (!isChatActive) setIsChatActive(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'PROFILE': return <Profile />;
      case 'SUPPORT': return <SupportView />;
      case 'MINI_DOLAR': return <TradingDashboard assetName="MINI DÓLAR" assetCode="WDO / DOL" category="B3" />;
      case 'MINI_INDICE': return <TradingDashboard assetName="MINI ÍNDICE" assetCode="WIN / IND" category="B3" />;
      case 'EUR_USD': return <TradingDashboard assetName="Euro / Dólar" assetCode="EUR / USD" category="FOREX" />;
      case 'XAU_USD': return <TradingDashboard assetName="Ouro (Gold)" assetCode="XAU / USD" category="FOREX" />;
      case 'ADMIN': 
      case 'ADMIN_CLIENTS':
      case 'ADMIN_B3_DOLAR':
      case 'ADMIN_B3_INDICE':
      case 'ADMIN_FOREX_XAU':
      case 'ADMIN_FOREX_EUR':
      case 'ADMIN_CRIPTO_BTC':
      case 'ADMIN_CRIPTO_ETH':
      case 'ADMIN_CRIPTO_SOL':
        return <AdminView currentView={currentView} onViewChange={setCurrentView} />;
      case 'DASHBOARD':
      default:
        return <HomeDashboardWidgets />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050507] text-white overflow-hidden font-sans relative">
      {/* Background Grid Lines Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <Sidebar 
        onViewChange={(view) => {
          if (view === 'CHAT') {
            setCurrentView('CHAT');
            setIsChatActive(true);
            setIsChatPiP(false);
          } else {
            setCurrentView(view);
          }
        }}
        currentView={currentView} 
        onResetLanding={() => setCurrentView('DASHBOARD')}
        user={user}
        isAdmin={isAdmin}
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10 transition-all duration-300">
        <Header currentView={currentView} user={user} />
        {renderView()}
      </main>

      {/* Chat PiP Overlay */}
      {isChatActive && isChatPiP && (
        <LiveChat 
          isPiP={true} 
          onTogglePiP={() => {
            setCurrentView('CHAT');
            setIsChatPiP(false);
          }} 
          onClose={() => {
            setIsChatActive(false);
            setIsChatPiP(false);
          }}
        />
      )}
    </div>
  );
}
