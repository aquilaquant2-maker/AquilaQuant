# PROTOCOLO DE GOVERNANÇA TÉCNICA: ARCHRENDER AI [V5.0 - ELITE EDITION]

Este documento estabelece o **Padrão de Ouro de Produção** para o projeto **AQUILA QUANT**. Cada linha de código é um compromisso financeiro e técnico.

## 1. MAPEAMENTO DE INFRAESTRUTURA
- **CORE:** React 18+ (Vite) [Note: Aligning with current environment while maintaining Next.js architectural standards where possible], TypeScript (Strict Mode).
- **UI/UX:** Tailwind CSS + Framer Motion (motion) + Lucide React.
- **DATA:** Real-time components, TradingView integration.
- **STATED INTENT:** Scaling to Supabase/Edge Functions (Future/Informed).

## 2. O RITUAL DE PRÉ-EXECUÇÃO (DEEP THINKING PROTOCOL)
Antes de qualquer mudança não trivial, o diagnóstico deve incluir:
1. **Diagnóstico:** Qual é o problema real?
2. **Melhor Prática (Senior Standard):** Como Vercel/Stripe resolveriam?
3. **Análise de Risco:** O que pode quebrar? (Responsividade, Segurança, Perf).
4. **Prevenção de Danos:** Isolamento de código.
5. **Mapeamento de Dependências:** Componentes/arquivos afetados.
6. **Caça aos Edge Cases:** Murphy's Law (Offline, Erros de API).
7. **Análise de Trade-offs:** Justificativa técnica.
8. **Revisão de Segurança:** Vazamento de dados, RLS.
9. **Fluxo de UX:** Redução de carga cognitiva, feedback visual.
10. **O Teste dos 3 Meses:** Manutenibilidade e código autoexplicativo.

## 3. LEIS SÊNIOR DE CODIFICAÇÃO (NON-NEGOTIABLE)
- **LEI DO SNIPPET CIRÚRGICO:** Apenas código alterado com comentários de contexto.
- **LEI DA LIMPEZA (DRY/KISS):** Componentes modulares e hooks customizados.
- **LEI DA TIPAGEM:** TypeScript Strict. Zero `any`.
- **Lei da Mínima Intervenção:** Código estritamente necessário.
- **LEI DA IDEMPOTÊNCIA:** Seguro para múltiplas execuções (especialmente em transações).
- **LEI DA ATOMICIDADE:** Tudo ou nada. Rollback em falhas.
- **LEI DA FALHA GRACIOSA:** Zero white screen. Error Boundaries e Error Handling robusto.
- **LEI DA PERFORMANCE PERCEPTÍVEL:** LCP, Skeleton screens, otimização de imagens.
- **LEI DA IDEMPOTÊNCIA DE ESTADO:** Botões disabled em loading de escrita.

## 4. DIRETRIZES DE DESIGN SYSTEM (ELITE APPLE/LINEAR STYLE)
- **Estética:** *Ultra-dark trading terminal*.
- **Paleta:** Fundo #050507 (Deep Black), acentos em #00ff9d (Trading Green).
- **UI:** Glassmorphism pesado (`glass-card`), tipografia Inter/Monospace.
- **Interação:** Feedback visual imediato, transições fluídas via `motion`.

## 5. SEGURANÇA E ESTABILIDADE
- **VALIDAÇÃO DE SCHEMAS:** `Zod` obrigatório para inputs externos/APIs.
- **DATABASE:** RLS (Row Level Security) é sagrado.
- **SECRETS:** NUNCA escreva chaves diretamente. Use `process.env`.

## 6. PROTOCOLO DE RESPOSTA A BUGS
1. Sem desculpas.
2. Análise de stack trace.
3. Root Cause Analysis (RCA).
4. Código corrigido + explicação técnica.

## 7. CÁLCULO QUANTITATIVO (DNA AQUILA) - IMUTÁVEL
- **FONTE DE DADOS:** CSV com Cabeçalho (L1) e Pregão Atual (L2).
- **OFFSET:** Sempre usar `lines.slice(2)` para ignorar os dois primeiros registros no processamento de médias.
- **MAPEAMENTO (Lógica Python):** 
  - Coluna Index 2 (Abertura no CSV) = `high` (para fins de cálculo).
  - Coluna Index 3 (Máxima no CSV) = `low` (para fins de cálculo).
- **CÁLCULO X:** Amplitude `X = high - low`.
- **VOLATILIDADE (Y):** `roundToHalf(Standard Deviation (ddof=0))`.
- **MÉDIA (B):** `roundToHalf(Mean of X)`.
- **UNIVERSALIDADE:** Este motor é soberano para todos os ativos e planilhas. Alterar essa lógica sem ordem direta do CEO é proibido.
