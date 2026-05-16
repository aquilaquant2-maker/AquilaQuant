import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FileText, 
  Calendar, 
  Mail, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Key,
  Loader2,
  X,
  History,
  BarChart3,
  Save,
  Activity,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { uploadAssetMetrics, saveManualAssetMetrics, getAllAssetMetrics } from '../lib/quantEngine';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useAdminClients } from '../hooks/useAdminClients';
import { SUPPORTED_ASSETS } from '../constants/assets';
import { ChangelogAdminPanel } from './ChangelogAdminPanel';
import { ChangelogPost } from '../types/changelog';

interface AdminViewProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const AdminView = ({ currentView, onViewChange }: AdminViewProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string, asset?: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  // REAL-TIME CRM ENGINE
  const { clients, isLoading: clientsLoading, toggleUserStatus, updateClientTags } = useAdminClients();

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [savingPair, setSavingPair] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'CLIENTS' | 'PAIRS' | 'CHANGELOG'>(
    currentView === 'ADMIN_CHANGELOG' ? 'CHANGELOG' : 
    currentView === 'ADMIN_PAIRS' ? 'PAIRS' : 'CLIENTS'
  );

  React.useEffect(() => {
    if (currentView === 'ADMIN_CHANGELOG') setActiveTab('CHANGELOG');
    if (currentView === 'ADMIN_PAIRS') setActiveTab('PAIRS');
    if (currentView === 'ADMIN_CLIENTS') setActiveTab('CLIENTS');
  }, [currentView]);

  // CHANGELOG STATE
  const [changelogs, setChangelogs] = useState<ChangelogPost[]>([]);
  const [loadingChangelog, setLoadingChangelog] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'CHANGELOG') {
      fetchChangelogs();
    }
  }, [activeTab]);

  const fetchChangelogs = async () => {
    setLoadingChangelog(true);
    try {
      const { data, error } = await supabase
        .from('changelog')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setChangelogs(data || []);
    } catch (error) {
      console.error('Erro ao buscar changelogs:', error);
    } finally {
      setLoadingChangelog(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteChangelog = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    
    try {
      console.log('Tentando excluir changelog:', id);
      const { error } = await supabase
        .from('changelog')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro Supabase ao excluir:', error);
        throw error;
      }
      
      console.log('Changelog excluído com sucesso');
      setChangelogs(prev => prev.filter(c => c.id !== id));
    } catch (error: any) {
      console.error('Erro na função deleteChangelog:', error);
      alert(`Erro ao excluir: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setDeletingId(null);
    }
  };

  // PAIRS ENGINE
  const [assetMetrics, setAssetMetrics] = useState<any[]>([]);
  const [isMetricsLoading, setIsMetricsLoading] = useState(false);
  const [manualValues, setManualValues] = useState<Record<string, { b: string, y: string, f1: string, f2: string }>>({});

  React.useEffect(() => {
    if (currentView === 'ADMIN_PAIRS') {
      fetchMetrics();
    }
  }, [currentView]);

  const fetchMetrics = async () => {
    setIsMetricsLoading(true);
    try {
      const data = await getAllAssetMetrics();
      setAssetMetrics(data);
      
      const initialManual: Record<string, { b: string, y: string, f1: string, f2: string }> = {};
      data.forEach((m: any) => {
        initialManual[m.asset_symbol] = {
          b: m.mean_b_value.toString(),
          y: m.y_value.toString(),
          f1: (m.freq_1_value || 0).toString(),
          f2: (m.freq_2_value || 0).toString()
        };
      });
      
      // Preencher ativos suportados que não têm dados ainda
      SUPPORTED_ASSETS.forEach(asset => {
        if (!initialManual[asset.symbol]) {
          initialManual[asset.symbol] = { b: '', y: '', f1: '', f2: '' };
        }
      });

      setManualValues(initialManual);
    } catch (error) {
      console.error("Erro ao buscar métricas:", error);
    } finally {
      setIsMetricsLoading(false);
    }
  };

  const handleManualSave = async (symbol: string) => {
    const vals = manualValues[symbol];
    if (!vals || vals.b === '' || vals.y === '') {
      setUploadStatus({ type: 'error', message: 'Preencha B e Y antes de salvar.', asset: symbol });
      return;
    }

    setIsUpdating(true);
    setSavingPair(symbol);
    setUploadStatus(null);

    try {
      await saveManualAssetMetrics(
        symbol, 
        parseFloat(vals.y.replace(',', '.')), 
        parseFloat(vals.b.replace(',', '.')),
        vals.f1 ? parseFloat(vals.f1.replace(',', '.')) : 0,
        vals.f2 ? parseFloat(vals.f2.replace(',', '.')) : 0
      );
      setUploadStatus({ type: 'success', message: 'Ready!', asset: symbol });
      fetchMetrics();
    } catch (err: any) {
      setUploadStatus({ type: 'error', message: 'Error', asset: symbol });
    } finally {
      setIsUpdating(false);
      setSavingPair(null);
    }
  };

  const handleToggleStatus = async (client: any) => {
    try {
      setIsUpdating(true);
      await toggleUserStatus(client.id, client.is_active !== false);
    } catch (err) {
      alert("Erro ao atualizar status");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderPairs = () => {
    return (
      <div className="p-8 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
           <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white font-sans text-trading-green">Quantitative Terminal</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Gestão de Volatilidade e Médias Móveis</p>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={fetchMetrics}
                disabled={isMetricsLoading}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-trading-green/30 transition-all flex items-center gap-2 hover:bg-white/10"
              >
                {isMetricsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3 text-trading-green" />}
                Sync Engine
              </button>
           </div>
        </div>

        <div className="glass-card rounded-[2.5rem] border border-white/5 bg-white/[0.01] overflow-hidden shadow-2xl">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Ativo / Par</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Tipo</th>
                       <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">B (Média)</th>
                       <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Y (Volatilidade)</th>
                       <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">F1 (Freq)</th>
                       <th className="px-4 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">F2 (Freq)</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center whitespace-nowrap">Última Att</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Ação</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.02]">
                    {SUPPORTED_ASSETS.map((asset) => {
                      const values = manualValues[asset.symbol] || { b: '', y: '', f1: '', f2: '' };
                      const status = uploadStatus?.asset === asset.symbol ? uploadStatus : null;
                      const isB3 = asset.type === 'B3';
                      const metric = assetMetrics.find(m => m.asset_symbol === asset.symbol);
                      
                      return (
                        <tr key={asset.symbol} className="hover:bg-white/[0.02] transition-colors group">
                           <td className="px-8 py-5">
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-white group-hover:text-trading-green transition-colors">{asset.symbol}</span>
                                 <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{asset.name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <span className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                 {asset.type}
                              </span>
                           </td>
                           <td className="px-4 py-5">
                              <div className="flex justify-center">
                                 <input 
                                   type="text" 
                                   value={values.b}
                                   onChange={(e) => setManualValues(prev => ({ 
                                     ...prev, 
                                     [asset.symbol]: { ...prev[asset.symbol], b: e.target.value } 
                                   }))}
                                   placeholder="0.00"
                                   className="w-20 bg-[#0a0a0c] border border-white/10 rounded-lg px-2 py-2 text-xs font-black text-center text-white focus:outline-none focus:border-trading-green/50 transition-all shadow-inner"
                                 />
                              </div>
                           </td>
                           <td className="px-4 py-5">
                              <div className="flex justify-center">
                                 <input 
                                   type="text" 
                                   value={values.y}
                                   onChange={(e) => setManualValues(prev => ({ 
                                     ...prev, 
                                     [asset.symbol]: { ...prev[asset.symbol], y: e.target.value } 
                                   }))}
                                   placeholder="0.00"
                                   className="w-20 bg-[#0a0a0c] border border-white/10 rounded-lg px-2 py-2 text-xs font-black text-center text-white focus:outline-none focus:border-trading-green/50 transition-all shadow-inner"
                                 />
                              </div>
                           </td>
                           <td className="px-4 py-5">
                              <div className="flex justify-center">
                                 <input 
                                   type="text" 
                                   value={values.f1}
                                   onChange={(e) => setManualValues(prev => ({ 
                                     ...prev, 
                                     [asset.symbol]: { ...prev[asset.symbol], f1: e.target.value } 
                                   }))}
                                   placeholder="0.0"
                                   disabled={!isB3}
                                   className={cn(
                                     "w-16 bg-[#0a0a0c] border border-white/10 rounded-lg px-2 py-2 text-xs font-black text-center text-white focus:outline-none focus:border-trading-green/50 transition-all shadow-inner disabled:opacity-20 disabled:cursor-not-allowed"
                                   )}
                                 />
                              </div>
                           </td>
                           <td className="px-4 py-5">
                              <div className="flex justify-center">
                                 <input 
                                   type="text" 
                                   value={values.f2}
                                   onChange={(e) => setManualValues(prev => ({ 
                                     ...prev, 
                                     [asset.symbol]: { ...prev[asset.symbol], f2: e.target.value } 
                                   }))}
                                   placeholder="0.0"
                                   disabled={!isB3}
                                   className={cn(
                                     "w-16 bg-[#0a0a0c] border border-white/10 rounded-lg px-2 py-2 text-xs font-black text-center text-white focus:outline-none focus:border-trading-green/50 transition-all shadow-inner disabled:opacity-20 disabled:cursor-not-allowed"
                                   )}
                                 />
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex flex-col items-center gap-0.5 min-w-[80px]">
                                 {metric?.updated_at ? (
                                   <>
                                     <span className="text-[10px] font-black text-white leading-none">
                                       {new Date(metric.updated_at).toLocaleDateString('pt-BR')}
                                     </span>
                                     <span className="text-[8px] font-bold text-zinc-600 uppercase">
                                       {new Date(metric.updated_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                     </span>
                                   </>
                                 ) : (
                                   <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">---</span>
                                 )}
                              </div>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <div className="flex flex-col items-end gap-1">
                                <button 
                                  onClick={() => handleManualSave(asset.symbol)}
                                  disabled={isUpdating}
                                  className={cn(
                                    "px-6 py-2 font-black text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-xl active:scale-95 disabled:opacity-50",
                                    status?.type === 'success' ? "bg-trading-green text-black" : "bg-white text-black hover:bg-trading-green"
                                  )}
                                >
                                   {savingPair === asset.symbol ? (
                                     <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                   ) : status?.type === 'success' ? (
                                     'DONE'
                                   ) : (
                                     'SAVE'
                                   )}
                                </button>
                                {status && (
                                  <span className={cn(
                                    "text-[8px] font-black uppercase tracking-tight",
                                    status.type === 'success' ? "text-trading-green" : "text-red-500"
                                  )}>
                                    {status.message}
                                  </span>
                                )}
                              </div>
                           </td>
                        </tr>
                      );
                    })}
                  </tbody>
               </table>
           </div>
        </div>

        <div className="bg-trading-green/5 border border-trading-green/20 rounded-2xl p-6">
           <div className="flex gap-4">
              <div className="p-3 bg-trading-green/10 rounded-xl text-trading-green shrink-0">
                 <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="text-sm font-black uppercase tracking-tighter text-white mb-2">Protocolo Aquila Quant V5.0</h4>
                 <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Os valores de B (Média) e Y (Volatilidade) devem ser inseridos manualmente conforme o processamento quantitativo dos últimos 45 dias de pregão. O arredondamento deve seguir o padrão fixo em unidades de 0.5 (MARRED).
                 </p>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderClients = () => {
    return (
      <div className="p-8 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
           <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white font-sans">Gestão de Clientes</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Monitoramento de acesso e permissões</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-trading-green transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Filtrar por nome ou e-mail..." 
                   className="bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-sm font-medium focus:outline-none focus:border-trading-green/50 transition-all w-full md:w-64"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>
        </div>

        <div className="glass-card rounded-[2.5rem] border border-white/5 bg-white/[0.01] overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Cliente</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Plano</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Atividade</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Controle</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.02]">
                    {clientsLoading ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                          <Loader2 className="w-12 h-12 text-trading-green animate-spin mx-auto mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Sincronizando Base de Clientes...</p>
                        </td>
                      </tr>
                    ) : (
                      clients
                        .filter(c => 
                          (c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map(client => (
                        <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 font-bold overflow-hidden ring-2 ring-white/5">
                                    {client.avatar_url ? (
                                      <img src={client.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      (client.full_name || client.email)[0].toUpperCase()
                                    )}
                                 </div>
                                 <div className="max-w-[200px]">
                                    <p className="text-sm font-bold text-white truncate">{client.full_name || client.email.split('@')[0]}</p>
                                    <p className="text-[10px] text-zinc-500 font-bold truncate tracking-tight">{client.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <span className={cn(
                                "px-3 py-1 border rounded-full text-[9px] font-black uppercase tracking-widest",
                                client.access_tags.length > 0 ? "bg-trading-green/10 border-trading-green/30 text-trading-green" : "bg-white/5 border-white/10 text-zinc-500"
                              )}>
                                 {client.access_tags.length > 0 ? client.access_tags.join(' • ') : 'FREE'}
                              </span>
                           </td>
                           <td className="px-6 py-5">
                             <div className="flex flex-col gap-0.5">
                               <span className="text-[10px] font-bold text-zinc-400">{new Date(client.updated_at).toLocaleDateString('pt-BR')}</span>
                               <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Último Acesso</span>
                             </div>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center justify-center">
                                 {client.is_active !== false ? (
                                    <span className="flex items-center gap-2 px-3 py-1 bg-trading-green/10 text-trading-green border border-trading-green/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                       ATIVO
                                    </span>
                                 ) : (
                                    <span className="flex items-center gap-2 px-3 py-1 bg-trading-red/10 text-trading-red border border-trading-red/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                       BLOQUEADO
                                    </span>
                                 )}
                              </div>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2 translate-x-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                 <button 
                                   onClick={() => handleToggleStatus(client)}
                                   disabled={isUpdating}
                                   className={cn(
                                     "p-2 transition-all rounded-lg hover:bg-white/5",
                                     client.is_active !== false ? "text-zinc-500 hover:text-trading-red" : "text-trading-green hover:brightness-110"
                                   )} 
                                   title={client.is_active !== false ? "Bloquear Usuário" : "Ativar Usuário"}
                                 >
                                    {client.is_active !== false ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                 </button>
                                 <button 
                                   onClick={() => {
                                     setSelectedClient(client);
                                     setIsAccessModalOpen(true);
                                   }}
                                   className="p-2 text-zinc-500 hover:text-white transition-all rounded-lg hover:bg-white/5" 
                                   title="Configurar Acessos"
                                 >
                                    <Key className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => {
                                     setSelectedClient(client);
                                     setIsLogModalOpen(true);
                                   }}
                                   className="p-2 text-zinc-500 hover:text-zinc-300 transition-all rounded-lg hover:bg-white/5" 
                                   title="Ver Log de Atividades"
                                 >
                                    <FileText className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))
                    )}
                  </tbody>
               </table>
           </div>
        </div>
      </div>
    );
  };

  const handleUpdateTags = async (tags: string[]) => {
    if (!selectedClient) return;
    try {
      setIsUpdating(true);
      await updateClientTags(selectedClient.id, tags);
      // Mantemos o modal aberto para permitir múltiplas seleções
    } catch (err) {
      alert("Erro ao atualizar tags");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderChangelog = () => {
    return (
      <div className="p-8 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
           <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white font-sans">Atualizações</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Comunicados e Release Notes</p>
           </div>
           
           <button 
             onClick={() => setIsChangelogModalOpen(true)}
             className="px-6 py-3 bg-trading-green text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.2)]"
           >
             <Plus className="w-4 h-4" />
             Nova Atualização
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingChangelog ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
              <Loader2 className="w-10 h-10 text-trading-green animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 font-sans">Carregando Histórico...</p>
            </div>
          ) : changelogs.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl">
              <History className="w-10 h-10 text-zinc-700 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 font-sans">Nenhuma atualização publicada ainda</p>
            </div>
          ) : (
            changelogs.map(post => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-[#0a0a0c] border border-white/5 rounded-2xl overflow-hidden hover:border-trading-green/30 transition-all duration-500"
              >
                {post.image_url && (
                  <div className="aspect-video w-full overflow-hidden border-b border-white/5">
                    <img src={post.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2 py-0.5 bg-trading-green/10 border border-trading-green/20 rounded text-[8px] font-black text-trading-green uppercase tracking-widest">
                      {post.category}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight mb-2 truncate group-hover:text-trading-green transition-colors">{post.title}</h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mb-6 font-medium leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center justify-end pt-4 border-t border-white/5">
                    <button 
                      onClick={() => deleteChangelog(post.id)}
                      disabled={deletingId === post.id}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        deletingId === post.id 
                          ? "bg-white/5 text-zinc-500 cursor-wait" 
                          : "text-zinc-700 hover:text-red-500 hover:bg-red-500/10"
                      )}
                    >
                      {deletingId === post.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {isChangelogModalOpen && (
          <ChangelogAdminPanel 
            onClose={() => setIsChangelogModalOpen(false)}
            onSuccess={fetchChangelogs}
          />
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'CLIENTS': return renderClients();
      case 'PAIRS': return renderPairs();
      case 'CHANGELOG': return renderChangelog();
      default: return renderClients();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#050507]">
      {/* Top Admin Navigation */}
      <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 px-8 pt-6">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => { setActiveTab('CLIENTS'); onViewChange('ADMIN_CLIENTS'); }}
            className={cn(
              "px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all",
              activeTab === 'CLIENTS' ? "text-trading-green" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Clientes
            {activeTab === 'CLIENTS' && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-trading-green shadow-[0_0_15px_rgba(0,255,157,0.5)]" />
            )}
          </button>
          <button 
            onClick={() => { setActiveTab('PAIRS'); onViewChange('ADMIN_PAIRS'); }}
            className={cn(
              "px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all",
              activeTab === 'PAIRS' ? "text-trading-green" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Pares
            {activeTab === 'PAIRS' && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-trading-green shadow-[0_0_15px_rgba(0,255,157,0.5)]" />
            )}
          </button>
          <button 
            onClick={() => { setActiveTab('CHANGELOG'); onViewChange('ADMIN_CHANGELOG'); }}
            className={cn(
              "px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all",
              activeTab === 'CHANGELOG' ? "text-trading-green" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Atualizações
            {activeTab === 'CHANGELOG' && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-trading-green shadow-[0_0_15px_rgba(0,255,157,0.5)]" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {renderContent()}
      </div>

      {/* MODAL: CONFIGURAÇÃO DE ACESSOS */}
      <AnimatePresence>
        {isAccessModalOpen && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAccessModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-card p-8 border border-white/10 bg-[#0a0a0c] overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white mb-1">Configurar Acessos</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{selectedClient.email}</p>
                </div>
                <button onClick={() => setIsAccessModalOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                {['B3', 'Forex', 'Cripto', 'All_Access'].map(tag => {
                  const currentClientInList = clients.find(c => c.id === selectedClient.id);
                  const currentTags = currentClientInList?.access_tags || selectedClient.access_tags || [];
                  const hasTag = currentTags.includes(tag);
                  
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        const newTags = hasTag 
                          ? currentTags.filter((t: string) => t !== tag)
                          : [...currentTags, tag];
                        handleUpdateTags(newTags);
                      }}
                      disabled={isUpdating}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border transition-all group",
                        hasTag 
                          ? "bg-trading-green/10 border-trading-green/30 text-trading-green" 
                          : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          hasTag ? "bg-trading-green shadow-[0_0_8px_rgba(0,255,157,0.5)]" : "bg-zinc-800"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tag.replace('_', ' ')}</span>
                      </div>
                      
                      {isUpdating && hasTag ? (
                        <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                      ) : hasTag ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-white/40" />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[9px] text-center text-zinc-600 font-bold uppercase tracking-widest">
                Mudanças são aplicadas instantaneamente via Realtime.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: LOG DE ATIVIDADES */}
      <AnimatePresence>
        {isLogModalOpen && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-card p-8 border border-white/10 bg-[#0a0a0c] flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <History className="w-5 h-5 text-trading-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white mb-1">Log de Atividades</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{selectedClient.full_name || selectedClient.email}</p>
                  </div>
                </div>
                <button onClick={() => setIsLogModalOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-trading-green" />
                      <div>
                        <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">Acesso ao Painel Realizado</p>
                        <p className="text-[9px] text-zinc-600 font-bold">IP: 189.12.{i}.244 • Navegador: Chrome/macOS</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-zinc-500 whitespace-nowrap">Há {i * 2} horas</span>
                  </div>
                ))}
                <div className="p-12 text-center">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Fim do Histórico Recente</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
