// Routes Stripe avec intégration Neon PostgreSQL native (100% sans Supabase)
import express from 'express';
import Stripe from 'stripe';
import { stripeService } from '../services/stripeService';
import { createCheckoutSession } from '../services/tce/checkout-session.service';
import {
  handleCheckoutCompleted,
  handleSubscriptionUpdate,
  handleSubscriptionDeleted,
  constructWebhookEvent
} from '../services/tce/stripe-webhook.service';
import { sql } from '../config/db';
import { authenticateUser, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Initialiser Stripe pour les routes
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// ============================================================
// CRÉER UNE SESSION DE PAIEMENT (Abonnement ou Pack)
// ============================================================
router.post('/create-checkout-session', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const result = await createCheckoutSession({
      userId: req.user.id,
      userEmail: req.user.email,
      priceId,
      successUrl: successUrl || `${process.env.FRONTEND_URL || 'https://bpa-git-production-v01-e951.vercel.app'}/success`,
      cancelUrl: cancelUrl || `${process.env.FRONTEND_URL || 'https://bpa-git-production-v01-e951.vercel.app'}/cancel`
    });

    if (result.success && result.sessionId && result.url) {
      res.json({
        sessionId: result.sessionId,
        url: result.url
      });
    } else {
      res.status(400).json({ error: result.error });
    }

  } catch (error: any) {
    console.error('[create-checkout-session] Error:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// ============================================================
// CRÉER UNE SESSION DE PAIEMENT POUR UN SCAN (Paiement Unique)
// ============================================================
router.post('/create-scan-payment', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const { scanId } = req.body;
    const user = req.user;

    if (!scanId) {
      return res.status(400).json({ error: 'scanId requis' });
    }

    const rawOrigin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer as string).origin : '') || process.env.FRONTEND_URL || 'https://bpa-git-production-v01-e951.vercel.app';
    const origin = rawOrigin.replace(/\/$/, '');
    const successUrl = `${origin}/?payment-success=true&scanId=${scanId}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/?payment-cancel=true&scanId=${scanId}`;

    // Enregistrer ou mettre à jour la tentative dans Neon
    try {
      const existing = await sql`SELECT id FROM scan_payments WHERE scan_id = ${scanId}`;
      if (existing.length === 0) {
        await sql`
          INSERT INTO scan_payments (scan_id, user_id, user_email, amount, currency, status)
          VALUES (${scanId}, ${user?.id || 'anonymous'}, ${user?.email || null}, 1.99, 'eur', 'pending')
        `;
      }
    } catch (dbErr: any) {
      console.warn('[create-scan-payment] Scan payment init db warning:', dbErr.message);
    }

    const result = await stripeService.createScanPaymentSession(
      user?.email || 'client@bpa.fr',
      user?.id || 'anonymous',
      scanId,
      successUrl,
      cancelUrl
    );

    if (result.success && result.session) {
      res.json({
        sessionId: result.session.id,
        url: result.session.url!,
        scanId
      });
    } else {
      res.status(500).json({ error: result.error });
    }

  } catch (error: any) {
    console.error('[create-scan-payment] Error:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// ============================================================
// WEBHOOK STRIPE
// ============================================================
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: express.Request, res: express.Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET non configuré');
    return res.status(500).send('Configuration serveur manquante');
  }

  const eventResult = constructWebhookEvent(req.body, sig, webhookSecret);

  if (!eventResult.success || !eventResult.event) {
    return res.status(400).send(`Webhook Error: ${eventResult.error}`);
  }

  const event = eventResult.event;
  const eventId = event.id;

  console.log(`[webhook] Reçu événement: ${event.type} (${eventId})`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[webhook] Session terminée: ${session.id}, Metadata:`, session.metadata);
        
        if (session.metadata?.type === 'scan_payment') {
          console.log(`[webhook] 🎯 Déclenchement du succès pour le scan: ${session.metadata?.scan_id}`);
          await handleScanPaymentSuccess(session);
        } else {
          await handleCheckoutCompleted(stripe, session, eventId);
        }
        break;

      case 'customer.subscription.updated':
        const updatedSub = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(updatedSub, eventId);
        break;

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSub, eventId);
        break;

      case 'invoice.paid':
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[webhook] Facture payée: ${invoice.id} pour le client ${invoice.customer}`);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log(`[webhook] Échec paiement facture: ${failedInvoice.id}`);
        break;

      default:
        console.log(`[webhook] Événement non géré: ${event.type}`);
        await sql`
          UPDATE stripe_events
          SET processed_at = CURRENT_TIMESTAMP, status = 'ignored', note = ${`Type non géré: ${event.type}`}
          WHERE id = ${eventId}
        `;
    }

    res.json({ received: true });

  } catch (error: any) {
    console.error(`[webhook] Erreur de traitement:`, error);
    try {
      await sql`
        UPDATE stripe_events
        SET processed_at = CURRENT_TIMESTAMP, status = 'failed', note = ${error?.message ?? String(error)}
        WHERE id = ${eventId}
      `;
    } catch (logErr) {
      // Ignorer
    }

    res.status(500).json({ error: 'Erreur de traitement du webhook' });
  }
});

// ============================================================
// GESTIONNAIRES D'ÉVÉNEMENTS
// ============================================================
async function handleScanPaymentSuccess(session: Stripe.Checkout.Session) {
  try {
    const scanId = session.metadata?.scan_id;
    const userId = session.metadata?.user_id;
    const userEmail = session.customer_email || session.customer_details?.email;

    if (!scanId) {
      console.error('[handleScanPaymentSuccess] scan_id manquant');
      return;
    }

    const stripePaymentId = (session.payment_intent as string) || session.id;

    // 1. Tenter la mise à jour de la ligne existante
    const updated = await sql`
      UPDATE scan_payments
      SET status = 'completed', stripe_payment_id = ${stripePaymentId}, paid_at = CURRENT_TIMESTAMP
      WHERE scan_id = ${scanId}
      RETURNING id
    `;

    // 2. Si non trouvée, insérer
    if (updated.length === 0) {
      await sql`
        INSERT INTO scan_payments (scan_id, user_id, user_email, stripe_payment_id, amount, currency, status, paid_at)
        VALUES (${scanId}, ${userId || 'anonymous'}, ${userEmail || null}, ${stripePaymentId}, 1.99, 'eur', 'completed', CURRENT_TIMESTAMP)
      `;
    }

    console.log(`[handleScanPaymentSuccess] ✅ Paiement Neon validé avec succès pour le scan ${scanId}`);
  } catch (error: any) {
    console.error('[handleScanPaymentSuccess] Erreur:', error);
  }
}

// ============================================================
// CRÉER UNE SESSION DE PAIEMENT POUR UN SCAN (Pay-per-scan)
// ============================================================
router.post('/create-scan-checkout', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email || 'user@example.com';

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const body = req.body || {};
    const scanId = body.scanId || `stripe_${userId}_${Date.now()}`;

    const origin = req.headers.origin || req.headers.referer || 'https://bpa-git-production-v01-e951.vercel.app';
    const successUrl = `${origin}/history?stripe-success=true&scanId=${scanId}`;
    const cancelUrl = `${origin}/history?stripe-cancel=true`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Audit Souverain BPA (Déblocage)',
              description: 'Analyse détaillée IA et comparaison avec les prix de marché BTP.',
            },
            unit_amount: 199, // 1.99€
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        scan_id: scanId,
        user_id: userId,
        type: 'scan_payment'
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ url: session.url, scanId });
  } catch (error: any) {
    console.error('[create-scan-checkout] Error:', error.message);
    res.status(500).json({ error: error.message || 'Erreur inconnue' });
  }
});

// ============================================================
// INFOS CLIENT STRIPE
// ============================================================
router.get('/customer', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const bsdRows = await sql`
      SELECT stripe_customer_id, stripe_subscription_id, statut, plan
      FROM bsd 
      WHERE user_id = ${userId}
      LIMIT 1
    `;

    const bsdData = bsdRows[0];

    if (!bsdData?.stripe_customer_id) {
      return res.json({
        hasCustomer: false,
        subscription: null
      });
    }

    const customer = await stripe.customers.retrieve(bsdData.stripe_customer_id) as Stripe.Customer;
    const subscriptions = await stripe.subscriptions.list({
      customer: bsdData.stripe_customer_id
    });

    res.json({
      hasCustomer: true,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name
      },
      subscriptions: subscriptions.data.map((sub: any) => ({
        id: sub.id,
        status: sub.status,
        current_period_end: sub.current_period_end || sub.current_period_start,
        items: sub.items.data.map((item: any) => ({
          price: {
            id: item.price.id,
            unit_amount: item.price.unit_amount,
            recurring: item.price.recurring
          }
        }))
      })),
      bsd: bsdData
    });

  } catch (error: any) {
    console.error('[get-customer] Error:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// ============================================================
// PRIX STRIPE
// ============================================================
router.get('/prices', async (req: express.Request, res: express.Response) => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product']
    });

    res.json({
      prices: prices.data.map(price => ({
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        recurring: price.recurring,
        product: typeof price.product === 'object' ? {
          id: price.product.id,
          name: (price.product as any).name,
          description: (price.product as any).description
        } : null
      }))
    });

  } catch (error: any) {
    console.error('[get-prices] Error:', error);
    res.status(500).json({ error: 'Erreur de récupération des prix' });
  }
});

// ============================================================
// PORTAIL STRIPE (Gestion d'abonnement)
// ============================================================
router.post('/portal-session', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const bsdRows = await sql`
      SELECT stripe_customer_id 
      FROM bsd 
      WHERE user_id = ${userId} 
      LIMIT 1
    `;

    const stripeCustomerId = bsdRows[0]?.stripe_customer_id;
    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'Aucun client Stripe associé' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://bpa-git-production-v01-e951.vercel.app';
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${frontendUrl}/dashboard`
    });

    res.json({ url: portalSession.url });

  } catch (error: any) {
    console.error('[portal-session] Error:', error);
    res.status(500).json({ error: 'Erreur de création du portail' });
  }
});

// ============================================================
// STATUT PAIEMENT SCAN (Vérifié dans Neon)
// ============================================================
router.get('/check-payment', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });

    const rows = await sql`
      SELECT status, paid_at, amount, scan_id
      FROM scan_payments
      WHERE user_id = ${userId} AND status = 'completed'
      ORDER BY paid_at DESC
      LIMIT 1
    `;

    if (rows.length > 0) {
      res.json({ unlocked: true, payment: rows[0] });
    } else {
      res.json({ unlocked: false });
    }

  } catch (error: any) {
    res.json({ unlocked: false });
  }
});

// ============================================================
// DÉBLOCAGE ADMIN (Enregistré dans Neon)
// ============================================================
router.post('/admin-unlock', async (req: express.Request, res: express.Response) => {
  const { userId, adminSecret } = req.body;
  
  if (adminSecret !== process.env.ADMIN_SECRET || !userId) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  try {
    const scanId = `admin_${userId}_${Date.now()}`;
    await sql`
      INSERT INTO scan_payments (scan_id, user_id, amount, currency, status, paid_at)
      VALUES (${scanId}, ${userId}, 0, 'eur', 'completed', CURRENT_TIMESTAMP)
    `;

    console.log(`[admin-unlock] ✅ Utilisateur ${userId} débloqué dans Neon.`);
    res.json({ success: true, scanId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
