import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  LayoutDashboard, 
  HelpCircle,
  LogOut,
  Zap,
  ChevronDown,
  ChevronRight,
  Lock,
  Monitor,
  Globe,
  MessageSquare,
  Trophy,
  BookOpen,
  Network,
  Shield,
  MessageCircle,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabaseClient';
import { authService } from '../lib/authService';
import { User } from '@supabase/supabase-js';
import { SUPPORTED_ASSETS, CATEGORIES } from '../constants/assets';

export const Sidebar = ({ 
  onViewChange, 
  currentView,
  onResetLanding,
  user,
  isAdmin,
  isOpen,
  onClose
}: { 
  onViewChange: (view: string) => void, 
  currentView: string,
  onResetLanding: () => void,
  user: User | null,
  isAdmin: boolean,
  isOpen: boolean,
  onClose: () => void
}) => {
  const [selectedLang, setSelectedLang] = useState({ id: 'br', flag: 'br' });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    dashboards: true, // Always expanded by default
    languages: false,
    b3: true,
    forex: true,
    admin: currentView.startsWith('ADMIN'),
  });
  const [hasNewUpdates, setHasNewUpdates] = useState(false);

  React.useEffect(() => {
    const checkUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('changelog')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const latest = data[0].created_at;
          const lastSeen = localStorage.getItem('lastSeenChangelog');
          
          if (!lastSeen || new Date(latest) > new Date(lastSeen)) {
            setHasNewUpdates(true);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar atualizações:', error);
      }
    };

    checkUpdates();
    
    // Listener para limpar o badge quando o usuário visualiza a timeline
    const handleSeen = () => setHasNewUpdates(false);
    window.addEventListener('changelogSeen', handleSeen);
    return () => window.removeEventListener('changelogSeen', handleSeen);
  }, []);

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader';

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 flex flex-col h-full w-72 bg-[#08080a] border-r border-white/5 py-8 px-6 overflow-y-auto scrollbar-hide transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="mb-10 px-2 flex items-center justify-between relative group/sidebar-header">
        <div 
          onClick={onResetLanding}
          className="flex items-center gap-3 group cursor-pointer"
          title="Voltar para a Landing Page"
        >
          <div className="w-10 h-10 bg-linear-to-br from-trading-green to-emerald-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-trading-green/20 shrink-0">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter text-white">AQUILA</span>
            <span className="text-[10px] font-black tracking-[0.2em] text-trading-green uppercase">Quant</span>
          </div>
        </div>

        {/* Small Flag Language Selector */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('languages')}
            className="w-10 h-7 rounded-md overflow-hidden border border-white/10 hover:border-trading-green/50 transition-all flex items-center justify-center bg-white/5 shadow-inner"
            title="Mudar Idioma"
          >
            <img 
              src={`https://flagcdn.com/w80/${selectedLang.flag}.png`} 
              alt={selectedLang.id} 
              className="w-full h-full object-cover scale-110" 
            />
          </button>
          
          <AnimatePresence>
            {expandedMenus.languages && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 p-1.5 glass-card rounded-xl border border-white/10 bg-[#0a0a0c]/95 backdrop-blur-xl z-50 flex flex-col gap-1.5 shadow-2xl min-w-[50px]"
              >
                {[
                  { id: 'br', label: 'Português', flag: 'br' },
                  { id: 'es', label: 'Español', flag: 'es' },
                  { id: 'us', label: 'English', flag: 'us' }
                ].map(lang => (
                  <button 
                    key={lang.id}
                    onClick={() => {
                      setSelectedLang(lang);
                      toggleMenu('languages');
                    }}
                    className={cn(
                      "w-10 h-7 rounded-md overflow-hidden border transition-all shrink-0 shadow-sm hover:scale-105 active:scale-95",
                      selectedLang.id === lang.id ? "border-trading-green ring-1 ring-trading-green/20" : "border-white/5 hover:border-white/20"
                    )}
                    title={lang.label}
                  >
                    <img src={`https://flagcdn.com/w80/${lang.flag}.png`} alt={lang.id} className="w-full h-full object-cover scale-110" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 space-y-4 mb-8">
        {/* Dashboards Menu */}
        <div className="space-y-1">
            <button
              onClick={() => {
                if (currentView !== 'DASHBOARD' && currentView !== 'B3') onViewChange('DASHBOARD');
                toggleMenu('dashboards');
              }}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-semibold tracking-tight",
                expandedMenus.dashboards ? "bg-white/5 text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={cn("w-5 h-5", expandedMenus.dashboards ? "text-trading-green" : "text-zinc-500 group-hover:text-zinc-300")} />
                <span>Dashboards</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", expandedMenus.dashboards ? "rotate-180" : "")} />
            </button>
            
            <AnimatePresence>
              {expandedMenus.dashboards && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-4 space-y-1 mt-1"
                >
                  {/* Dynamic Asset Submenus */}
                  {CATEGORIES.map(category => (
                    <div key={category} className="space-y-1">
                      <button 
                        onClick={() => toggleMenu(category.toLowerCase())}
                        className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          {category === 'B3' ? <Monitor className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                          <span>{category}</span>
                        </div>
                        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", expandedMenus[category.toLowerCase()] ? "rotate-90" : "")} />
                      </button>
                      {expandedMenus[category.toLowerCase()] && (
                        <div className="pl-8 space-y-1 py-1">
                          {SUPPORTED_ASSETS.filter(a => a.type === category).map(asset => (
                            <button 
                              key={asset.view}
                              onClick={() => onViewChange(asset.view)}
                              className={cn(
                                "flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-[11px] font-bold transition-colors",
                                currentView === asset.view ? "text-trading-green bg-white/5" : "text-zinc-500 hover:text-trading-green hover:bg-white/5"
                              )}
                            >
                              <div className={cn("w-1 h-1 rounded-full", currentView === asset.view ? "bg-trading-green shadow-[0_0_8px_rgba(0,255,157,0.6)]" : "bg-current")} />
                              {asset.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Public Updates Link */}
                  <button 
                    onClick={() => onViewChange('CHANGELOG')}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2 rounded-lg text-xs font-bold transition-all mt-2 group relative",
                      currentView === 'CHANGELOG' ? "text-white bg-white/5" : "text-zinc-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4" />
                      <span>Atualizações</span>
                    </div>
                    {hasNewUpdates && (
                      <span className="flex h-1.5 w-1.5 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-trading-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-trading-green shadow-[0_0_10px_#00ff9d]"></span>
                      </span>
                    )}
                  </button>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        {/* Administrador */}
        {isAdmin && (
          <div className="space-y-1">
            <button
              onClick={() => {
                if (!currentView.startsWith('ADMIN')) onViewChange('ADMIN');
                toggleMenu('admin');
              }}
              className={cn(
                "flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-semibold tracking-tight",
                currentView.startsWith('ADMIN') ? "bg-white/5 text-trading-green" : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Shield className={cn("w-5 h-5", currentView.startsWith('ADMIN') ? "text-trading-green" : "text-zinc-500 group-hover:text-zinc-300")} />
                  <Lock className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5 text-zinc-400" />
                </div>
                <span>Administrador</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", expandedMenus.admin ? "rotate-180" : "")} />
            </button>

            <AnimatePresence>
              {expandedMenus.admin && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-4 space-y-1 mt-1"
                >
                  {/* Clientes */}
                  <button 
                    onClick={() => onViewChange('ADMIN_CLIENTS')}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2 rounded-lg text-xs font-bold transition-all",
                      currentView === 'ADMIN_CLIENTS' ? "text-white bg-white/5" : "text-zinc-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Users className="w-4 h-4" />
                    <span>Clientes</span>
                  </button>
                  
                  {/* Ativos/Pares */}
                  <button 
                    onClick={() => onViewChange('ADMIN_PAIRS')}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2 rounded-lg text-xs font-bold transition-all",
                      currentView === 'ADMIN_PAIRS' ? "text-white bg-white/5" : "text-zinc-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Pares</span>
                  </button>

                  {/* Atualizações */}
                  <button 
                    onClick={() => onViewChange('ADMIN_CHANGELOG')}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2 rounded-lg text-xs font-bold transition-all",
                      currentView === 'ADMIN_CHANGELOG' ? "text-white bg-white/5" : "text-zinc-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Atualizações</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </nav>

      <div className="space-y-4">
        {/* Discord Community Button */}
        <button 
          onClick={() => window.open('https://google.com', '_blank')}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all group bg-white/5 border border-white/5 hover:border-[#5865F2]/30 hover:bg-[#5865F2]/5 text-zinc-400 hover:text-white"
        >
          <div className="w-8 h-8 rounded-lg bg-[#5865F2]/20 flex items-center justify-center border border-[#5865F2]/30 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
            </svg>
          </div>
          <span>Comunidade Discord</span>
        </button>

        {/* Profile Card */}
        <div 
          className={cn(
            "glass-card rounded-2xl p-4 border group text-left w-full transition-all relative overflow-hidden",
            currentView === 'PROFILE' ? "border-trading-green bg-white/5 shadow-[0_0_15px_rgba(0,255,157,0.05)]" : "border-white/10 bg-white/[0.02] hover:border-trading-green/30"
          )}
        >
          <div className="flex items-center justify-between">
            <div 
              onClick={() => onViewChange('PROFILE')}
              className="flex items-center gap-3 cursor-pointer flex-1"
            >
              <div className="relative">
                {user?.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={fullName} 
                    className="w-10 h-10 rounded-full border border-white/10 p-0.5 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-[10px] font-black text-trading-green">
                    {getInitials(fullName)}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-trading-green border-2 border-[#08080a] rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white leading-none mb-1.5 truncate max-w-[120px]">{fullName}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.4)]"></div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Assinatura Ativa</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 text-zinc-500 hover:text-trading-red transition-all cursor-pointer disabled:opacity-50"
              title="Sair"
            >
              {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);
};
