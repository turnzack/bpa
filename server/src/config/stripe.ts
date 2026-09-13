import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export const STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  prices: {
    monthly: process.env.STRIPE_PRICE_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_YEARLY!,
  },
  mode: process.env.NODE_ENV === 'production' ? 'live' : 'test',
};