// Routes Stripe avec intégration Supabase complète
// Inspiré de: supabase/functions/stripe-webhook et supabase/functions/create-checkout-session-v2

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
import { supabase } from '../config/supabase';
import { authenticateUser, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Initialiser Stripe pour les routes
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// ============================================================
// CRÉER UNE SESSION DE PAIEMENT (Checkout)
// ============================================================

/**
 * POST /api/stripe/create-checkout-session
 * Crée une session de paiement Stripe pour un abonnement ou paiement unique
 * Requires: Bearer token (Supabase Auth)
 */
router.post('/create-checkout-session', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Récupérer le token d'accès depuis le header
    const authHeader = req.headers.authorization || '';
    const accessToken = authHeader.replace('Bearer ', '').trim();

    const result = await createCheckoutSession({
      accessToken,
      priceId,
      successUrl: successUrl || `${process.env.FRONTEND_URL}/success`,
      cancelUrl: cancelUrl || `${process.env.FRONTEND_URL}/cancel`
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

/**
 * POST /api/stripe/create-scan-payment
 * Crée une session de paiement pour un scan unique (paiement unique)
 * Requires: Bearer token (Supabase Auth)
 */
router.post('/create-scan-payment', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const { scanId } = req.body;
    const user = req.user;

    if (!user?.email || !user?.id || !scanId) {
      return res.status(400).json({ error: 'scanId requis et utilisateur authentifié' });
    }

    const successUrl = `${process.env.FRONTEND_URL}/scan/${scanId}/success`;
    const cancelUrl = `${process.env.FRONTEND_URL}/scan/${scanId}/cancel`;

    // Utiliser le service existant pour les paiements uniques
    const result = await stripeService.createScanPaymentSession(
      user.email,
      user.id,
      scanId,
      successUrl,
      cancelUrl
    );

    if (result.success && result.session) {
      res.json({
        sessionId: result.session.id,
        url: result.session.url!
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

/**
 * POST /api/stripe/webhook
 * Webhook pour recevoir les événements Stripe
 * Gère: checkout.session.completed, customer.subscription.*, etc.
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: express.Request, res: express.Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET non configuré');
    return res.status(500).send('Configuration serveur manquante');
  }

  // Construire l'événement
  const eventResult = constructWebhookEvent(req.body, sig, webhookSecret);

  if (!eventResult.success || !eventResult.event) {
    return res.status(400).send(`Webhook Error: ${eventResult.error}`);
  }

  const event = eventResult.event;
  const eventId = event.id;

  console.log(`[webhook] Reçu événement: ${event.type} (${eventId})`);

  try {
    // Traiter l'événement
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
        // Optionnel: mettre à jour l'historique de paiement
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log(`[webhook] Échec paiement facture: ${failedInvoice.id}`);
        // Optionnel: marquer l'abonnement comme en retard
        break;

      default:
        console.log(`[webhook] Événement non géré: ${event.type}`);
        // Enregistrer l'événement comme ignoré
        await supabase
          .from('stripe_events')
          .update({
            processed_at: new Date().toISOString(),
            status: 'ignored',
            note: `Type d'événement non géré: ${event.type}`
          })
          .eq('id', eventId);
    }

    res.json({ received: true });

  } catch (error: any) {
    console.error(`[webhook] Erreur de traitement:`, error);
    
    // Marquer l'événement comme échoué
    await supabase
      .from('stripe_events')
      .update({
        processed_at: new Date().toISOString(),
        status: 'failed',
        note: error?.message ?? String(error)
      })
      .eq('id', eventId);

    res.status(500).json({ error: 'Erreur de traitement du webhook' });
  }
});

// ============================================================
// GESTIONNAIRES D'ÉVÉNEMENTS
// ============================================================

/**
 * Gère le succès d'un paiement de scan unique
 */
async function handleScanPaymentSuccess(session: Stripe.Checkout.Session) {
  try {
    const scanId = session.metadata?.scan_id;
    const userId = session.metadata?.user_id;
    const userEmail = session.customer_email;

    if (!scanId || !userId) {
      console.error('[handleScanPaymentSuccess] scan_id ou user_id manquant');
      return;
    }

    // Enregistrer le paiement dans Supabase
    const { error: paymentError } = await supabase
      .from('scan_payments')
      .insert({
        scan_id: scanId,
        user_id: userId,
        user_email: userEmail,
        stripe_payment_id: session.payment_intent,
        amount: 2.49,
        currency: 'eur',
        status: 'completed',
        paid_at: new Date(),
      });

    if (paymentError) {
      console.warn('[handleScanPaymentSuccess] Table scan_payments introuvable ou erreur. Le déblocage se fera via le deep link et l\'historique local.');
    } else {
      console.log(`[handleScanPaymentSuccess] ✅ Paiement enregistré en DB pour le scan ${scanId}`);
    }

    // Tenter de mettre à jour la table devis si elle existe
    const { error: devisError } = await supabase
      .from('devis')
      .update({ status: 'completed' })
      .eq('scan_id', scanId);

    if (devisError) {
      console.log(`[handleScanPaymentSuccess] Info: Table 'devis' non utilisée pour cet audit souverain.`);
    }

  } catch (error: any) {
    console.error('[handleScanPaymentSuccess] Erreur:', error);
  }
}

// ============================================================
// CRÉER UNE SESSION DE PAIEMENT POUR UN SCAN (Pay-per-scan)
// ============================================================

/**
 * POST /api/stripe/create-scan-checkout
 * Crée une session Checkout Stripe spécifique à 1.99€ pour l'IA
 */
router.post('/create-scan-checkout', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email || 'user@example.com';

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    console.log('[DEBUG] 📥 Appel create-scan-checkout reçu ! User:', req.user?.id);
    const body = req.body || {};
    const { scanId: requestedScanId } = body;
    const scanId = requestedScanId || `stripe_${userId}_${Date.now()}`;

    // Déterminer l'URL de base pour la redirection (Web vs Mobile)
    const origin = req.headers.origin || req.headers.referer || 'exp://192.168.1.148:8081';
    const isWeb = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.startsWith('http');
    
    // Pour le Web, on utilise l'origine HTTP. Pour Mobile, on garde le schéma exp:// ou custom
    const successUrl = isWeb 
      ? `${origin}/history?stripe-success=true&scanId=${scanId}`
      : `exp://192.168.1.148:8081/--/stripe-success?scanId=${scanId}`;
      
    const cancelUrl = isWeb
      ? `${origin}/history?stripe-cancel=true`
      : `exp://192.168.1.148:8081/--/stripe-cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Audit Souverain Gemma (Déblocage)',
              description: 'Révélation complète de l\'audit IA sur 45 000 prix.',
            },
            unit_amount: 249, // 2.49€
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

    console.log('[Stripe] Checkout URL générée:', session.url);
    res.json({ url: session.url, scanId });
  } catch (error: any) {
    console.error('[create-scan-checkout] Error details:', error.message);
    res.status(500).json({ error: error.message || 'Erreur inconnue' });
  }
});

// ============================================================
// ROUTES UTILITAIRES
// ============================================================

/**
 * GET /api/stripe/customer
 * Récupère les informations du client Stripe de l'utilisateur
 */
router.get('/customer', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Récupérer le customer_id depuis la table bsd
    const { data: bsdData, error: bsdError } = await supabase
      .from('bsd')
      .select('stripe_customer_id, stripe_subscription_id, statut')
      .eq('user_id', userId)
      .single();

    if (bsdError && bsdError.code !== 'PGRST116') {
      console.error('[get-customer] Erreur BSD:', bsdError);
      return res.status(500).json({ error: 'Erreur de récupération des données' });
    }

    if (!bsdData?.stripe_customer_id) {
      return res.json({
        hasCustomer: false,
        subscription: null
      });
    }

    // Récupérer les détails du client Stripe
    const customer = await stripe.customers.retrieve(bsdData.stripe_customer_id) as Stripe.Customer;
    
    // Récupérer les abonnements
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
      bsd: {
        stripe_customer_id: bsdData.stripe_customer_id,
        stripe_subscription_id: bsdData.stripe_subscription_id,
        statut: bsdData.statut
      }
    });

  } catch (error: any) {
    console.error('[get-customer] Error:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

/**
 * GET /api/stripe/prices
 * Récupère la liste des prix Stripe
 */
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

/**
 * POST /api/stripe/portal-session
 * Crée une session pour le portail client Stripe (gestion abonnement)
 */
router.post('/portal-session', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Récupérer le customer_id
    const { data: bsdData, error: bsdError } = await supabase
      .from('bsd')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (bsdError || !bsdData?.stripe_customer_id) {
      return res.status(400).json({ error: 'Aucun client Stripe trouvé' });
    }

    // Créer la session du portail
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: bsdData.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/dashboard`
    });

    res.json({ url: portalSession.url });

  } catch (error: any) {
    console.error('[portal-session] Error:', error);
    res.status(500).json({ error: 'Erreur de création du portail' });
  }
});

// ============================================================
// ROUTES WERO (Paiement peer-to-peer)
// ============================================================

/**
 * POST /api/stripe/wero-confirm
 * L'utilisateur confirme manuellement son paiement Wero.
 * Le serveur enregistre dans Supabase et renvoie un token de déblocage.
 */
router.post('/wero-confirm', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const { amount = 1.99 } = req.body;

    if (!userId) return res.status(401).json({ error: 'Non authentifié' });

    // Enregistrer le paiement Wero dans scan_payments
    const scanId = `wero_${userId}_${Date.now()}`;
    const { error } = await supabase
      .from('scan_payments')
      .insert({
        scan_id: scanId,
        user_id: userId,
        user_email: userEmail,
        stripe_payment_id: null,
        amount,
        currency: 'eur',
        status: 'completed',
        paid_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('[wero-confirm] scan_payments insert failed, trying users table:', error.message);
      // Tentative de mise à jour de la table users
      await supabase
        .from('users')
        .upsert({ id: userId, devis_unlocked: true, payment_date: new Date().toISOString(), payment_method: 'wero' }, { onConflict: 'id' });
    }

    console.log(`[wero-confirm] ✅ Paiement Wero enregistré pour ${userEmail || userId}`);
    res.json({ success: true, scanId, message: 'Paiement Wero confirmé. Accès débloqué !' });

  } catch (error: any) {
    console.error('[wero-confirm] Error:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la confirmation Wero' });
  }
});

/**
 * GET /api/stripe/check-payment
 * Polling depuis le mobile pour savoir si le paiement est validé côté Supabase.
 */
router.get('/check-payment', authenticateUser, async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });

    // Chercher un paiement completed
    const { data } = await supabase
      .from('scan_payments')
      .select('status, paid_at, amount')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('paid_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      res.json({ unlocked: true, payment: data });
    } else {
      res.json({ unlocked: false });
    }

  } catch (error: any) {
    res.json({ unlocked: false });
  }
});

/**
 * POST /api/stripe/admin-unlock
 * Endpoint admin pour débloquer manuellement un utilisateur (après vérification du virement sur Nikel).
 * Protégé par un secret admin.
 */
router.post('/admin-unlock', async (req: express.Request, res: express.Response) => {
  const { userId, adminSecret } = req.body;
  
  if (adminSecret !== process.env.ADMIN_SECRET || !userId) {
    return res.status(403).json({ error: 'Accès refusé' });
  }

  const { error } = await supabase
    .from('scan_payments')
    .insert({
      scan_id: `admin_${userId}_${Date.now()}`,
      user_id: userId,
      amount: 0,
      currency: 'eur',
      status: 'completed',
      paid_at: new Date().toISOString(),
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  console.log(`[admin-unlock] ✅ Utilisateur ${userId} débloqué manuellement.`);
  res.json({ success: true });
});

export default router;
