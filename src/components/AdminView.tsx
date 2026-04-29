import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Upload, 
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
  History
} from 'lucide-react';
import { cn } from '../lib/utils';
import { uploadAssetMetrics } from '../lib/quantEngine';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useAdminClients } from '../hooks/useAdminClients';

interface AdminViewProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const AdminView = ({ currentView, onViewChange }: AdminViewProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  // REAL-TIME CRM ENGINE
  const { clients, isLoading: clientsLoading, toggleUserStatus, updateClientTags } = useAdminClients();

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setUploading(true);
    setUploadStatus(null);
    
    try {
      const assetSymbol = getAssetSymbol(currentView);
      
      // 1. Processar e Enviar via Motor Quantitativo
      const result = await uploadAssetMetrics(assetSymbol, file);
      
      console.log(`AQUILA QUANT [Admin]: Processed ${assetSymbol} -> Y: ${result.metrics.y_value}, B: ${result.metrics.mean_b_value}`);

      setUploadStatus({ 
        type: 'success', 
        message: `Métricas de ${assetSymbol} atualizadas com sucesso! O cálculo já está disponível para os clientes.` 
      });
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('AQUILA QUANT [Admin Upload Error]:', errorMessage);
      setUploadStatus({ 
        type: 'error', 
        message: errorMessage.includes('Timeout') 
          ? 'Conexão instável. Tente novamente ou use um arquivo menor.' 
          : errorMessage 
      });
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const getAssetSymbol = (view: string) => {
    switch (view) {
      case 'ADMIN_B3_DOLAR': return 'WDO/DOL';
      case 'ADMIN_B3_INDICE': return 'WIN/IND';
      case 'ADMIN_FOREX_XAU': return 'XAU/USD';
      case 'ADMIN_FOREX_EUR': return 'EUR/USD';
      case 'ADMIN_CRIPTO_BTC': return 'BTC/USD';
      case 'ADMIN_CRIPTO_ETH': return 'ETH/USD';
      case 'ADMIN_CRIPTO_SOL': return 'SOL/USD';
      default: return 'UNKNOWN';
    }
  };

  const getAssetName = (view: string) => {
    switch (view) {
      case 'ADMIN_B3_DOLAR': return 'MINI DÓLAR';
      case 'ADMIN_B3_INDICE': return 'MINI ÍNDICE';
      case 'ADMIN_FOREX_XAU': return 'XAU/USD';
      case 'ADMIN_FOREX_EUR': return 'EUR/USD';
      case 'ADMIN_CRIPTO_BTC': return 'BITCOIN';
      case 'ADMIN_CRIPTO_ETH': return 'ETHEREUM';
      case 'ADMIN_CRIPTO_SOL': return 'SOLANA';
      default: return 'Ativo';
    }
  };

  const renderAssetUpload = () => {
    const assetName = getAssetName(currentView);
    return (
      <div className="p-8 max-w-5xl mx-auto w-full space-y-12">
        <div className="flex items-center justify-between">
           <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Upload de Dados: {assetName}</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Atualização de base de dados quantitativos</p>
           </div>
           <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <Calendar className="w-4 h-4 text-trading-green" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Última Atualização: 22/03/2024</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Upload Zone */}
            <div 
             onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
             onDragLeave={() => setDragActive(false)}
             onDrop={(e) => { 
                e.preventDefault(); 
                setDragActive(false); 
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
             }}
             className={cn(
               "glass-card rounded-[3rem] p-12 border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[400px] relative overflow-hidden",
               dragActive ? "border-trading-green bg-trading-green/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"
             )}
           >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                accept=".csv"
                onChange={onFileChange}
              />

              {uploading && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-trading-green animate-spin mb-4" />
                  <p className="text-white font-black uppercase tracking-widest text-xs">Processando Motor Quantitativo...</p>
                </div>
              )}

              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                 <Upload className={cn("w-10 h-10 transition-colors", dragActive ? "text-trading-green" : "text-zinc-500")} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Arraste sua planilha aqui</h3>
              <p className="text-sm text-zinc-500 max-w-xs mb-8">Formatos suportados: .csv extraído do Investing.com (Preço, Abertura, Máxima, Mínima).</p>
              
              <div className="space-y-4 w-full max-w-xs">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full px-8 py-4 bg-trading-green text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,157,0.2)] disabled:opacity-50 disabled:scale-100"
                >
                   Selecionar Arquivo
                </button>

                {uploadStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 justify-center",
                      uploadStatus.type === 'success' ? "bg-trading-green/10 border-trading-green/20 text-trading-green" : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}
                  >
                    {uploadStatus.type === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {uploadStatus.message}
                  </motion.div>
                )}
              </div>
           </div>

           {/* History / Info */}
           <div className="space-y-6">
              <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 bg-white/[0.01]">
                 <div className="flex items-center gap-3 mb-8">
                    <FileText className="w-5 h-5 text-trading-green" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Arquivo Recente</h3>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-trading-green/10 flex items-center justify-center">
                       <FileText className="w-6 h-6 text-trading-green" />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-white">{assetName.replace('/', '_')}_analysis_data_v2.xlsx</p>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">2.4 MB • 22 Mar 2024, 14:30</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-trading-green" />
                 </div>
              </div>

               <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 bg-white/[0.01]">
                 <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Instruções de Importação</h3>
                 <ul className="space-y-4">
                    {[
                      'O arquivo deve ser .CSV (separado por vírgula ou ponto-e-vírgula).',
                      'Obrigatório conter a coluna "Máxima" (High) e "Mínima" (Low).',
                      'Necessário exatamente 45 dias de histórico para o cálculo do desvio padrão.',
                      'Compatível com exportação direta do Tryd ou Investing.com.'
                    ].map((text, i) => (
                      <li key={i} className="flex gap-3 text-xs text-zinc-500 leading-relaxed font-medium">
                         <span className="text-trading-green font-black">{i + 1}.</span>
                         {text}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderClients = () => {
    return (
      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white font-sans">Gerenciamento de Clientes</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Controle de acessos e monitoramento da plataforma</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-trading-green transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Buscar cliente ou e-mail..." 
                   className="bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-sm font-medium focus:outline-none focus:border-trading-green/50 transition-all w-full md:w-64"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:border-trading-green/30 transition-all">
                 Exportar Base
              </button>
           </div>
        </div>

        <div className="glass-card rounded-[2.5rem] border border-white/5 bg-white/[0.01] overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Cliente</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Plano Ativo</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Último Acesso</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Vencimento</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.02]">
                    {clientsLoading ? (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center">
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
                                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 font-bold overflow-hidden">
                                    {client.avatar_url ? (
                                      <img src={client.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      (client.full_name || client.email)[0].toUpperCase()
                                    )}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-white mb-0.5">{client.full_name || client.email.split('@')[0]}</p>
                                    <p className="text-[10px] text-zinc-500 font-bold">{client.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                 {client.access_tags.length > 0 ? client.access_tags.join(' + ') : 'FREE'}
                              </span>
                           </td>
                           <td className="px-6 py-5 text-xs font-medium text-zinc-500">
                              {new Date(client.updated_at).toLocaleDateString('pt-BR')}
                           </td>
                           <td className="px-6 py-5 text-xs font-medium text-zinc-500">
                              --/--/--
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center justify-center">
                                 {client.is_active !== false ? (
                                    <span className="flex items-center gap-2 px-3 py-1 bg-trading-green/10 text-trading-green border border-trading-green/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                       <CheckCircle2 className="w-3 h-3" /> ATIVO
                                    </span>
                                 ) : (
                                    <span className="flex items-center gap-2 px-3 py-1 bg-trading-red/10 text-trading-red border border-trading-red/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                       <XCircle className="w-3 h-3" /> BLOQUEADO
                                    </span>
                                 )}
                              </div>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <button 
                                   onClick={() => handleToggleStatus(client)}
                                   disabled={isUpdating}
                                   className={cn(
                                     "p-2 transition-all",
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
                                   className="p-2 text-zinc-500 hover:text-white transition-all" 
                                   title="Configurar Acessos"
                                 >
                                    <Key className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => {
                                     setSelectedClient(client);
                                     setIsLogModalOpen(true);
                                   }}
                                   className="p-2 text-zinc-500 hover:text-zinc-300 transition-all" 
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

  const renderDashboard = () => (
    <div className="p-12 flex flex-col items-center justify-center min-h-[600px] text-center">
       <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8">
          <ShieldCheck className="w-12 h-12 text-trading-green" />
       </div>
       <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Painel de Controle Central</h2>
       <p className="text-zinc-500 max-w-md mx-auto leading-relaxed mb-12">
          Bem-vindo à central de administração. Utilize o menu lateral para gerenciar as bases de dados ou monitorar o acesso dos clientes.
       </p>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <div 
             onClick={() => onViewChange('ADMIN_CLIENTS')}
             className="glass-card p-8 border border-white/5 hover:border-trading-green/30 transition-all cursor-pointer group bg-white/[0.01]"
          >
             <Users className="w-8 h-8 text-zinc-500 group-hover:text-trading-green mb-4 transition-colors" />
             <h3 className="text-lg font-black uppercase tracking-tighter text-white">Clientes Ativos</h3>
             <p className="text-2xl font-black text-trading-green mt-2">{clientsLoading ? '...' : clients.length}</p>
          </div>
          <div className="glass-card p-8 border border-white/5 bg-white/[0.01]">
             <FileText className="w-8 h-8 text-zinc-500 mb-4" />
             <h3 className="text-lg font-black uppercase tracking-tighter text-white">Uploads Realizados</h3>
             <p className="text-2xl font-black text-white mt-2">342</p>
          </div>
       </div>
    </div>
  );

  const handleUpdateTags = async (tags: string[]) => {
    if (!selectedClient) return;
    try {
      setIsUpdating(true);
      await updateClientTags(selectedClient.id, tags);
      setIsAccessModalOpen(false);
    } catch (err) {
      alert("Erro ao atualizar tags");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
       {
         currentView === 'ADMIN_CLIENTS' ? renderClients() :
         currentView.startsWith('ADMIN_') ? renderAssetUpload() :
         renderDashboard()
       }

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
                  const currentClient = clients.find(c => c.id === selectedClient.id) || selectedClient;
                  const hasTag = currentClient.access_tags?.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        const currentTags = currentClient.access_tags || [];
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
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tag}</span>
                      {hasTag ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-white/40" />}
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
