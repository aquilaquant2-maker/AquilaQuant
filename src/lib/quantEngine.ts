/**
 * AQUILA QUANT: Motor Quantitativo de Elite [V5.0]
 * Lógica de processamento de dados históricos e cálculos de regiões.
 */

import { supabase } from './supabaseClient';

/**
 * Arredondamento Inteligente: 
 * Equivalente ao MARRED(...;0,5) do Excel.
 */
export const roundToHalf = (val: number): number => {
  if (Math.abs(val) < 0.05) return Number(val.toFixed(6)); // Preservar pips decimais baixos (Forex)
  return Math.round(val * 2) / 2;
};

/**
 * TAREFA 2: O Processador de CSV (Historical Data Parser)
 * Alinhado com a lógica Python: Mínimo 45 dias, std(X, ddof=0)
 */
export const processQuantFile = (file: File, targetDate?: string): Promise<{ y_value: number, mean_b_value: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        if (!csvText) throw new Error("Arquivo vazio.");

        const lines = csvText.trim().split('\n');
        // Pulo de Linhas (Offset): Ignora Cabeçalho (L1) e Pregão Atual (L2)
        const dataLines = lines.slice(2).filter(l => l.trim() !== '');

        /**
         * Robust CSV Parser [Respects Quotes & Commas]
         */
        const getCols = (line: string) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if ((char === ',' || char === ';') && !inQuotes) {
              result.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current);
          return result;
        };

        /**
         * 1. Preparação dos Dados: Parse e Ordenação (DNA Pandas)
         */
        const parsedData = dataLines.map((line) => {
          const cols = getCols(line);
          
          // Parse da Data robusto (Suporta DD/MM/YYYY e YYYY-MM-DD)
          const dateStr = cols[0].replace(/"/g, '').trim();
          let timestamp = NaN;
          
          if (dateStr.includes('/')) {
            const [d, m, y] = dateStr.split('/').map(n => parseInt(n));
            timestamp = new Date(y, m - 1, d).getTime();
          } else if (dateStr.includes('-')) {
            const [y, m, d] = dateStr.split('-').map(n => parseInt(n));
            timestamp = new Date(y, m - 1, d).getTime();
          }

          const clean = (s: string | undefined) => {
            if (!s) return NaN;
            let val = s.replace(/"/g, '').trim();
            // Lógica B3/Brasil: 4.974,00 ou 4.974
            if (val.includes(',') && val.includes('.')) {
               return parseFloat(val.replace(/\./g, '').replace(',', '.'));
            }
            if (val.includes(',')) return parseFloat(val.replace(',', '.'));
            
            // Proteção para valores como 4.974 (onde o ponto é milhar)
            if (val.includes('.') && val.length >= 5) {
               return parseFloat(val.replace(/\./g, ''));
            }
            return parseFloat(val);
          };

          return {
            timestamp,
            dateStr,
            val2: clean(cols[2]), // Index 2 (Python df.columns[2]) -> 'high' literal (Abertura no CSV)
            val3: clean(cols[3]), // Index 3 (Python df.columns[3]) -> 'low' literal (Máxima no CSV)
          };
        })
        .filter(row => !isNaN(row.timestamp) && !isNaN(row.val2) && !isNaN(row.val3))
        .sort((a, b) => a.timestamp - b.timestamp);

        // FILTRAGEM DINÂMICA (DNA do Script Python: df = df[df['date'] < target_date])
        let filteredData = parsedData;
        if (targetDate) {
          // Normalizamos a data alvo para meia-noite
          const [yArr, mArr, dArr] = targetDate.split('-').map(Number);
          const targetTs = new Date(yArr, mArr - 1, dArr).getTime();
          
          filteredData = parsedData.filter(row => row.timestamp < targetTs);
          console.log(`AQUILA QUANT [Engine]: Filtrando dados ANTERIORES a ${targetDate} (TS: ${targetTs})`);
        }

        // Pega os últimos 45 dias disponíveis ANTES da data alvo
        const last45 = filteredData.slice(-45);

        if (last45.length < 45) {
          throw new Error(`Dados insuficientes antes de ${targetDate || 'hoje'}: Necessário 45 dias, temos ${last45.length}.`);
        }

        /**
         * 2. Cálculo do X (DNA do Script Python)
         * X = high (Col 2) - low (Col 3) = Abertura - Máxima
         */
        const X = last45.map(row => row.val2 - row.val3);

        // Debug log para conferência (Primeiros 3 valores de X)
        console.log('DEBUG X (Primeiros 3):', X.slice(0, 3));
        console.log('DEBUG X (Last 45 first date):', last45[0].dateStr);

        // 3. Cálculo do B (Mean de X)
        const meanX = X.reduce((a, b) => a + b, 0) / X.length;
        const mean_b_value = roundToHalf(meanX);

        // 4. Cálculo do Y (StdDev ddof=0 conforme Script Python np.std)
        const variance = X.reduce((acc, val) => acc + Math.pow(val - meanX, 2), 0) / X.length;
        const y_value = roundToHalf(Math.sqrt(variance));

        console.log(`AQUILA QUANT [Engine Result]: B=${mean_b_value}, Y=${y_value} (N=${last45.length}, Target=${targetDate})`);
        resolve({ y_value, mean_b_value });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("Erro na leitura física do arquivo."));
    reader.readAsText(file);
  });
};

/**
 * TAREFA 3: Persistência no Supabase com Proteção de Timeout
 */
export const uploadAssetMetrics = async (assetSymbol: string, file: File) => {
  console.log(`AQUILA QUANT [Upload]: Iniciando processamento para ${assetSymbol}...`);
  
  try {
    const metrics = await processQuantFile(file);
    console.log(`AQUILA QUANT [Upload]: Dados extraídos com sucesso. Enviando para o database...`);

    // Implementação de Timeout de 30 segundos (Resiliência para conexões instáveis)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout ao conectar com Supabase (30s) - Verifique sua conexão.")), 30000)
    );

    const upsertPromise = (async () => {
      const { data, error } = await supabase
        .from('asset_historical_metrics')
        .upsert({
          asset_symbol: assetSymbol,
          y_value: metrics.y_value,
          mean_b_value: metrics.mean_b_value,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'asset_symbol' 
        })
        .select();
      
      return { data, error };
    })();

    const result: any = await Promise.race([upsertPromise, timeoutPromise]);
    const { error } = result;

    if (error) {
      console.error('AQUILA QUANT [Supabase Error]:', error);
      throw new Error(`Erro no Banco de Dados: ${error.message || 'Falha na política RLS ou Conexão'}`);
    }
    
    console.log(`AQUILA QUANT [Upload Success]: ${assetSymbol} atualizado no banco.`);
    return { success: true, metrics };
  } catch (err: any) {
    console.error('AQUILA QUANT [Upload Fatal]:', err.message);
    throw err;
  }
};

