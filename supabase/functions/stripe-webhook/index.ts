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
        console.log(`🚀 Processando checkout para: ${customerEmail}`)

        // 1. Verifica se já processamos este e-mail recentemente com este plano (Idempotência Básica)
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, access_tags')
          .eq('email', customerEmail)
          .single()

        if (existingProfile && existingProfile.access_tags?.includes(planType)) {
          console.log(`✅ Usuário ${customerEmail} já possui o plano ${planType}. Pulando processamento redundante.`)
          return new Response(JSON.stringify({ received: true, already_processed: true }), { status: 200 })
        }

        // 2. Verifica se o usuário já existe no Auth
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
        const existingUser = users?.find(u => u.email === customerEmail)
        
        let userId = existingUser?.id

        if (!existingUser) {
          console.log(`✉️ Enviando convite para novo usuário: ${customerEmail}`)
          // 3. Tenta convidar - Se já existir (race condition), o Supabase retorna erro amigável
          const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(customerEmail, {
            data: { full_name: customerName, plan_type: planType },
            redirectTo: 'https://dailydolar.com.br/'
          })

          if (inviteError && !inviteError.message?.includes('already has an account')) {
            console.error('❌ Erro fatal no convite:', inviteError)
            throw inviteError
          }
          userId = inviteData?.user?.id
        } else {
          console.log(`👤 Usuário já existe no Auth: ${userId}. Atualizando perfil.`)
        }

        if (userId) {
          // 4. Garante que o perfil existe e tem as tags corretas
          // Mesclamos as tags existentes se houver
          const currentTags = existingProfile?.access_tags || []
          const newTags = Array.from(new Set([...currentTags, ...accessTags]))

          const { error: upsertError } = await supabase.from('profiles').upsert({
            id: userId,
            email: customerEmail,
            full_name: customerName,
            access_tags: newTags,
            updated_at: new Date().toISOString()
          })

          if (upsertError) {
            console.error('❌ Erro ao atualizar perfil:', upsertError)
            throw upsertError
          }
          
          console.log(`✅ Acesso liberado/atualizado para ${customerEmail} (ID: ${userId})`)
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
