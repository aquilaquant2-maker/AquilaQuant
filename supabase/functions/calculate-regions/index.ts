import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { assetSymbol, abertura } = await req.json()

    if (!assetSymbol || !abertura) {
      throw new Error('Símbolo do ativo e preço de abertura são obrigatórios.')
    }

    // Initialize Supabase Client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Buscar métricas do ativo
    const { data: metrics, error: metricsError } = await supabase
      .from('asset_historical_metrics')
      .select('y_value, mean_b_value')
      .eq('asset_symbol', assetSymbol)
      .single()

    if (metricsError || !metrics) {
      throw new Error(`Métricas não encontradas para o ativo: ${assetSymbol}`)
    }

    const Y = Number(metrics.y_value)
    const B = Number(metrics.mean_b_value)

    // Helper para arredondar para 0.5
    const roundToHalf = (val: number) => Math.round(val * 2) / 2

    // Cálculos do Motor Quantitativo (PROPRIEDADE INTELECTUAL PROTEGIDA)
    const A = Y / 2
    const C = B / 2
    const D = B / 10

    const max1 = abertura + C
    const max2 = max1 + A
    const min1 = abertura - C
    const min2 = min1 - A

    const stopLossMin = roundToHalf(D / 2)
    const stopLossMax = stopLossMin * 2

    const stopGainMin = Y / 2
    const stopGainMax = stopGainMin * 2

    // Geração de Regiões
    const regions_up = [1, 2, 3, 4].map(i => abertura + (Y * i))
    const regions_down = [1, 2, 3, 4].map(i => abertura - (Y * i))

    const regions_up_half = [1.5, 2.5, 3.5, 4.5].map(i => abertura + (Y * i))
    const regions_down_half = [1.5, 2.5, 3.5, 4.5].map(i => abertura - (Y * i))

    return new Response(
      JSON.stringify({
        asset: assetSymbol,
        abertura,
        quant_analysis: {
          central_targets: { max1, max2, min1, min2 },
          risk_management: {
            stop_loss: { min: stopLossMin, max: stopLossMax },
            stop_gain: { min: stopGainMin, max: stopGainMax }
          },
          regions: {
            major_up: regions_up,
            major_down: regions_down,
            intermediate_up: regions_up_half,
            intermediate_down: regions_down_half
          }
        },
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
