import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Send, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { ChangelogCategory } from '../types/changelog';

interface ChangelogAdminPanelProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const ChangelogAdminPanel: React.FC<ChangelogAdminPanelProps> = ({ onSuccess, onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ChangelogCategory>('Nova Feature');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('changelog_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('changelog_images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    setStatus(null);

    try {
      let image_url = null;
      if (image) {
        image_url = await uploadImage(image);
        if (!image_url) throw new Error('Falha ao fazer upload da imagem.');
      }

      const { error } = await supabase
        .from('changelog')
        .insert([{ title, content, category, image_url }]);

      if (error) throw error;

      setStatus({ type: 'success', message: 'Atualização publicada com sucesso!' });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Erro ao publicar.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Nova Atualização</h2>
            <p className="text-xs text-zinc-500 font-medium">Comunique as novidades para os usuários</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {status && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm font-bold">{status.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Título</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Novo Filtro de Volume"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-trading-green/50 outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Categoria</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as ChangelogCategory)}
                className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-trading-green/50 outline-none transition-colors appearance-none"
              >
                <option value="Nova Feature">Nova Feature</option>
                <option value="Melhoria">Melhoria</option>
                <option value="Aviso">Aviso</option>
                <option value="Correção">Correção</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Conteúdo (Markdown)</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva as mudanças..."
              className="w-full h-40 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:border-trading-green/50 outline-none transition-colors resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Imagem de Destaque (Opcional)</label>
            <div className="relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="changelog-image"
              />
              <label 
                htmlFor="changelog-image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl hover:border-trading-green/40 hover:bg-trading-green/5 transition-all cursor-pointer"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-2xl p-1" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-zinc-500 mb-2" />
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Selecionar Imagem</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !title || !content}
            className="w-full h-14 bg-trading-green text-black font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_35px_rgba(0,255,157,0.2)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Publicar Atualização
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
