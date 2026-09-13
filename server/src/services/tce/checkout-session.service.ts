// Service checkout Stripe adapté pour Express.js (Node.js)
// Original: supabase/functions/create-checkout-session-v2/index.ts

import Stripe from 'stripe';
import { supabase } from '../../config/supabase';

export interface CreateCheckoutSessionParams {
  accessToken: string;
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

    // Vérifier le token d'accès
    if (!accessToken) {
      return { success: false, error: "Le jeton d'accès est manquant." };
    }

    // Vérifier l'utilisateur via Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      console.error('[createCheckoutSession] User auth error:', userError);
      return { success: false, error: "Jeton d'accès invalide ou expiré." };
    }

    const userId = user.id;
    const userEmail = user.email;

    console.log('[createCheckoutSession] Fetching BSD profile for user:', userId);

    // Initialiser Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as any,
    });

    // Récupérer ou créer le profil BSD
    let { data: bsdData, error: selectError } = await supabase
      .from('bsd')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    // Aucun profil trouvé - créer avec upsert
    if (selectError && selectError.code === 'PGRST116') {
      console.warn('[createCheckoutSession] No BSD profile found. Attempting upsert for user:', userId);
      
      const { data: newBsdData, error: upsertError } = await supabase
        .from('bsd')
        .upsert({ 
          user_id: userId, 
          user_email: userEmail, 
          statut: 'inactive',
          nom: userEmail?.split('@')[0] || 'Utilisateur'
        }, { 
          onConflict: 'user_id' 
        })
        .select('stripe_customer_id')
        .single();
      
      if (upsertError) {
        console.error('[createCheckoutSession] BSD upsert error:', upsertError);
        throw new Error(`Échec de la création du profil utilisateur: ${upsertError.message}`);
      }
      
      console.log('[createCheckoutSession] BSD upsert success. Data:', newBsdData);
      bsdData = newBsdData;
    } else if (selectError) {
      console.error('[createCheckoutSession] BSD select error:', selectError);
      throw new Error(`Erreur lors de la récupération des données client: ${selectError.message}`);
    }

    let stripeCustomerId = bsdData?.stripe_customer_id;

    // Créer un client Stripe s'il n'existe pas
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail!,
        metadata: { user_id: userId }
      });
      
      console.log('[createCheckoutSession] Stripe customer created:', { 
        id: customer.id, 
        email: customer.email 
      });
      
      stripeCustomerId = customer.id;
      
      const { error: updateError } = await supabase
        .from('bsd')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('[createCheckoutSession] BSD update error:', updateError);
        throw new Error(`Échec de la mise à jour avec l'ID client Stripe: ${updateError.message}`);
      }
    }

    // Vérifier les paramètres requis
    if (!priceId || !successUrl || !cancelUrl) {
      return { 
        success: false, 
        error: "priceId, successUrl et cancelUrl sont requis." 
      };
    }

    // Récupérer les détails du prix pour déterminer le mode
    const price = await stripe.prices.retrieve(priceId);

    // Créer la session de checkout
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

    console.log('[createCheckoutSession] Session created:', session.id);

    return {
      success: true,
      sessionId: session.id,
      url: session.url || undefined
    };

  } catch (err: any) {
    console.error('[createCheckoutSession] Error:', err);
    return {
      success: false,
      error: err.message || "Erreur interne du serveur."
    };
  }
}
