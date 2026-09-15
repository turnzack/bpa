// Service webhook Stripe adapté pour Express.js avec Neon PostgreSQL
import Stripe from 'stripe';
import { sql } from '../../config/db';

interface EventRecord {
  id: string;
  type: string;
  processed_at?: string;
  status?: string;
  note?: string;
}

async function insertEventRecord(ev: EventRecord) {
  try {
    await sql`
      INSERT INTO stripe_events (id, type, processed_at, status, note)
      VALUES (${ev.id}, ${ev.type}, CURRENT_TIMESTAMP, 'processing', null)
      ON CONFLICT (id) DO UPDATE SET status = 'processing', processed_at = CURRENT_TIMESTAMP
    `;
  } catch (err: any) {
    console.error(`[stripe-webhook] Erreur insertEventRecord:`, err.message);
  }
}

async function markEventProcessed(
  eventId: string,
  status = 'processed',
  note: string | null = null
) {
  try {
    await sql`
      UPDATE stripe_events
      SET processed_at = CURRENT_TIMESTAMP, status = ${status}, note = ${note}
      WHERE id = ${eventId}
    `;
  } catch (err: any) {
    console.error(`[stripe-webhook] Erreur markEventProcessed:`, err.message);
  }
}

export async function handleCheckoutCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
  eventId: string
) {
  await insertEventRecord({ id: eventId, type: 'checkout.session.completed' });

  const stripeCustomerId = session.customer as string;
  
  if (!stripeCustomerId) {
    await markEventProcessed(eventId, 'invalid', 'stripe_customer_id manquant');
    return { success: false, error: 'stripe_customer_id manquant' };
  }

  const subscriptionId = session.subscription as string;
  
  // Cas 1 : Paiement unique de scan (type === 'scan_payment')
  const metadata = session.metadata || {};
  if (metadata.scan_id) {
    try {
      await sql`
        UPDATE scan_payments
        SET status = 'completed', stripe_payment_id = ${session.payment_intent as string || session.id}, paid_at = CURRENT_TIMESTAMP
        WHERE scan_id = ${metadata.scan_id}
      `;
      await markEventProcessed(eventId, 'processed', `Scan ${metadata.scan_id} débloqué avec succès.`);
      return { success: true, type: 'scan_payment', scanId: metadata.scan_id };
    } catch (err: any) {
      console.error(`[${eventId}] Erreur scan_payments:`, err.message);
    }
  }

  // Cas 2 : Paiement unique standard
  if (!subscriptionId) {
    await sql`
      UPDATE bsd
      SET statut = 'active', updated_at = CURRENT_TIMESTAMP
      WHERE stripe_customer_id = ${stripeCustomerId}
    `;
    await markEventProcessed(eventId, 'processed', 'Paiement unique traité.');
    return { success: true, type: 'one_time_payment', customerId: stripeCustomerId };
  }

  // Cas 3 : Abonnement récurrent
  const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);
  const endDate = new Date(subscription.current_period_end * 1000).toISOString();

  const rows = await sql`
    UPDATE bsd
    SET 
      stripe_subscription_id = ${subscription.id},
      statut = ${subscription.status},
      subscription_end_date = ${endDate},
      date_fin = ${endDate},
      annuler_en_fin_de_periode = ${subscription.cancel_at_period_end || false},
      updated_at = CURRENT_TIMESTAMP
    WHERE stripe_customer_id = ${stripeCustomerId}
    RETURNING id, user_id
  `;

  if (rows.length === 0) {
    await markEventProcessed(eventId, 'not_found', `aucune ligne bsd pour stripe_customer_id=${stripeCustomerId}`);
    return { success: false, error: 'Utilisateur non trouvé dans Neon' };
  }

  await markEventProcessed(
    eventId,
    'processed',
    `Abonnement ${subscription.id} activé pour l'utilisateur ${rows[0].user_id}.`
  );
  
  return {
    success: true,
    type: 'subscription',
    customerId: stripeCustomerId,
    userId: rows[0].user_id,
    subscriptionId: subscription.id,
    status: subscription.status
  };
}

export async function handleSubscriptionUpdate(
  subscription: any,
  eventId: string
) {
  const endDate = new Date(subscription.current_period_end * 1000).toISOString();
  
  await sql`
    UPDATE bsd
    SET 
      statut = ${subscription.status},
      subscription_end_date = ${endDate},
      date_fin = ${endDate},
      annuler_en_fin_de_periode = ${subscription.cancel_at_period_end || false},
      updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ${subscription.id}
  `;
  
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
  const endDate = new Date(subscription.current_period_end * 1000).toISOString();

  await sql`
    UPDATE bsd
    SET 
      statut = 'canceled',
      subscription_end_date = ${endDate},
      date_fin = ${endDate},
      annuler_en_fin_de_periode = true,
      updated_at = CURRENT_TIMESTAMP
    WHERE stripe_subscription_id = ${subscription.id}
  `;
  
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
