import Stripe from 'stripe';
import { stripe, STRIPE_CONFIG } from '../config/stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = stripe;
  }

  async createCustomer(userData: { email: string; name?: string }) {
    try {
      const customer = await this.stripe.customers.create({
        email: userData.email,
        name: userData.name,
        description: `User created on ${new Date().toISOString().split('T')[0]}`,
      });
      return { success: true, customer };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      return { success: false, error: error.message };
    }
  }

  async getCustomerByEmail(email: string) {
    try {
      const customers = await this.stripe.customers.list({ email });
      if (customers.data.length > 0) {
        return { success: true, customer: customers.data[0] };
      }
      return { success: false, error: 'No customer found with this email' };
    } catch (error) {
      console.error('Error retrieving Stripe customer:', error);
      return { success: false, error: error.message };
    }
  }

  async updateCustomer(customerId: string, updateData: any) {
    try {
      const customer = await this.stripe.customers.update(customerId, updateData);
      return { success: true, customer };
    } catch (error) {
      console.error('Error updating Stripe customer:', error);
      return { success: false, error: error.message };
    }
  }

  async getCustomerSubscriptions(customerId: string) {
    try {
      const subscriptions = await this.stripe.subscriptions.list({ customer: customerId });
      return { success: true, subscriptions };
    } catch (error) {
      console.error('Error retrieving customer subscriptions:', error);
      return { success: false, error: error.message };
    }
  }

  async createScanPaymentSession(userEmail: string, userId: string, scanId: string, successUrl: string, cancelUrl: string) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Analyse de Devis - Scan Unique',
              description: 'Paiement pour l\'analyse d\'un devis par IA',
            },
            unit_amount: 199, // 1.99 EUR in cents
          },
          quantity: 1,
        }],
        mode: 'payment', // One-time payment instead of subscription
        customer_email: userEmail,
        metadata: {
          scan_id: scanId,
          user_id: userId,
          type: 'scan_payment',
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      return { success: true, session };
    } catch (error) {
      console.error('Error creating scan payment session:', error);
      return { success: false, error: error.message };
    }
  }

  async constructEvent(payload: string | Buffer, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, STRIPE_CONFIG.webhookSecret);
      return { success: true, event };
    } catch (error) {
      console.error('Error constructing webhook event:', error);
      return { success: false, error: error.message };
    }
  }
}

export const stripeService = new StripeService();