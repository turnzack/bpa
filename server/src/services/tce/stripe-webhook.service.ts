// Service webhook Stripe adapté pour Express.js (Node.js)
// Original: supabase/functions/stripe-webhook/index.ts

import Stripe from 'stripe';
import { supabase } from '../../config/supabase';

interface EventRecord {
  id: string;
  type: string;
  processed_at?: string;
  status?: string;
  note?: string;
}

async function insertEventRecord(ev: EventRecord) {
  const { error } = await supabase
    .from('stripe_events')
    .insert([{
      id: ev.id,
      type: ev.type,
      processed_at: new Date().toISOString(),
      status: 'processing',
      note: null
    }]);
  return error;
}

async function markEventProcessed(
  eventId: string,
  status = 'processed',
  note: string | null = null
) {
  await supabase
    .from('stripe_events')
    .update({
      processed_at: new Date().toISOString(),
      status,
      note
    })
    .eq('id', eventId);
}

export async function handleCheckoutCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  eventId: string
) {
  const stripeCustomerId = session.customer as string;
  
  if (!stripeCustomerId) {
    await markEventProcessed(eventId, 'invalid', 'stripe_customer_id manquant');
    return { success: false, error: 'stripe_customer_id manquant' };
  }

  const subscriptionId = session.subscription as string;
  
  // Paiement unique (non-abonnement)
  if (!subscriptionId) {
    // Mise à jour avec les champs de la table BSD existante
    const updatePayload = { 
      statut: 'active',
      updated_at: new Date().toISOString()
    };
    await supabase
      .from('bsd')
      .update(updatePayload)
      .eq('stripe_customer_id', stripeCustomerId);
    
    await markEventProcessed(eventId, 'processed', 'Paiement unique traité.');
    return { success: true, type: 'one_time_payment', customerId: stripeCustomerId };
  }

  // Abonnement - récupérer tous les détails
  const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);

  // Mise à jour avec les champs de la table BSD existante
  const updatePayload = {
    stripe_subscription_id: subscription.id,
    statut: subscription.status,
    subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    date_fin: new Date(subscription.current_period_end * 1000).toISOString(),
    date_fin_ts: new Date(subscription.current_period_end * 1000),
    annuler_en_fin_de_periode: subscription.cancel_at_period_end || false,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('bsd')
    .update(updatePayload)
    .eq('stripe_customer_id', stripeCustomerId)
    .select('id, user_id');

  if (error) {
    console.error(`[${eventId}] Erreur de mise à jour Supabase:`, error.message);
    await markEventProcessed(eventId, 'failed', `Erreur Supabase: ${error.message}`);
    throw error;
  }

  if (!data || data.length === 0) {
    await markEventProcessed(eventId, 'not_found', `aucune ligne pour stripe_customer_id=${stripeCustomerId}`);
    return { success: false, error: 'Utilisateur non trouvé' };
  }

  await markEventProcessed(
    eventId,
    'processed',
    `Abonnement ${subscription.id} activé pour l'utilisateur ${data[0].user_id}.`
  );
  
  return {
    success: true,
    type: 'subscription',
    customerId: stripeCustomerId,
    userId: data[0].user_id,
    subscriptionId: subscription.id,
    status: subscription.status
  };
}

export async function handleSubscriptionUpdate(
  subscription: any,
  eventId: string
) {
  // Mise à jour avec les champs de la table BSD existante
  const updatePayload = {
    statut: subscription.status,
    subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    date_fin: new Date(subscription.current_period_end * 1000).toISOString(),
    date_fin_ts: new Date(subscription.current_period_end * 1000),
    annuler_en_fin_de_periode: subscription.cancel_at_period_end || false,
    updated_at: new Date().toISOString()
  };
  
  await supabase
    .from('bsd')
    .update(updatePayload)
    .eq('stripe_subscription_id', subscription.id);
  
  await markEventProcessed(
    eventId,
    'processed',
    `Abonnement ${subscription.id} mis à jour à ${subscription.status}.`
  );
  
  return { success: true, subscriptionId: subscription.id, status: subscription.status };
}

export async function handleSubscriptionDeleted(
  subscription: any,
  eventId: string
) {
  // Mise à jour avec les champs de la table BSD existante
  await supabase
    .from('bsd')
    .update({
      statut: 'cancelled',
      subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
      date_fin: new Date(subscription.current_period_end * 1000).toISOString(),
      date_fin_ts: new Date(subscription.current_period_end * 1000),
      annuler_en_fin_de_periode: true,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);
  
  await markEventProcessed(
    eventId,
    'processed',
    `Abonnement ${subscription.id} annulé.`
  );
  
  return { success: true, subscriptionId: subscription.id };
}

/**
 * Construit et vérifie un événement webhook Stripe
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): { success: boolean; event?: Stripe.Event; error?: string } {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as any,
    });
    
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    return { success: true, event };
  } catch (err: any) {
    console.error('Erreur construction événement webhook:', err.message);
    return { success: false, error: err.message };
  }
}
