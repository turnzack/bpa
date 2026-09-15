// Service checkout Stripe avec Neon PostgreSQL (sans Supabase)
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { sql } from '../../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'kirov5-fallback-secret-key-32chars!';

export interface CreateCheckoutSessionParams {
  accessToken?: string;
  userId?: string;
  userEmail?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResult {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<CreateCheckoutSessionResult> {
  try {
    const { accessToken, priceId, successUrl, cancelUrl } = params;
    let userId = params.userId;
    let userEmail = params.userEmail;

    // Si userId n'est pas fourni, le décoder depuis le JWT Neon
    if (!userId && accessToken) {
      try {
        const decoded = jwt.verify(accessToken, JWT_SECRET) as any;
        userId = decoded.userId || decoded.id;
        userEmail = decoded.email;
      } catch (err) {
        return { success: false, error: "Jeton d'accès invalide ou expiré." };
      }
    }

    if (!userId) {
      return { success: false, error: "Utilisateur non authentifié." };
    }

    // Récupérer l'email de l'utilisateur si absent
    if (!userEmail) {
      const userRows = await sql`SELECT email FROM users WHERE id = ${userId} LIMIT 1`;
      if (userRows.length > 0) {
        userEmail = userRows[0].email;
      }
    }

    // Initialiser Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as any,
    });

    // 1. Récupérer ou créer l'enregistrement BSD dans Neon
    let bsdRows = await sql`
      SELECT stripe_customer_id 
      FROM bsd 
      WHERE user_id = ${userId} 
      LIMIT 1
    `;

    let stripeCustomerId = bsdRows[0]?.stripe_customer_id;

    // 2. Créer le client Stripe s'il n'existe pas encore
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail || undefined,
        metadata: { user_id: userId }
      });

      stripeCustomerId = customer.id;

      if (bsdRows.length === 0) {
        await sql`
          INSERT INTO bsd (user_id, user_email, statut, stripe_customer_id)
          VALUES (${userId}, ${userEmail || null}, 'inactive', ${stripeCustomerId})
        `;
      } else {
        await sql`
          UPDATE bsd
          SET stripe_customer_id = ${stripeCustomerId}, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ${userId}
        `;
      }
    }

    // 3. Vérifier les paramètres requis
    if (!priceId || !successUrl || !cancelUrl) {
      return { 
        success: false, 
        error: "priceId, successUrl et cancelUrl sont requis." 
      };
    }

    // 4. Récupérer les détails du prix pour déterminer le mode
    const price = await stripe.prices.retrieve(priceId);

    // 5. Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: price.recurring ? 'subscription' : 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        price_id: priceId
      }
    });

    console.log('[createCheckoutSession] Session Neon/Stripe créée :', session.id);

    return {
      success: true,
      sessionId: session.id,
      url: session.url || undefined
    };

  } catch (err: any) {
    console.error('[createCheckoutSession] Erreur :', err);
    return {
      success: false,
      error: err.message || "Erreur interne du serveur."
    };
  }
}
