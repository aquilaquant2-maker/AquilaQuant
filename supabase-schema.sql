-- AQUILA QUANT: SQL FOUNDATION [SUPABASE] - V3 (Resilient)
-- Execute no SQL Editor do Supabase para configurar o banco corretamente.

-- 1. Limpeza Segura (Cascading drops to handle dependencies)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP TABLE IF EXISTS public.trading_results CASCADE;
DROP TABLE IF EXISTS public.trading_signals CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Tabela de Perfis
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active boolean DEFAULT true,
  -- Tags de acesso aceitas: 'B3', 'Forex', 'Cripto', 'All_Access'
  access_tags text[] DEFAULT '{}' NOT NULL,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies para Perfis
CREATE POLICY "Público pode ver perfis básicos" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuários podem editar seu próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Tabela de Sinais de Trade
CREATE TABLE public.trading_signals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  asset text NOT NULL,
  type text NOT NULL CHECK (type IN ('buy', 'sell')),
  entry_price numeric NOT NULL,
  take_profit numeric,
  stop_loss numeric,
  status text DEFAULT 'active' CHECK (status IN ('active', 'hit', 'closed')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trading_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ver sinais" ON public.trading_signals FOR SELECT USING (true);
CREATE POLICY "Apenas admins inserem sinais" ON public.trading_signals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Tabela de Resultados (Galeria)
CREATE TABLE public.trading_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  profit_loss numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trading_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ver resultados da galeria" ON public.trading_results FOR SELECT USING (true);
CREATE POLICY "Usuários postam seus próprios resultados" ON public.trading_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Tabela de Métricas Históricas (SPRINT 4.1)
CREATE TABLE public.asset_historical_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_symbol text UNIQUE NOT NULL, -- Ex: 'EUR/USD'
  y_value numeric NOT NULL,
  mean_b_value numeric NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.asset_historical_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver métricas" ON public.asset_historical_metrics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas admins podem inserir métricas" ON public.asset_historical_metrics
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Apenas admins podem atualizar métricas" ON public.asset_historical_metrics
  FOR UPDATE WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. Trigger para Auto-Profile no SignUp flux
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
