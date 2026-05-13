import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MarketCard } from './components/MarketCard';
import { PortfolioChart } from './components/PortfolioChart';
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
import { AccessGate } from './components/AccessGate';
import { SetPasswordModal } from './components/SetPasswordModal';
import { SUPPORTED_ASSETS } from './constants/assets';
import { Bitcoin, Cpu, Zap, ChevronDown, Shield, Lock, Loader2 } from 'lucide-react';
import { checkSupabaseConnection, supabase } from './lib/supabaseClient';
import { useAuth } from './hooks/useAuth';

const btcData = [{value: 40}, {value: 35}, {value: 55}, {value: 45}, {value: 70}, {value: 60}, {value: 90}];
const ethData = [{value: 30}, {value: 45}, {value: 35}, {value: 60}, {value: 50}, {value: 75}, {value: 65}];
const bnbData = [{value: 80}, {value: 70}, {value: 85}, {value: 60}, {value: 75}, {value: 55}, {value: 45}];

// Componente de proteção de rota de elite
interface ProtectedRouteProps {
  children: React.ReactNode;
  user: any;
  loading: boolean;
  isInitializing: boolean;
  onEnter: () => void;
}

const ProtectedRoute = ({ children, user, loading, isInitializing, onEnter }: ProtectedRouteProps) => {
  if (isInitializing || (loading && !user)) {
    return (
      <div className="h-screen w-full bg-[#050507] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Zap className="w-12 h-12 text-trading-green animate-pulse" />
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Validando Segurança do Ambiente...</p>
        </div>
      </div>
    );
  }

  // Só volta para a landing se não houver usuário E não estiver inicializando/carregando
  if (!user && !isInitializing && !loading) {
    onEnter();
    return null;
  }

  return <>{children}</>;
};

export default function App() {
  const [currentView, setCurrentView] = useState('DASHBOARD');
  const [isChatPiP, setIsChatPiP] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const isFirstLoad = React.useRef(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false);
  
  const { user, loading, isAdmin, isInitializing } = useAuth();
  
  useEffect(() => {
    // Interceptor para convites e recuperação de senha (Silent Onboarding)
    const hash = window.location.hash;
    const isSpecialFlow = hash && (hash.includes('type=invite') || hash.includes('type=recovery') || hash.includes('access_token='));

    if (isSpecialFlow) {
      console.log('🎫 Detectado fluxo especial de autenticação...');
      setIsSetPasswordOpen(true);
      setHasEntered(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Evitamos logs excessivos no foco da aba se o estado for o mesmo
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        // Redução radical de logs e ruído
      } else {
        console.log('🔐 Auth Event:', event);
      }
      
      if (event === 'PASSWORD_RECOVERY') {
        setIsSetPasswordOpen(true);
        if (!hasEntered) setHasEntered(true);
      } else if (event === 'SIGNED_IN') {
        const isAuthFlow = isSpecialFlow || window.location.hash.includes('access_token');
        if (isAuthFlow) {
          setIsSetPasswordOpen(true);
        }
        if (!hasEntered) setHasEntered(true);
      } else if (event === 'USER_UPDATED') {
        console.log('✅ Usuário atualizado, fechando modal de senha...');
        setIsSetPasswordOpen(false);
        if (!hasEntered) setHasEntered(true);
        try {
          window.history.replaceState(null, '', window.location.pathname);
        } catch (e) {
          window.location.hash = '';
        }
      } else if (session && !hasEntered) {
        setHasEntered(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const init = async () => {
      await checkSupabaseConnection();
    };
    init();
  }, []);

  useEffect(() => {
    // Só reseta o estado de entrada se REALMENTE não houver usuário e não estiver em processo de carregamento
    if (!user && !loading && !isInitializing && hasEntered) {
      setHasEntered(false);
    }

    if (user && !isFirstLoad.current && !hasEntered) {
      setHasEntered(true);
    }

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
    }
  }, [user, loading, isInitializing, hasEntered]);

  const handleToggleChatPiP = () => {
    setIsChatPiP(!isChatPiP);
    if (!isChatActive) setIsChatActive(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'PROFILE': return <Profile />;
      case 'SUPPORT': return <SupportView />;
      case 'PERFORMANCE': return <PerformanceView />;
      case 'RESULTS': return <ResultsGallery />;
      case 'LEADERBOARD': return <Leaderboard />;
      case 'STUDY': return <ArticlesStudy />;
      case 'CHAT': return <LiveChat isPiP={false} onTogglePiP={() => {}} />;
      case 'ADMIN': 
      case 'ADMIN_CLIENTS':
      case 'ADMIN_PAIRS':
        if (!isAdmin) {
          setCurrentView('DASHBOARD');
          return <HomeDashboardWidgets />;
        }
        return <AdminView currentView={currentView} onViewChange={setCurrentView} />;
      case 'DASHBOARD':
      default:
        // Try to find if currentView is a dynamic asset
        const asset = SUPPORTED_ASSETS.find(a => a.view === currentView);
        if (asset) {
          return (
            <AccessGate 
              requiredTag={asset.type}
            >
              <TradingDashboard 
                assetName={asset.name} 
                assetCode={asset.symbol} 
                category={asset.type.toUpperCase() as any} 
              />
            </AccessGate>
          );
        }
        return <HomeDashboardWidgets />;
    }
  };

  // RENDERIZAÇÃO NÃO-BLOQUEANTE:
  // Se não entrou ou não tem usuário e não estamos carregando/inicializando, Landing Page é soberana.
  if (!hasEntered || (!user && !isInitializing && !loading)) {
    return (
      <>
        <LandingPage 
          user={user}
          onStart={() => {
            if (user) {
              setHasEntered(true);
            } else {
              setIsAuthModalOpen(true);
            }
          }} 
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
        <SetPasswordModal 
          isOpen={isSetPasswordOpen} 
          onSuccess={() => setIsSetPasswordOpen(false)} 
        />
      </>
    );
  }

  return (
    <ProtectedRoute 
      user={user} 
      loading={loading}
      isInitializing={isInitializing} 
      onEnter={() => setHasEntered(false)}
    >
      <div className="flex h-screen bg-[#050507] text-white overflow-hidden font-sans relative">
        {/* Background Grid Lines Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Modal de Definição de Senha (Silent Onboarding) */}
        <SetPasswordModal 
          isOpen={isSetPasswordOpen} 
          onSuccess={() => setIsSetPasswordOpen(false)} 
        />

        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onViewChange={(view) => {
            if (view === 'CHAT') {
              setCurrentView('CHAT');
              setIsChatActive(true);
              setIsChatPiP(false);
            } else {
              setCurrentView(view);
            }
            setIsSidebarOpen(false); // Close sidebar on view change on mobile
          }}
          currentView={currentView} 
          onResetLanding={() => {
            setHasEntered(false);
            setCurrentView('DASHBOARD');
            setIsSidebarOpen(false);
          }}
          user={user}
          isAdmin={isAdmin}
        />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10 transition-all duration-300">
          <Header 
            currentView={currentView} 
            user={user} 
            onMenuClick={() => setIsSidebarOpen(true)}
          />
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
    </ProtectedRoute>
  );
}

