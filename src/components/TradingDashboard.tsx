import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Clock,
  RefreshCw,
  Edit3,
  FileUp,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Activity,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';
import { XAUUSDWidgets } from './XAUUSDWidgets';
import { supabase } from '../lib/supabaseClient';
import { roundToHalf } from '../lib/quantEngine';
import { SUPPORTED_ASSETS } from '../constants/assets';

interface TradingDashboardProps {
  assetName: string;
  assetCode: string;
  category: 'B3' | 'FOREX';
}

const mockChartData = [
  { name: '1', a: 40, b: 20 },
  { name: '2', a: 60, b: 10 },
  { name: '3', a: 80, b: -30 },
  { name: '4', a: 65, b: -10 },
  { name: '5', a: 70, b: -5 },
  { name: '6', a: 90, b: 0 },
  { name: '7', a: 85, b: 15 },
  { name: '8', a: 80, b: 40 },
  { name: '9', a: 75, b: 25 },
  { name: '10', a: 70, b: 0 },
  { name: '11', a: 95, b: 20 },
  { name: '12', a: 80, b: -40 },
  { name: '13', a: 110, b: -60 },
  { name: '14', a: 120, b: -80 },
  { name: '15', a: 110, b: -40 },
  { name: '16', a: 130, b: 0 },
  { name: '17', a: 150, b: 20 },
  { name: '18', a: 180, b: -50 },
  { name: '19', a: 220, b: -10 },
  { name: '20', a: 280, b: 30 },
];

const pointsData = [
  { name: '1', value: 318, model: 'A' },
  { name: '2', value: -37, model: 'B' },
];

const assertivenessData = [
  { name: 'A', value: 50 },
  { name: 'B', value: 25 },
];

const rMultiplesData = [
  { name: '1', value: 9.36, model: 'A' },
  { name: '2', value: -7.23, model: 'B' },
];

export const TradingDashboard = ({ assetName, assetCode, category }: TradingDashboardProps) => {
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [opening, setOpening] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [metricsData, setMetricsData] = useState<any>(null);

  // Reset state when asset changes
  React.useEffect(() => {
    setStep('input');
    setOpening('');
    setMetricsData(null);
    setCalcError(null);
    setIsLoading(false); // Garantia de parada de loading na troca de par
  }, [assetCode]);

  const [performanceUnlocked, setPerformanceUnlocked] = useState(false);
  const [randomModel] = useState(Math.random() > 0.5 ? 'A' : 'B');

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(false);
    setIsLoading(true);
    setCalcError(null);

    try {
      // 1. Limpeza e validação do valor de abertura [Elite Standard]
      const cleanInput = (val: string) => {
        let s = val.trim();
        // Lógica B3/Brasil: 4.974,00 -> 4974.00
        if (s.includes(',') && s.includes('.')) {
          return parseFloat(s.replace(/\./g, '').replace(',', '.'));
        }
        if (s.includes(',')) return parseFloat(s.replace(',', '.'));
        // Proteção para valores como 4.974 (onde o ponto é milhar e não decimal)
        if (s.includes('.') && s.length >= 5) {
          return parseFloat(s.replace(/\./g, ''));
        }
        return parseFloat(s);
      };

      const cleanOpening = cleanInput(opening);
      
      if (isNaN(cleanOpening)) {
        throw new Error('O valor de abertura deve ser um número válido (Ex: 4.974,00 ou 5250.50)');
      }

      const normalizedSymbol = assetCode.trim().toUpperCase();

      console.log(`AQUILA QUANT [Calculo]: Processando ${normalizedSymbol}`);

      let finalData = null;

      // 3. TENTATIVA 1: Edge Function com Timeout Agressivo (2.5s)
      try {
        const invokePromise = supabase.functions.invoke('calculate-regions', {
          body: { assetSymbol: normalizedSymbol, abertura: cleanOpening }
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('TIMEOUT')), 5000)
        );

        const response: any = await Promise.race([invokePromise, timeoutPromise]);
        
        if (response && response.data && !response.data.error) {
          finalData = response.data;
        }
      } catch (fError) {
        console.warn('AQUILA QUANT [System]: Edge Function lenta ou inexistente. Usando Fallback de Bancada...');
      }

      // 4. TENTATIVA 2: Fallback Direto via Database (SSOT)
      if (!finalData) {
        // Buscamos metrics tanto pelo simbolo normalizado quanto pelo exato
        const { data: metrics, error: mError } = await supabase
          .from('asset_historical_metrics')
          .select('*')
          .or(`asset_symbol.eq.${normalizedSymbol},asset_symbol.eq.${assetCode}`)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (mError || !metrics) {
          throw new Error('Tente novamente mais tarde');
        }

        const y = metrics.y_value;
        const b = metrics.mean_b_value;
        const o = cleanOpening;

        // Cálculos Quantitativos v5.6 [FIDELIDADE TOTAL AO SCRIPT PYTHON]
        const A = y / 2;
        const B = b;              // B já vem arredondado da Engine
        const C = B / 2;
        const D = B / 10;
        
        const stopLossMin = roundToHalf(D / 2);
        const stopLossMax = stopLossMin * 2;
        const stopGainMin = y / 2;
        const stopGainMax = y;

        // Parse da data sem shift de timezone
        const [yearArr, monthArr, dayArr] = date.split('-').map(Number);
        const displayDate = new Date(yearArr, monthArr - 1, dayArr).toLocaleDateString('pt-BR');

        finalData = {
          asset: normalizedSymbol,
          abertura: o,
          date: displayDate,
          quant_analysis: {
            regions: {
              major_up: [(o + y), (o + (y * 2)), (o + (y * 3)), (o + (y * 4))],
              major_down: [(o - y), (o - (y * 2)), (o - (y * 3)), (o - (y * 4))],
              intermediate_up: [(o + (y * 1.5)), (o + (y * 2.5)), (o + (y * 3.5)), (o + (y * 4.5))],
              intermediate_down: [(o - (y * 1.5)), (o - (y * 2.5)), (o - (y * 3.5)), (o - (y * 4.5))],
            },
            extreme: {
              max: [(o + C), ((o + C) + A)],
              min: [(o - C), ((o - C) - A)]
            },
            frequency: {
              a: y / 2,        // Frequência A (Y/2)
              b: y,            // Volatilidade Y
              mean_b: b,       // Média Estatística B
              f1: metrics.freq_1_value || 0,
              f2: metrics.freq_2_value || 0
            }
          },
          stops: {
            loss: [Math.abs(stopLossMin), Math.abs(stopLossMax)],
            gain: [stopGainMin, stopGainMax]
          }
        };
      }

      setMetricsData(finalData);
      setStep('results');
    } catch (err: any) {
      console.error('AQUILA QUANT [Calculation Error]:', err);
      setCalcError(err.message || 'Erro crítico no processamento.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'input') {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-transparent pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full max-w-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/5 bg-white/[0.01] relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-trading-green/5 blur-[100px] -z-10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-trading-red/5 blur-[100px] -z-10 rounded-full" />

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
               <Activity className="w-8 h-8 text-trading-green" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Configurar {assetName}</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2">Relatório Quantitativo v5.6 [Elite]</p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Data para Cálculo</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="date" 
                  value={date}
                  disabled
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-base md:text-sm font-bold text-white outline-none transition-all uppercase opacity-50 cursor-not-allowed min-h-[44px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Valor de Abertura</label>
                <div className="group relative">
                  <AlertCircle className="w-3.5 h-3.5 text-zinc-500 cursor-help" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                    <p className="text-[9px] font-bold text-zinc-400 leading-relaxed uppercase">
                      Inserir manualmente o valor de abertura garante maior precisão no cálculo das regiões do dia, evitando distorções de feed.
                    </p>
                  </div>
                </div>
              </div>
              <input 
                type="text" 
                value={opening}
                onChange={(e) => setOpening(e.target.value)}
                placeholder="Ex: 5.250,50"
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-base md:text-sm font-bold text-white outline-none focus:ring-1 focus:ring-trading-green/30 transition-all placeholder:text-zinc-700 min-h-[44px]"
                required
                disabled={isLoading}
              />
              {calcError && (
                <div className="flex items-center gap-2 mt-2 px-1 text-trading-red">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-tight">{calcError}</span>
                </div>
              )}
              <div className="p-4 bg-trading-green/5 border border-trading-green/10 rounded-xl mt-4">
                 <p className="text-[9px] font-black text-trading-green uppercase leading-relaxed text-center tracking-widest">
                   Confira bem o valor antes de prosseguir. Ele deve ser referente à abertura oficial do ativo na data escolhida.
                 </p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-trading-green text-black rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-lg shadow-trading-green/10 hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isLoading ? (
                 <>
                   <div className="flex items-center gap-3">
                     Processando... <Loader2 className="w-4 h-4 animate-spin" />
                   </div>
                   <span className="text-[8px] font-bold text-black/60 opacity-0 animate-pulse mt-1" style={{ animationDelay: '3s', animationFillMode: 'forwards' }}>
                     Pode levar alguns segundos...
                   </span>
                 </>
               ) : (
                 <div className="flex items-center gap-3">
                   Calcular Regiões <ChevronRight className="w-4 h-4" />
                 </div>
               )}
            </button>

            {isLoading && (
              <button 
                type="button"
                onClick={() => setIsLoading(false)}
                className="w-full py-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancelar Operação
              </button>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8 max-w-[1600px] mx-auto w-full space-y-6 md:space-y-8 animate-in fade-in duration-700 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      
      {/* Box Superior */}
      <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-trading-green/10 rounded-3xl flex items-center justify-center border border-trading-green/20 relative">
               <Zap className="w-8 h-8 text-trading-green fill-trading-green/20" />
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-trading-green rounded-full shadow-[0_0_10px_rgba(0,255,157,1)]" />
            </div>
            <div className="flex flex-col items-center md:items-start">
               <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                 <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">{assetName}</h2>
                 <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] font-black text-zinc-400">{assetCode}</span>
               </div>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2 md:mt-1">
                 <div className="flex items-center gap-2">
                   <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                   <span className="text-xs font-bold text-zinc-500">{date.split('-').reverse().join('/')}</span>
                 </div>
                 <span className="hidden md:inline text-zinc-700">•</span>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Abertura: <span className="text-white">{opening}</span></p>
               </div>
            </div>
         </div>

         <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button 
              onClick={() => setStep('input')}
              className="w-full sm:w-auto px-5 py-4 md:py-2.5 glass-button rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 min-h-[44px]"
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar Dados
            </button>
            <button className="w-full sm:w-auto px-5 py-4 md:py-2.5 glass-button rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 min-h-[44px]">
              <RefreshCw className="w-3.5 h-3.5" /> Atualizar
            </button>
         </div>
      </div>

      {/* Box Central - Regiões Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Card: Desvio Padrão */}
        <div className="lg:col-span-8 glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 bg-white/[0.01]">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Pontos de reversão (compra/venda)</h3>
              </div>
              {category === 'B3' && (
                <div className="flex items-center gap-6 sm:gap-8">
                   <div className="flex flex-col items-start sm:items-end">
                      <span className="text-[9px] font-black text-zinc-500 uppercase">Gain</span>
                      <span className="text-base md:text-lg font-black text-trading-green leading-none">
                        {metricsData?.quant_analysis?.frequency?.mean_b?.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                      </span>
                   </div>
                   <div className="flex flex-col items-start sm:items-end">
                      <span className="text-[9px] font-black text-zinc-500 uppercase">Loss</span>
                      <span className="text-base md:text-lg font-black text-trading-red leading-none">
                        {metricsData?.quant_analysis?.frequency?.b?.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                      </span>
                   </div>
                </div>
              )}
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {[
                { label: '1.0 Desvio (UP)', val: metricsData?.quant_analysis?.regions?.major_up?.[0], sub: metricsData?.quant_analysis?.regions?.intermediate_up?.[0] },
                { label: '2.0 Desvio (UP)', val: metricsData?.quant_analysis?.regions?.major_up?.[1], sub: metricsData?.quant_analysis?.regions?.intermediate_up?.[1] },
                { label: '3.0 Desvio (UP)', val: metricsData?.quant_analysis?.regions?.major_up?.[2], sub: metricsData?.quant_analysis?.regions?.intermediate_up?.[2] },
                { label: '4.0 Desvio (UP)', val: metricsData?.quant_analysis?.regions?.major_up?.[3], sub: metricsData?.quant_analysis?.regions?.intermediate_up?.[3] },
                { label: '1.0 Desvio (DOWN)', val: metricsData?.quant_analysis?.regions?.major_down?.[0], sub: metricsData?.quant_analysis?.regions?.intermediate_down?.[0] },
                { label: '2.0 Desvio (DOWN)', val: metricsData?.quant_analysis?.regions?.major_down?.[1], sub: metricsData?.quant_analysis?.regions?.intermediate_down?.[1] },
                { label: '3.0 Desvio (DOWN)', val: metricsData?.quant_analysis?.regions?.major_down?.[2], sub: metricsData?.quant_analysis?.regions?.intermediate_down?.[2] },
                { label: '4.0 Desvio (DOWN)', val: metricsData?.quant_analysis?.regions?.major_down?.[3], sub: metricsData?.quant_analysis?.regions?.intermediate_down?.[3] },
              ].map((item, i) => (
                <div key={i} className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5 text-center group hover:border-trading-green/20 transition-all">
                  <p className="text-lg md:text-xl font-black text-white">
                    {item.val?.toLocaleString('pt-BR', { 
                      minimumFractionDigits: 1,
                      maximumFractionDigits: category === 'B3' ? 2 : 5
                    })}
                  </p>
                  <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 mt-1">
                    {item.sub?.toLocaleString('pt-BR', { 
                      minimumFractionDigits: 1,
                      maximumFractionDigits: category === 'B3' ? 2 : 5
                    })}
                  </p>
                </div>
              ))}
           </div>
        </div>

        {/* Right Column: Max/Min & Stats */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           {/* Máxima & Mínima */}
           <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Máxima & Mínima</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-8 px-2">
                 <div className="flex items-center gap-3 md:gap-4">
                    <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-trading-green opacity-20 flex-shrink-0" />
                    <div className="space-y-0.5 md:space-y-1">
                       <p className="text-base md:text-xl font-black text-white leading-none">
                         {metricsData?.quant_analysis?.extreme?.max?.[0]?.toLocaleString('pt-BR', { 
                           minimumFractionDigits: 1, 
                           maximumFractionDigits: category === 'B3' ? 2 : 5 
                         })}
                       </p>
                       <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 leading-none">
                         {metricsData?.quant_analysis?.extreme?.max?.[1]?.toLocaleString('pt-BR', { 
                           minimumFractionDigits: 1, 
                           maximumFractionDigits: category === 'B3' ? 2 : 5 
                         })}
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 md:gap-4">
                    <TrendingDown className="w-8 h-8 md:w-10 md:h-10 text-trading-red opacity-20 flex-shrink-0" />
                    <div className="space-y-0.5 md:space-y-1">
                       <p className="text-base md:text-xl font-black text-white leading-none">
                         {metricsData?.quant_analysis?.extreme?.min?.[0]?.toLocaleString('pt-BR', { 
                           minimumFractionDigits: 1, 
                           maximumFractionDigits: category === 'B3' ? 2 : 5 
                         })}
                       </p>
                       <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 leading-none">
                         {metricsData?.quant_analysis?.extreme?.min?.[1]?.toLocaleString('pt-BR', { 
                           minimumFractionDigits: 1, 
                           maximumFractionDigits: category === 'B3' ? 2 : 5 
                         })}
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Frequência Estatística (B3) ou Gain/Loss (Forex) */}
           {category === 'B3' ? (
             <div className="flex-1 glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Frequência Estatística</h3>
                </div>
                <div className="flex items-center justify-around gap-4">
                   <div className="text-center">
                      <p className="text-3xl md:text-4xl font-black text-white">
                        {(metricsData?.quant_analysis?.frequency?.f1 || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                      </p>
                      <p className="text-[10px] font-black text-trading-green uppercase mt-1">Região 1</p>
                   </div>
                   <div className="text-center">
                      <p className="text-3xl md:text-4xl font-black text-white">
                        {(metricsData?.quant_analysis?.frequency?.f2 || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                      </p>
                      <p className="text-[10px] font-black text-trading-green uppercase mt-1">Região 2</p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex-1 glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 bg-trading-green rounded-full shadow-[0_0_8px_rgba(0,255,157,0.6)]" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Gain & Loss Máximo</h3>
                </div>
                <div className="flex items-center justify-around gap-4">
                   <div className="text-center">
                      <p className="text-2xl md:text-3xl font-black text-trading-green">
                        {metricsData?.stops?.gain?.[1]?.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                      </p>
                      <p className="text-[9px] font-black text-zinc-600 uppercase mt-1">Gain Máximo</p>
                   </div>
                   <div className="w-px h-12 bg-white/5" />
                   <div className="text-center">
                      <p className="text-2xl md:text-3xl font-black text-trading-red">
                        {metricsData?.stops?.loss?.[1]?.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                      </p>
                      <p className="text-[9px] font-black text-zinc-600 uppercase mt-1">Loss Máximo</p>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>

      {/* Box Inferior - Performance */}
      <div className="relative">
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 transition-all duration-700",
          !performanceUnlocked ? "blur-sm opacity-50 grayscale select-none pointer-events-none" : "opacity-100 grayscale-0"
        )}>
           {/* Chart: Model A vs B Line */}
           <div className="lg:col-span-8 glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/5 bg-white/[0.01]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                 <h3 className="text-sm font-black uppercase tracking-widest text-white">Performance do modelo A x B</h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-1 bg-trading-green rounded-full" />
                       <span className="text-[9px] font-black uppercase text-zinc-500">Modelo A</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-1 bg-blue-500 rounded-full" />
                       <span className="text-[9px] font-black uppercase text-zinc-500">Modelo B</span>
                    </div>
                 </div>
              </div>
              <div className="h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceUnlocked ? mockChartData : []}>
                    <defs>
                      <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                    <XAxis dataKey="name" fontSize={9} fontWeight="bold" stroke="#ffffff20" axisLine={false} tickLine={false} />
                    <YAxis fontSize={9} fontWeight="bold" stroke="#ffffff20" axisLine={false} tickLine={false} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="a" stroke="#00ff9d" strokeWidth={3} fillOpacity={1} fill="url(#colorA)" />
                    <Area type="monotone" dataKey="b" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorB)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="lg:col-span-4 grid grid-cols-1 xs:grid-cols-2 gap-4 md:gap-6">
              {/* Pontos */}
              <div className="glass-card rounded-[2rem] p-6 border border-white/5 bg-white/[0.01] flex flex-col">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 text-center">Pontos Acumulados</h4>
                 <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pointsData}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                           {pointsData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.model === 'A' ? '#00ff9d' : '#3b82f6'} />
                           ))}
                        </Bar>
                        <XAxis dataKey="model" hide />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex justify-around mt-4">
                    <div className="text-center">
                       <p className="text-xs font-black text-trading-green">318</p>
                       <p className="text-[8px] font-black uppercase text-zinc-600">A</p>
                    </div>
                    <div className="text-center">
                       <p className="text-xs font-black text-trading-red">-37</p>
                       <p className="text-[8px] font-black uppercase text-zinc-600">B</p>
                    </div>
                 </div>
              </div>

              {/* Assertividade */}
              <div className="glass-card rounded-[2rem] p-6 border border-white/5 bg-white/[0.01] flex flex-col">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 text-center">Assertividade</h4>
                 <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assertivenessData}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                           {assertivenessData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.name === 'A' ? '#00ff9d' : '#3b82f6'} />
                           ))}
                        </Bar>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex justify-around mt-4">
                    <span className="text-xs font-black text-trading-green">50%</span>
                    <span className="text-xs font-black text-blue-500">25%</span>
                 </div>
              </div>

              {/* R-Múltiplos */}
              <div className="glass-card rounded-[2rem] p-6 border border-white/5 bg-white/[0.01] flex flex-col">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 text-center">R-Múltiplos</h4>
                 <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rMultiplesData}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                           {rMultiplesData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.model === 'A' ? '#00ff9d' : '#3b82f6'} />
                           ))}
                        </Bar>
                        <XAxis dataKey="model" hide />
                        <YAxis hide />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex justify-around mt-4">
                    <span className="text-xs font-black text-trading-green">9.36</span>
                    <span className="text-xs font-black text-trading-red">-7.23</span>
                 </div>
              </div>

              <div className="glass-card rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center group transition-all">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center mb-3 border shadow-lg bg-white/5 border-white/10 group-hover:border-trading-green/30 transition-colors">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-trading-green" />
                 </div>
                 <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Cenário Provável</p>
                 <h5 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-trading-green">
                   MODELO {randomModel}
                 </h5>
              </div>
           </div>
        </div>

        {/* Lock Overlay */}
        {!performanceUnlocked && (
          <div 
            onClick={() => setPerformanceUnlocked(true)}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer group p-4"
          >
             <div className="glass-card p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white/10 bg-white/[0.05] backdrop-blur-3xl flex flex-col items-center gap-6 group-hover:scale-105 transition-all duration-500 shadow-2xl w-full max-w-sm">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-trading-green/30 transition-colors">
                   <FileUp className="w-6 h-6 md:w-8 md:h-8 text-trading-green" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-white">Liberar Performance</h3>
                  <p className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2 px-4 leading-relaxed">Faça o upload da planilha para calcular os dados ao vivo</p>
                </div>
                <button className="w-full px-8 py-4 bg-trading-green text-black rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-trading-green/20 active:scale-95 transition-all min-h-[44px]">
                  Upload Planilha (.xlsx)
                </button>
             </div>
          </div>
        )}
      </div>

      {/* TradingView Widgets for Assets with specific TV Symbols */}
      {(() => {
        const asset = SUPPORTED_ASSETS.find(a => a.symbol === assetCode);
        if (asset && asset.tradingViewSymbol && (asset.type === 'Forex' || asset.type === 'B3')) {
          return <XAUUSDWidgets symbol={asset.tradingViewSymbol} />;
        }
        return null;
      })()}

    </div>
  );
};
