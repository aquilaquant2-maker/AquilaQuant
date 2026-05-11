-- AQUILA QUANT: SQL FOUNDATION [SUPABASE] - V3 (Resilient)
-- Execute no SQL Editor do Supabase para configurar o banco corretamente.

-- 1. Limpeza Segura (Cascading drops to handle dependencies)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP TABLE IF EXISTS public.trading_results CASCADE;
DROP TABLE IF EXISTS public.trading_signals CASCADE;
DROP TABLE IF EXISTS public.asset_historical_metrics CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Tabela de Perfis
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active boolean DEFAULT true,
  access_tags text[] DEFAULT '{}' NOT NULL,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- LIMPEZA TOTAL DE POLICIES (Garantia de Estado Zero V6)
DROP POLICY IF EXISTS "profiles_read_v5" ON public.profiles;
DROP POLICY IF EXISTS "profiles_write_v5" ON public.profiles;
DROP POLICY IF EXISTS "Perfis visíveis para autenticados" ON public.profiles;
DROP POLICY IF EXISTS "Usuários editam seu perfil ou master admin" ON public.profiles;
DROP POLICY IF EXISTS "Público pode ver perfis básicos" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem editar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários editam seu perfil ou admins editam todos" ON public.profiles;

-- 1. POLICIES PARA PROFILES
-- Leitura: Usuários autenticados podem ver a lista (necessário para o CRM)
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
-- Escrita: Próprio usuário ou master admin
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (
  auth.uid() = id OR (auth.jwt() ->> 'email') = 'aquilaquant2@gmail.com'
);

-- 1.2 Sincronização Manual de Usuários (Correção para tabelas recriadas)
INSERT INTO public.profiles (id, email, role, access_tags)
SELECT 
  id, 
  email, 
  CASE WHEN email = 'aquilaquant2@gmail.com' THEN 'admin' ELSE 'user' END,
  CASE WHEN email = 'aquilaquant2@gmail.com' THEN ARRAY['All_Access'] ELSE ARRAY[]::text[] END
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Garantir que o Master Admin tenha acesso total
UPDATE public.profiles 
SET role = 'admin', access_tags = ARRAY['All_Access']
WHERE email = 'aquilaquant2@gmail.com';

-- 3. Tabela de Sinais de Trade
CREATE TABLE public.trading_signals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_symbol text NOT NULL,
  type text NOT NULL CHECK (type IN ('BUY', 'SELL')),
  entry_price numeric NOT NULL,
  take_profit numeric,
  stop_loss numeric,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trading_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sinais visíveis para todos" ON public.trading_signals;
DROP POLICY IF EXISTS "Admins master ou role gerenciam sinais" ON public.trading_signals;

CREATE POLICY "signals_select" ON public.trading_signals FOR SELECT USING (true);
CREATE POLICY "signals_admin" ON public.trading_signals FOR ALL USING (
  (auth.jwt() ->> 'email') = 'aquilaquant2@gmail.com' OR
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

DROP POLICY IF EXISTS "Todos podem ver resultados da galeria" ON public.trading_results;
DROP POLICY IF EXISTS "Usuários postam seus próprios resultados" ON public.trading_results;

CREATE POLICY "results_select" ON public.trading_results FOR SELECT USING (true);
CREATE POLICY "results_insert" ON public.trading_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Tabela de Métricas Históricas
CREATE TABLE public.asset_historical_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_symbol text UNIQUE NOT NULL,
  y_value numeric NOT NULL,
  mean_b_value numeric NOT NULL,
  freq_1_value numeric DEFAULT 0,
  freq_2_value numeric DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.asset_historical_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Métricas visíveis para autenticados" ON public.asset_historical_metrics;
DROP POLICY IF EXISTS "Gerenciamento total para admins e master" ON public.asset_historical_metrics;

CREATE POLICY "metrics_select" ON public.asset_historical_metrics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "metrics_admin" ON public.asset_historical_metrics FOR ALL USING (
  (auth.jwt() ->> 'email') = 'aquilaquant2@gmail.com' OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. Trigger para Auto-Profile no SignUp flux
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, access_tags)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    CASE WHEN new.email = 'aquilaquant2@gmail.com' THEN 'admin' ELSE 'user' END,
    CASE WHEN new.email = 'aquilaquant2@gmail.com' THEN ARRAY['All_Access'] ELSE ARRAY[]::text[] END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
