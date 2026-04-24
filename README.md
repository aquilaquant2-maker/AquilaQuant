# AQUILA QUANT [V5.0 ELITE]

Plataforma de inteligência quantitativa para traders que transforma dados brutos de mercado em "mapas operacionais" baseados em desvios estatísticos e matemática institucional.

## 1. Mapeamento de Infraestrutura
- **Frontend**: React 18+ (Vite) / Padrão Next.js App Router (Conceptual)
- **TypeScript**: Strict Mode
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Services**: Supabase (Planned Auth/RLS), Stripe (Billing), Gemini API (AI Insights)

## 2. Leis Sênior de Codificação
- **Idempotência de Estado**: UI feedback em toda ação de escrita.
- **Atomicidade**: Operações complexas garantidas em camada única.
- **Performance**: Foco em LCP e resposta tátil imediata.

## 4. Supabase Setup (Fase 5)
Para sincronizar o banco de dados com o Frontend e garantir Tipagem Estrita:

1. **Variáveis de Ambiente**:
   Crie um arquivo `.env.local` e adicione as chaves `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

2. **Geração de Tipos**:
   Instale a CLI do Supabase localmente e rode o comando:
   ```bash
   npx supabase gen types typescript --project-id seu-project-id > src/types/database.types.ts
   ```

3. **Uso do Cliente**:
   Importe o cliente de `@/src/lib/supabaseClient`.
