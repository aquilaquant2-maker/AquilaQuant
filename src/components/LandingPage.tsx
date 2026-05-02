import React from 'react';
import { 
  Zap, 
  ArrowRight, 
  Shield, 
  BarChart3, 
  Globe, 
  Lock, 
  TrendingUp, 
  Activity,
  ChevronRight,
  ChevronDown,
  Monitor,
  Target,
  Brain,
  Map,
  ZapOff,
  Bitcoin,
  Cpu,
  Coins,
  TrendingDown,
  Check,
  Plus,
  Minus,
  Info,
  Mail,
  Instagram,
  Linkedin,
  Star,
  MessageCircle,
  Calendar,
  Layout,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const LandingPage = ({ onStart, user }: { onStart: () => void, user: any }) => {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  React.useEffect(() => {
    const existingScript = document.getElementById('tradingview-ticker-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'tradingview-ticker-script';
      script.src = 'https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js';
      script.type = 'module';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
  
  const tickerAssets = [
    { code: 'BTC/USD', name: 'Bitcoin', icon: Bitcoin, change: '+2.45%' },
    { code: 'ETH/USD', name: 'Ethereum', icon: Cpu, change: '+1.82%' },
    { code: 'WINQ24', name: 'Mini Índice', icon: TrendingDown, change: '-0.34%' },
    { code: 'WDOU24', name: 'Mini Dólar', icon: Activity, change: '+0.12%' },
    { code: 'USD/BRL', name: 'Dólar Comercial', icon: TrendingDown, change: '-0.45%' },
    { code: 'GOLD', name: 'Ouro Spot', icon: Coins, change: '+0.78%' },
    { code: 'SPX500', name: 'S&P 500', icon: BarChart3, change: '+1.15%' },
    { code: 'NASDAQ', name: 'Nasdaq 100', icon: Zap, change: '+1.42%' },
  ];

  const duplicatedAssets = [...tickerAssets, ...tickerAssets, ...tickerAssets];

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans overflow-x-hidden selection:bg-trading-green/30">
      {/* Promo Banner */}
      <div className="bg-[#050507] border-b border-trading-green/20 py-2.5 px-6 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-300">
          <span>🔥 PROMO de lançamento:</span>
          <span className="text-trading-green font-black">30% OFF</span>
          <span className="text-zinc-600 px-1">/</span>
          <span>Cupom:</span>
          <span className="bg-trading-green/10 text-trading-green px-2 py-0.5 rounded border border-trading-green/20 font-black">PROMO30</span>
          <a href="#pricing" className="ml-4 text-white hover:text-trading-green transition-colors border-b border-white hover:border-trading-green pb-0.5 font-black hidden sm:inline-block">
            Acesse Agora →
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-trading-green shadow-[0_0_10px_rgba(0,255,157,0.3)]" />
      </div>

      {/* Navigation - Floating Styled */}
      <div className="fixed top-6 md:top-12 left-0 right-0 z-50 px-4 md:px-6 pointer-events-none">
        <nav className="max-w-4xl mx-auto h-14 md:h-16 bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between px-4 md:px-6 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-linear-to-br from-trading-green to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-trading-green/20 shrink-0">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-black fill-black" />
            </div>
            <div className="flex flex-col leading-none scale-75 origin-left hidden sm:flex">
              <span className="text-lg font-black tracking-tighter text-white">AQUILA</span>
              <span className="text-[8px] font-black tracking-[0.2em] text-trading-green uppercase">Quant</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 md:gap-10">
            <button 
              onClick={() => document.getElementById('matemagica')?.scrollIntoView({ behavior: 'smooth' })} 
              className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Funcionalidades
            </button>
            <button 
              onClick={() => document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' })} 
              className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Resultados
            </button>
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} 
              className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Preços
            </button>
          </div>

          <button 
            onClick={onStart}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:border-trading-green/30 text-white"
          >
            {user ? 'Dashboard' : 'Login'}
          </button>
        </nav>
      </div>
      
      {/* TradingView Ticker Tape - Now relative to content, not fixed to screen */}
      <div className="relative z-40 bg-[#050507]/80 backdrop-blur-md border-b border-white/5 h-[48px] flex items-center overflow-hidden mt-28">
        {/* @ts-ignore */}
        <tv-ticker-tape 
          symbols="OANDA:XAUUSD,BMFBOVESPA:WDO1!,BMFBOVESPA:WIN1!,OANDA:EURUSD,BITSTAMP:ETHUSD,BITSTAMP:BTCUSD,OANDA:USDJPY,OANDA:GBPUSD,OANDA:USDCHF,OANDA:AUDUSD" 
          item-size="compact"
          theme="dark" 
          transparent
        ></tv-ticker-tape>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-20 md:pb-32 px-6 overflow-hidden">
        {/* Animated Market Chart Background */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img 
            src="https://images.unsplash.com/photo-1642388691910-60293739a897?q=80&w=2000" 
            alt="Market Chart" 
            className="w-full h-full object-cover grayscale opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#050507] via-transparent to-[#050507]" />
        </motion.div>

        {/* Floating Particles/Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-trading-green/10 blur-[120px] rounded-full -z-10 opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-trading-red/5 blur-[100px] rounded-full -z-10 opacity-20" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-trading-green/10 border border-trading-green/20 text-trading-green text-[10px] font-black uppercase tracking-widest mb-8">
              <Activity className="w-3 h-3" /> Revolucionando o Trading Quantitativo
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
              TRANSFORME O MERCADO FINANCEIRO DE <span className="text-trading-green">ALEATÓRIO</span> PARA <span className="text-trading-green">PREVISÍVEL</span>
            </h1>
            <p className="max-w-3xl mx-auto text-zinc-400 text-lg md:text-xl font-medium mb-12 leading-relaxed">
              A ferramenta que usa dados exatos e matemática institucional, para determinar os <span className="font-bold text-zinc-200">pontos de compra e venda</span> com a maior <span className="font-bold text-zinc-200">probabilidade estatística de sucesso</span> possível.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-10 py-5 bg-trading-green text-black rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-trading-green/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {user ? 'Acessar Dashboard' : 'Começar agora'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>


          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-24 relative max-w-5xl mx-auto"
          >
            <div className="glass-card rounded-[3rem] border border-white/10 p-4 shadow-2xl relative group overflow-hidden">
              <div className="rounded-[2.5rem] overflow-hidden aspect-video bg-[#0a0a0c] border border-white/5 relative">
                 {/* Video Placeholder */}
                 <div className="absolute inset-0 bg-radial-gradient from-trading-green/5 to-transparent opacity-50" />
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-24 h-24 rounded-full bg-trading-green flex items-center justify-center shadow-[0_0_50px_rgba(0,255,157,0.4)] cursor-pointer group-hover:scale-110 transition-transform"
                    >
                       <Zap className="w-10 h-10 text-black fill-black" />
                    </motion.div>
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-trading-green animate-pulse">Preview Video</span>
                       <span className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest">Coming Soon</span>
                    </div>
                 </div>
                 
                 {/* Decorative elements to look like a player */}
                 <div className="absolute bottom-8 left-8 right-8 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-trading-green shadow-[0_0_10px_rgba(0,255,157,0.5)]" />
                 </div>
              </div>
            </div>

            {/* Performance Text Only Section */}
            <div className="mt-16 space-y-6 text-center">
              <div className="space-y-4">
                <p className="text-lg md:text-xl font-bold uppercase tracking-tight text-white/90">
                  Aumente sua performance no trading em <span className="text-trading-green">97%</span> a partir de <span className="text-trading-green">agora</span>
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 border-[#050507] overflow-hidden flex items-center justify-center bg-[#050507] z-10">
                      <img src="https://flagcdn.com/w40/br.png" alt="Brasil" className="w-full h-full object-cover scale-150" />
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-[#050507] overflow-hidden flex items-center justify-center bg-[#050507]">
                      <img src="https://flagcdn.com/w40/us.png" alt="USA" className="w-full h-full object-cover scale-150" />
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                    Para dólar, índice e forex | enviado todos os dias antes do mercado abrir
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust Features Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-8"
          >
            {/* Stacked Avatars */}
            <div className="flex -space-x-3">
              {['MR', 'JS', 'AT', 'DK'].map((initial, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050507] bg-trading-green/20 flex items-center justify-center text-[10px] font-black text-trading-green backdrop-blur-sm">
                  {initial}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#050507] bg-trading-green flex items-center justify-center text-[10px] font-black text-black">
                5K+
              </div>
            </div>

            {/* Rating Box */}
            <div className="glass-card px-6 py-3 rounded-2xl border border-white/5 flex flex-col items-center sm:items-start gap-1">
              <span className="text-xs font-black text-white uppercase tracking-tight">Usado por 5,000+ traders</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">4.8 rating</span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-[1px] h-10 bg-white/10" />

            {/* Guarantee */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-trading-green/10 border border-trading-green/20 flex items-center justify-center text-trading-green shadow-[0_0_15px_rgba(0,255,157,0.1)]">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-white uppercase tracking-widest">Garantia de 30 dias</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Row 1 */}
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 grayscale opacity-30">
            {['MetaTrader5', 'Nelogica', 'Tryd', 'TradingView', 'Investing.com'].map((partner) => (
              <span key={partner} className="text-sm font-black tracking-[0.3em] uppercase whitespace-nowrap">{partner}</span>
            ))}
          </div>
          {/* Row 2 */}
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 grayscale opacity-30">
            {['B3', 'Coinbase', 'Crypto.com'].map((partner) => (
              <span key={partner} className="text-sm font-black tracking-[0.3em] uppercase whitespace-nowrap">{partner}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Matematica Section - New alternating layout section */}
      <section id="matemagica" className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight">
              NÃO É MÁGICA, <br /> É <span className="text-trading-green">MATEMÁGICA.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-trading-green/10 border border-trading-green/20 flex items-center justify-center text-trading-green mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-4">Dados Corporativos</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Coletamos diversos dados passados de mercado e aplicamos fórmulas quantitativas de nível corporativo sobre eles, a fim de antecipar e precificar acontecimentos futuros.
              </p>
            </div>

            <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-trading-green/10 border border-trading-green/20 flex items-center justify-center text-trading-green mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-4">Zero Emoção</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Eliminamos o fator humano e emocional do trading, responsável por 90% dos erros, e substituímos por decisões exatas com as mais altas probabilidades de sucesso.
              </p>
            </div>

            <div className="glass-card p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
              <div className="w-12 h-12 rounded-2xl bg-trading-green/10 border border-trading-green/20 flex items-center justify-center text-trading-green mb-6 group-hover:scale-110 transition-transform">
                <Map className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-4">Mapa de Operação</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Você recebe todos os dias antes do mercado abrir, o mapa completo de tudo com a maior chance de acontecer durante o pregão. Você saberá exatamente o que fazer.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 mb-20">
            <div className="h-[1px] flex-1 bg-linear-to-r from-transparent to-white/10" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-trading-green animate-pulse">O que você recebe</span>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">O relatório diário inclui:</h3>
            </div>
            <div className="h-[1px] flex-1 bg-linear-to-l from-transparent to-white/10" />
          </div>

          <div className="space-y-32">
            {[
              {
                title: "Pontos de compra e venda",
                desc: "Zonas de alta liquidez onde os grandes players institucionais costumam atuar, calculadas através de desvios estatísticos precisos.",
                image: "https://images.unsplash.com/photo-1611974717482-aa8a29a435a2?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Máxima e mínima do dia",
                desc: "Previsão matemática do range de oscilação do mercado, permitindo que você saiba onde o preço tende a exaurir.",
                image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Tendência do dia",
                desc: "Vieses calculados com base em fluxo e volume, indicando se a maior probabilidade estatística é de alta, baixa ou consolidação.",
                image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Stop loss e stop gain",
                desc: "Gerenciamento de risco otimizado para cada cenário, mantendo você fora de violinadas e garantindo alvos matemáticos.",
                image: "https://images.unsplash.com/photo-1560523190-674ca2996d36?auto=format&fit=crop&q=80&w=800"
              }
            ].map((item, i) => (
              <div key={i} className={cn(
                "flex flex-col gap-12 items-center",
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              )}>
                <div className="w-full lg:w-1/2">
                  <div className="glass-card rounded-[2.5rem] border border-white/10 p-2 shadow-2xl relative group overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full aspect-video lg:aspect-4/3 object-cover rounded-[2rem] grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050507] via-transparent to-transparent opacity-60" />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-6 px-6 lg:px-12">
                  <div className="flex items-center gap-4">
                    <span className="text-trading-green font-black text-2xl opacity-20">0{i + 1}</span>
                    <div className="h-[2px] w-12 bg-trading-green/20" />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-tight">{item.title}</h3>
                  <p className="text-zinc-500 font-medium leading-relaxed md:text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 md:py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">TUDO QUE VOCÊ PRECISA EM UM <span className="text-trading-green">LUGAR SÓ</span></h2>
            <p className="text-zinc-500 uppercase font-black text-xs tracking-widest leading-relaxed max-w-2xl mx-auto">A infraestrutura completa para sua evolução no mercado financeiro</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calendar, title: 'Calendário econômico', desc: 'Eventos que impactam o mercado' },
              { icon: Activity, title: 'Dados de mercado em tempo real', desc: 'Preços e volumes atualizados' },
              { icon: Layout, title: 'Gráficos interativos', desc: 'Análise técnica avançada' },
              { icon: Globe, title: 'Notícias em tempo real', desc: 'O que está movendo o mundo' },
              { icon: Monitor, title: 'Aulas operacionais e psicológicas', desc: 'Treinamento completo' },
              { icon: MessageCircle, title: 'Comunidade para networking', desc: 'Troca de experiência real' },
              { icon: Shield, title: 'Suporte e acompanhamento 24/7', desc: 'Acompanhamento total' },
              { icon: RefreshCcw, title: 'Atualizações constantes', desc: 'Sempre à frente do mercado' },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01] hover:border-white/20 transition-all hover:bg-white/[0.02]">
                <feature.icon className="w-8 h-8 text-trading-green mb-6" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2 leading-tight">{feature.title}</h3>
                <p className="text-xs text-zinc-600 font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section id="stats" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-[3rem] p-12 border border-white/5 bg-white/[0.01] text-center grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-4xl md:text-6xl font-black text-trading-green mb-2">87%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Precisão em Regiões de Exaustão</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-black text-white mb-2">24h</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Suporte Especializado na Comunidade</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-black text-trading-green mb-2">+5k</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Traders Quantitativos Conectados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedbacks / Results Carousel -> Now Scrolling Ticker Style */}
      <section id="resultados" className="py-20 md:py-32 overflow-hidden bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Resultados dos <span className="text-trading-green">Membros.</span></h2>
            <p className="text-zinc-500 uppercase font-black text-xs tracking-widest">Feedback de quem confia na gente</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Row 1: Right to Left */}
          <div className="flex select-none">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-6 whitespace-nowrap"
            >
              {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((i, idx) => (
                <div key={idx} className="w-[300px] md:w-[400px]">
                  <div className="glass-card rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.02]">
                    <img 
                      src={`https://picsum.photos/seed/feedback-${i}/800/600`} 
                      alt={`Feedback ${i}`} 
                      className="w-full aspect-4/3 object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                         {Array.from({length: 5}).map((_, j) => <Star key={j} className="w-3 h-3 text-trading-green fill-current" />)}
                      </div>
                      <p className="text-xs font-bold text-zinc-400 italic">"Resultados consistentes e leitura de mercado simplificada!"</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 2: Left to Right */}
          <div className="flex select-none">
            <motion.div 
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-6 whitespace-nowrap"
            >
              {[6, 5, 4, 3, 2, 1, 6, 5, 4, 3, 2, 1].map((i, idx) => (
                <div key={idx} className="w-[300px] md:w-[400px]">
                  <div className="glass-card rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.02]">
                    <img 
                      src={`https://picsum.photos/seed/alt-feedback-${i}/800/600`} 
                      alt={`Feedback ${i}`} 
                      className="w-full aspect-4/3 object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                         {Array.from({length: 5}).map((_, j) => <Star key={j} className="w-3 h-3 text-trading-green fill-current" />)}
                      </div>
                      <p className="text-xs font-bold text-zinc-400 italic">"Garantia de performance com base estatística real."</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Planos e <span className="text-trading-green">Acesso.</span></h2>
            <p className="text-zinc-500 uppercase font-black text-xs tracking-widest">⌛️ Oferta promocional por tempo limitado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {[
              { title: 'Relatório B3', price: '497', monthly: '41', highlight: false, features: ['Regiões para mini dólar', 'Regiões para mini índice', 'Dashboard + indicadores', 'Suporte VIP'] },
              { title: 'B3 + Forex (Elite)', price: '697', monthly: '58', highlight: true, promo: '30% OFF', oldPrice: '997', features: ['Regiões para mini dólar', 'Regiões para mini índice', 'Regiões para Forex', 'Dashboard + indicadores', 'Suporte Ultra-VIP', 'Comunidade Discord', 'Treinamento gravado'] },
              { title: 'Relatório Forex', price: '497', monthly: '41', highlight: false, features: ['Regiões para Forex', 'Dashboard + indicadores', 'Suporte VIP'] },
            ].map((plan, i) => (
              <div key={i} className={cn(
                "glass-card rounded-[2.5rem] p-8 border transition-all relative overflow-hidden flex flex-col",
                plan.highlight 
                ? "border-trading-green/50 bg-trading-green/[0.03] shadow-[0_0_50px_rgba(0,255,157,0.1)] py-12 md:scale-105 z-10" 
                : "border-white/5 bg-white/[0.01] hover:border-white/20 h-auto md:h-[500px]"
              )}>
                {plan.highlight && (
                  <div className="absolute top-0 right-0 px-6 py-2 bg-trading-green text-black text-[10px] font-black uppercase tracking-widest rounded-bl-xl flex flex-col items-center">
                    <span>Melhor Valor</span>
                  </div>
                )}
                <div className="mb-8">
                  <h3 className={cn(
                    "font-black uppercase tracking-tighter mb-4 leading-none",
                    plan.highlight ? "text-2xl" : "text-xl"
                  )}>{plan.title}</h3>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">12x de</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-baseline gap-1">
                        <span className={cn("font-black text-white", plan.highlight ? "text-5xl" : "text-4xl")}>R$ {plan.monthly}</span>
                        <span className="text-zinc-500 font-bold text-xs">/mês</span>
                      </div>
                      {plan.highlight && plan.promo && (
                        <span className="text-2xl md:text-3xl font-black text-trading-green animate-pulse">{plan.promo}</span>
                      )}
                    </div>
                    {'oldPrice' in plan ? (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest line-through">R$ {plan.oldPrice as string}</p>
                        <p className="text-[10px] font-black text-trading-green uppercase tracking-widest">R$ {plan.price} à vista</p>
                      </div>
                    ) : (
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">ou R$ {plan.price} à vista anual</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Check className="w-3 h-3 text-trading-green" />
                      </div>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">{feat}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={onStart}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg",
                    plan.highlight 
                    ? "bg-trading-green text-black shadow-trading-green/20 hover:scale-[1.03]" 
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  )}
                >
                  Teste 7 Dias Grátis
                </button>
                <p className="text-[8px] text-zinc-600 font-bold text-center mt-4 uppercase tracking-widest">Cancelamento a qualquer momento</p>
                <p className="text-[7px] text-trading-green/60 font-black text-center mt-1.5 uppercase tracking-[0.2em] bg-trading-green/5 py-1 rounded-lg">Garantia de 30 dias</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 flex items-center justify-center gap-4">
               Dúvidas <span className="text-trading-green">Frequentes.</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: 'Tem só pra B3 e Forex?', a: 'Por enquanto sim, mas relatórios para ações, cripto, commodities, índices e bolsas globais já estão em desenvolvimento.' },
              { q: 'Posso cancelar minha assinatura a qualquer momento?', a: 'Com certeza. Não temos fidelidade ou multas de cancelamento. Você pode gerenciar seu plano diretamente pelo painel.' },
              { q: 'Qual a assertividade das regiões?', a: 'Nossas regiões tem uma assertividade média de 83 a 87% e um risco retorno de no mínimo 3 pra 1.' },
              { q: 'Quanto de dinheiro preciso para começar?', a: 'Recomendamos 1.000 reais por cada minicontrato, mas esse valor pode reduzir dependendo da condição financeira do trader.' },
            ].map((faq, i) => (
              <div key={i} className="glass-card rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-8 flex items-center justify-between text-left group"
                >
                  <span className="text-sm md:text-base font-black uppercase tracking-tight text-zinc-300 group-hover:text-white transition-colors">{faq.q}</span>
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 transition-all",
                    activeFaq === i ? "bg-trading-green border-trading-green text-black rotate-180" : "bg-white/5 text-zinc-500 hover:border-trading-green/30"
                  )}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 pt-0 text-zinc-500 font-medium leading-relaxed border-t border-white/5 mt-4">
                         {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-32 px-6 relative text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-trading-green/20 blur-[150px] rounded-full -z-10 opacity-30 appearance-none pointer-events-none" />
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-32">
            Pronto para transformar sua operação?
          </h2>
          <button 
            onClick={onStart}
            className="px-16 py-6 bg-white text-black rounded-3xl font-black uppercase text-base tracking-[0.4em] shadow-2xl hover:scale-110 active:scale-95 transition-all"
          >
            ACESSAR AGORA
          </button>
          
          <div className="mt-20 flex items-center justify-center gap-12 grayscale opacity-40">
             <div className="flex items-center gap-2"><Lock className="w-4 h-4"/> <span className="text-[10px] font-black uppercase tracking-widest">Seguro</span></div>
             <div className="flex items-center gap-2"><Globe className="w-4 h-4"/> <span className="text-[10px] font-black uppercase tracking-widest">Global</span></div>
             <div className="flex items-center gap-2"><Zap className="w-4 h-4"/> <span className="text-[10px] font-black uppercase tracking-widest">Rápido</span></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-6 text-center">
           <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 bg-linear-to-br from-trading-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-trading-green/20">
               <Zap className="w-7 h-7 text-black fill-black" />
             </div>
             <span className="text-sm font-black uppercase tracking-[0.3em] text-white">AQUILA QUANT © 2026</span>
           </div>
        </div>
      </footer>

      {/* WhatsApp Fixed Button */}
      <a 
        href="https://wa.me/5500000000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="absolute inset-0 bg-trading-green blur-[20px] opacity-40 group-hover:opacity-60 transition-opacity" />
        <div className="relative w-16 h-16 bg-trading-green text-black rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .011 5.403.01 12.039c0 2.12.54 4.19 1.566 6.04L0 24l6.102-1.6c1.789.976 3.805 1.491 5.942 1.491h.005c6.634 0 12.037-5.403 12.038-12.039a11.841 11.841 0 00-3.528-8.498z"/>
          </svg>
        </div>
      </a>
    </div>
  );
};
