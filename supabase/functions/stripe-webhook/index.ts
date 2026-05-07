import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    let event
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        endpointSecret ?? ''
      )
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log(`🔔 Evento recebido: ${event.type}`)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const customerEmail = session.customer_details?.email
      const customerName = session.customer_details?.name || ''
      
      let planType = 'B3'
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      const priceId = lineItems.data[0]?.price?.id

      if (priceId === 'price_1TU6lSDlA9wB0KdoYrqhYI0o') planType = 'Elite'
      else if (priceId === 'price_1TU6jNDlA9wB0KdoS9aGM4p7') planType = 'Forex'

      let accessTags = [planType]
      if (planType === 'Elite') {
        accessTags = ['B3', 'Forex']
      }

      if (customerEmail) {
        console.log(`🚀 Processando: ${customerEmail}`)

        // 1. Tenta convidar - Se já existir, o Supabase retorna erro amigável
        const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(customerEmail, {
          data: { full_name: customerName, plan_type: planType },
          redirectTo: 'https://dailydolar.com.br/'
        })

        // Se o erro for que o usuário já existe, não paramos o processo
        const userExists = inviteError?.message?.includes('already has an account') || inviteError?.status === 422
        
        if (inviteError && !userExists) {
          console.error('❌ Erro fatal no convite:', inviteError)
          throw inviteError
        }

        const userId = inviteData?.user?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === customerEmail)?.id

        if (userId) {
          // Atualiza ou cria o perfil - Usando try/catch para não quebrar a function se a tabela falhar
          try {
            await supabase.from('profiles').upsert({
              id: userId,
              email: customerEmail,
              full_name: customerName,
              access_tags: accessTags,
              updated_at: new Date().toISOString()
            })
            console.log(`✅ Acesso liberado para ${userId}`)
          } catch (e) {
            console.warn('⚠️ Perfil não pôde ser atualizado, mas o convite foi enviado:', e.message)
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error(`❌ Erro no processamento do Webhook: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 500 })
  }
})
