export type ChangelogCategory = 'Nova Feature' | 'Melhoria' | 'Aviso' | 'Correção';

export interface ChangelogPost {
  id: string;
  title: string;
  content: string;
  category: ChangelogCategory;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
