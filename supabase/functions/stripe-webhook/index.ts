import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.9.0?target=deno'

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
    const body = await req.text() // Usamos text() para constructEventAsync
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    let event
    try {
      // ✅ A chave para funcionar no Edge: constructEventAsync + SubtleCryptoProvider
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        endpointSecret ?? '',
        undefined,
        Stripe.createSubtleCryptoProvider()
      )
    } catch (err) {
      console.error(`❌ Webhook signature verification failed: ${err.message}`)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log(`🔔 Evento recebido: ${event.type}`)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const customerEmail = session.customer_details?.email
      const customerName = session.customer_details?.name || ''
      
      if (!customerEmail) {
        return new Response('No customer email', { status: 400 })
      }

      console.log(`🚀 Processando checkout: ${customerEmail}`)

      // 1. Determina o plano baseado no Price ID
      let planType = 'B3'
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      const priceId = lineItems.data[0]?.price?.id

      if (priceId === 'price_1TU6lSDlA9wB0KdoYrqhYI0o') planType = 'Elite'
      else if (priceId === 'price_1TU6jNDlA9wB0KdoS9aGM4p7') planType = 'Forex'

      let accessTagsToAdd = [planType]
      if (planType === 'Elite') {
        accessTagsToAdd = ['B3', 'Forex']
      }

      // 2. Busca perfil existente
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, access_tags')
        .eq('email', customerEmail)
        .maybeSingle()

      // Idempotência: Se já tem as tags, sucesso.
      if (existingProfile && accessTagsToAdd.every(tag => existingProfile.access_tags?.includes(tag))) {
        console.log(`✅ Usuário ${customerEmail} já possui todos os acessos.`)
        return new Response(JSON.stringify({ received: true }), { status: 200 })
      }

      let userId = existingProfile?.id

      // 3. Se não temos perfil, verifica no Auth (evita duplicar convite se o usuário deletou o perfil mas ficou no auth)
      if (!userId) {
        const { data: { users } } = await supabase.auth.admin.listUsers()
        userId = users.find(u => u.email === customerEmail)?.id
      }

      // 4. Se o usuário NÃO existe no Auth, envia convite
      if (!userId) {
        console.log(`✉️ Novo usuário. Enviando link de ativação para: ${customerEmail}`)
        const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(customerEmail, {
          data: { full_name: customerName, plan_type: planType },
          redirectTo: 'https://dailydolar.com.br/' 
        })

        if (inviteError) {
          if (inviteError.message?.includes('already has an account')) {
            // Caso raro de race condition
            const { data: { users } } = await supabase.auth.admin.listUsers()
            userId = users.find(u => u.email === customerEmail)?.id
          } else {
            console.error('❌ Erro ao convidar:', inviteError)
            throw inviteError
          }
        } else {
          userId = inviteData?.user?.id
          console.log(`✉️ Convite enviado com sucesso.`)
        }
      } else {
        console.log(`👤 Usuário já existia no sistema (ID: ${userId}).`)
      }

      // 5. Garante que o perfil está atualizado com as tags
      if (userId) {
        const currentTags = existingProfile?.access_tags || []
        const updatedTags = Array.from(new Set([...currentTags, ...accessTagsToAdd]))

        const { error: upsertError } = await supabase.from('profiles').upsert({
          id: userId,
          email: customerEmail,
          full_name: customerName,
          access_tags: updatedTags,
          updated_at: new Date().toISOString()
        })

        if (upsertError) {
          console.error('❌ Erro no upsert do perfil:', upsertError)
          throw upsertError
        }
        
        console.log(`✅ Acesso liberado: ${customerEmail} | Tags: ${updatedTags.join(', ')}`)
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error(`❌ ERRO FATAL: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 500 })
  }
})

