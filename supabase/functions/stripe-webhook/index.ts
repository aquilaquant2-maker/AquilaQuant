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
      
      // Mapeamento de planos baseado nos Price IDs que você forneceu
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
        console.log(`🚀 Processando acesso para: ${customerEmail} (Plano: ${planType})`)

        // 1. Verificar se o usuário já existe no Auth
        const { data: userData } = await supabase.auth.admin.listUsers()
        const existingUser = userData?.users.find(u => u.email === customerEmail)

        if (existingUser) {
          // Usuário já existe: Atualiza as tags de acesso no perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('access_tags')
            .eq('id', existingUser.id)
            .single()

          const currentTags = profile?.access_tags || []
          const newTags = Array.from(new Set([...currentTags, ...accessTags]))

          await supabase
            .from('profiles')
            .update({ 
              access_tags: newTags,
              full_name: customerName // Atualiza o nome se necessário
            })
            .eq('id', existingUser.id)

          console.log(`✅ Acesso atualizado para usuário existente: ${existingUser.id}`)
        } else {
          // USUÁRIO NOVO: Dispara o Convite (Silent Onboarding)
          console.log(`✉️ Enviando convite para novo usuário: ${customerEmail}`)
          
          const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(customerEmail, {
            data: { full_name: customerName },
            redirectTo: 'https://subtle-scone-3799a0.netlify.app/' // O link de retorno após definir senha
          })

          if (inviteError) {
            console.error('❌ Erro ao convidar usuário:', inviteError)
            throw inviteError
          }

          const userId = inviteData.user.id

          // Cria o perfil inicial na tabela 'profiles'
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: customerEmail,
              full_name: customerName,
              access_tags: accessTags,
              created_at: new Date().toISOString()
            })

          if (profileError) {
            console.error('❌ Erro ao criar perfil:', profileError)
          }

          console.log(`✅ Novo usuário convidado e perfil criado: ${userId}`)
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
