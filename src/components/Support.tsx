import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  FileUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    question: "Como configurar minha API da B3?",
    answer: "Para configurar sua API da B3, acesse as configurações da corretora em seu terminal, gere a chave de acesso e insira no campo 'API Key' na seção Mini Dólar/Índice."
  },
  {
    question: "Quanto tempo demora o saque de lucros?",
    answer: "Os saques são processados em até 24 horas úteis por nossa equipe de conformidade."
  },
  {
    question: "Onde vejo meu histórico de performance?",
    answer: "Seu histórico completo pode ser encontrado na aba 'Performance' no menu lateral esquerdo."
  },
  {
    question: "Posso usar a plataforma em mais de um dispositivo?",
    answer: "Sim, sua conta AQUILA QUANT permite login simultâneo em até 2 dispositivos (Desktop e Mobile)."
  }
];

export const SupportView = () => {
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-8 max-w-[1400px] mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-8">
          <div className="glass-card rounded-3xl p-8 border border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-trading-red/20 flex items-center justify-center border border-trading-red/30">
                <HelpCircle className="w-6 h-6 text-trading-red" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Abrir Ticket de Suporte</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Nossa equipe responderá em breve</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Raven Welch"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-trading-red/30 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">E-mail para Contato</label>
                  <input 
                    type="email" 
                    placeholder="seu@email.com"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-trading-red/30 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Assunto do Ticket</label>
                <input 
                  type="text" 
                  placeholder="Resuma o problema em poucas palavras"
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-trading-red/30 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Descrição Detalhada</label>
                <textarea 
                  rows={5}
                  placeholder="Descreva o que está acontecendo..."
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-trading-red/30 outline-none transition-all resize-none"
                />
              </div>

              <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-4 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileUp className="w-6 h-6 text-zinc-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">
                  Clique ou arraste para subir prints do problema <br/>
                  <span className="text-zinc-600">(Máx 5MB • JPG, PNG)</span>
                </p>
              </div>

              <button className="w-full py-4 bg-trading-red text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-lg shadow-trading-red/10 hover:scale-[1.01] transition-transform flex items-center justify-center gap-3">
                <Send className="w-4 h-4" /> Enviar Ticket
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Alert & FAQ */}
        <div className="lg:col-span-5 space-y-8">
          {/* Business Hours Info */}
          <div className="glass-card rounded-3xl p-8 border border-white/5 bg-linear-to-br from-trading-red/10 to-transparent">
            <div className="flex items-start gap-4 mb-6">
              <Clock className="w-6 h-6 text-trading-red mt-1" />
              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter">Horário de Atendimento</h3>
                <p className="text-xl font-black text-white mt-1">09:00 às 18:00</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-black/40 rounded-2xl border border-white/5">
                <AlertCircle className="w-5 h-5 text-trading-red shrink-0" />
                <p className="text-xs font-medium text-zinc-300 leading-relaxed">
                  Vamos te atender o mais rápido possível. Não é necessário abrir novos tickets, basta esperar que entraremos em contato com você em breve.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Tickets Resolvidos / FAQ</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar..."
                  className="bg-white/5 border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-[10px] font-bold outline-none focus:ring-1 focus:ring-trading-red/30 w-48"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="glass-card rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden"
                >
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
                  >
                    <span className="text-xs font-black text-white uppercase tracking-tight pr-4">{faq.question}</span>
                    {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-trading-red" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </button>
                  <AnimatePresence>
                    {expandedFaq === idx && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-5 pb-5"
                      >
                        <p className="text-xs font-medium text-zinc-400 leading-relaxed pt-2 border-t border-white/5">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <p className="text-center py-8 text-xs font-bold text-zinc-600 uppercase">Nenhum ticket encontrado.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
