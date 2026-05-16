import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Calendar, ChevronRight, Loader2, Sparkles, Zap, AlertTriangle, Bug } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { ChangelogPost } from '../types/changelog';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export const ChangelogView: React.FC = () => {
  const [posts, setPosts] = useState<ChangelogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('changelog')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const fetchedPosts = data || [];
        setPosts(fetchedPosts);

        // Atualiza o localStorage com o timestamp do post mais recente
        if (fetchedPosts.length > 0) {
          localStorage.setItem('lastSeenChangelog', fetchedPosts[0].created_at);
          // Dispara um evento customizado para notificar a Sidebar
          window.dispatchEvent(new Event('changelogSeen'));
        }
      } catch (error) {
        console.error('Erro ao carregar atualizações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Nova Feature': return <Sparkles className="w-3 h-3" />;
      case 'Melhoria': return <Zap className="w-3 h-3" />;
      case 'Aviso': return <AlertTriangle className="w-3 h-3" />;
      case 'Correção': return <Bug className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Nova Feature': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Melhoria': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Aviso': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Correção': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#050507]">
        <Loader2 className="w-8 h-8 text-trading-green animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sincronizando Novidades...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#050507] custom-scrollbar">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-8 h-px bg-trading-green/50" />
            <span className="text-[10px] font-black text-trading-green uppercase tracking-[0.3em]">Timeline de Evolução</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter"
          >
            Nossas <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Atualizações</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 mt-4 font-medium text-sm max-w-xl leading-relaxed"
          >
            Acompanhe cada nova feature, melhoria e correção que implementamos para tornar sua jornada trading cada vez mais eficiente.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative space-y-12">
          {/* Vertical Line - Desktop Only */}
          <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent hidden md:block" />

          {posts.length === 0 ? (
            <div className="py-20 text-center bg-white/[0.02] border border-white/5 rounded-3xl">
              <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">Nenhuma atualização registrada ainda.</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative md:pl-12"
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#050507] border-2 border-white/10 flex items-center justify-center z-10 hidden md:flex">
                  <div className="w-1.5 h-1.5 rounded-full bg-trading-green shadow-[0_0_8px_rgba(0,255,157,0.5)]" />
                </div>

                <div className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-all group shadow-xl">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <div className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      getCategoryStyles(post.category)
                    )}>
                      {getCategoryIcon(post.category)}
                      {post.category}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-trading-green transition-colors">
                    {post.title}
                  </h3>

                  {post.image_url && (
                    <div className="mb-6 rounded-xl overflow-hidden border border-white/5 aspect-video md:aspect-[21/9]">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}

                  <div className="prose prose-invert prose-sm max-w-none text-zinc-400 font-medium leading-relaxed prose-p:mb-4 prose-strong:text-white prose-ul:list-disc prose-ul:ml-4">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-zinc-600">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Aquila Quant Team</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
