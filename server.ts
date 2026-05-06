import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
  const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Stripe Webhook needs raw body for signature verification
  app.post(
    "/api/stripe-webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;

      try {
        if (!sig || !webhookSecret) {
          throw new Error("Missing signature or webhook secret");
        }
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;
        const planType = session.metadata?.plan_type;

        if (!customerEmail || !planType) {
          console.error("Missing email or plan type in session");
          return res.status(400).send("Missing data");
        }

        try {
          // Check if user exists
          const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
          if (listError) throw listError;

          const existingUser = users.users.find(u => u.email === customerEmail);
          
          let userId = existingUser?.id;
          let accessTags = [planType];
          if (planType === "Elite") {
            accessTags = ["B3", "Forex"];
          }

          if (existingUser) {
            // Update existing user profile access tags
            const { data: profile } = await supabaseAdmin
              .from("profiles")
              .select("access_tags")
              .eq("id", userId)
              .single();

            const currentTags = profile?.access_tags || [];
            const newTags = Array.from(new Set([...currentTags, ...accessTags]));

            await supabaseAdmin
              .from("profiles")
              .update({ access_tags: newTags })
              .eq("id", userId);
              
            console.log(`Updated access for existing user: ${customerEmail}`);
          } else {
            // Invite new user (Silent Onboarding)
            const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(customerEmail, {
              data: { full_name: session.customer_details?.name || "" }
            });

            if (inviteError) throw inviteError;
            userId = inviteData.user.id;

            // Create profile with access tags
            await supabaseAdmin
              .from("profiles")
              .insert({
                id: userId,
                email: customerEmail,
                full_name: session.customer_details?.name || "",
                access_tags: accessTags,
                created_at: new Date().toISOString()
              });

            console.log(`Created new account and invited: ${customerEmail}`);
          }
        } catch (err: any) {
          console.error(`Error processing webhook database actions: ${err.message}`);
          return res.status(500).send("Internal Server Error");
        }
      }

      res.json({ received: true });
    }
  );

  // Other API routes use JSON
  app.use(express.json());

  app.post("/api/create-checkout", async (req, res) => {
    const { priceId, email } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: "Price ID is required" });
    }

    try {
      // Determine plan type from priceId
      let planType = "B3";
      if (priceId === "price_1TU6lSDlA9wB0KdoYrqhYI0o") planType = "Elite";
      if (priceId === "price_1TU6jNDlA9wB0KdoS9aGM4p7") planType = "Forex";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        customer_email: email || undefined,
        success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/#pricing`,
        metadata: {
          plan_type: planType,
        },
        // Allow promotional codes (the user provided a link with a promo code)
        allow_promotion_codes: true,
      });

      res.json({ url: session.url });
    } catch (err: any) {
      console.error(`Stripe Error: ${err.message}`);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
