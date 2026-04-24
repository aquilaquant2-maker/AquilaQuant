import React, { useState } from 'react';
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
  Key
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminViewProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const mockClients = [
  { id: 1, name: 'Raven Welch', email: 'raven@example.com', plan: 'All-Access', status: 'Active', lastAccess: '2024-03-20', expiresAt: '2024-04-13' },
  { id: 2, name: 'Gabriel Goce', email: 'gabriel@example.com', plan: 'B3 + Forex', status: 'Active', lastAccess: '2024-03-21', expiresAt: '2025-01-10' },
  { id: 3, name: 'Lucas Silva', email: 'lucas@example.com', plan: 'Forex', status: 'Inactive', lastAccess: '2024-02-15', expiresAt: '2024-02-15' },
  { id: 4, name: 'Maria Santos', email: 'maria@example.com', plan: 'Cripto', status: 'Active', lastAccess: '2024-03-19', expiresAt: '2024-05-22' },
];

export const AdminView = ({ currentView, onViewChange }: AdminViewProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
             onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
             className={cn(
               "glass-card rounded-[3rem] p-12 border-2 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[400px]",
               dragActive ? "border-trading-green bg-trading-green/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"
             )}
           >
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                 <Upload className={cn("w-10 h-10 transition-colors", dragActive ? "text-trading-green" : "text-zinc-500")} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Arraste sua planilha aqui</h3>
              <p className="text-sm text-zinc-500 max-w-xs mb-8">Formatos suportados: .csv, .xlsx, .json. Certifique-se de que os dados seguem o padrão do modelo.</p>
              <button className="px-8 py-4 bg-trading-green text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,157,0.2)]">
                 Selecionar Arquivo
              </button>
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
                      'A coluna "Data" deve estar no formato YYYY-MM-DD.',
                      'A coluna "Abertura" deve conter valores numéricos.',
                      'Não deixe campos vazios na planilha.',
                      'O limite de linhas por upload é de 50.000.'
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
                    {mockClients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase())).map(client => (
                       <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 font-bold">
                                   {client.name[0]}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-white mb-0.5">{client.name}</p>
                                   <p className="text-[10px] text-zinc-500 font-bold">{client.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                {client.plan}
                             </span>
                          </td>
                          <td className="px-6 py-5 text-xs font-medium text-zinc-500">
                             {client.lastAccess}
                          </td>
                          <td className="px-6 py-5 text-xs font-medium text-zinc-500">
                             {client.expiresAt}
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex items-center justify-center">
                                {client.status === 'Active' ? (
                                   <span className="flex items-center gap-2 px-3 py-1 bg-trading-green/10 text-trading-green border border-trading-green/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                      <CheckCircle2 className="w-3 h-3" /> ATIVO
                                   </span>
                                ) : (
                                   <span className="flex items-center gap-2 px-3 py-1 bg-trading-red/10 text-trading-red border border-trading-red/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                      <XCircle className="w-3 h-3" /> INATIVO
                                   </span>
                                )}
                             </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button className="p-2 text-zinc-500 hover:text-trading-green transition-all" title="Reenviar Senha">
                                   <Key className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-zinc-500 hover:text-white transition-all" title="Editar Acesso">
                                   <ShieldCheck className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-zinc-500 hover:text-trading-red transition-all" title="Remover Acesso">
                                   <Trash2 className="w-4 h-4" />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
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
             <p className="text-2xl font-black text-trading-green mt-2">1,248</p>
          </div>
          <div className="glass-card p-8 border border-white/5 bg-white/[0.01]">
             <FileText className="w-8 h-8 text-zinc-500 mb-4" />
             <h3 className="text-lg font-black uppercase tracking-tighter text-white">Uploads Realizados</h3>
             <p className="text-2xl font-black text-white mt-2">342</p>
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
       {
         currentView === 'ADMIN_CLIENTS' ? renderClients() :
         currentView.startsWith('ADMIN_') ? renderAssetUpload() :
         renderDashboard()
       }
    </div>
  );
};
