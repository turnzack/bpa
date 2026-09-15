import { sql } from '../config/db';

export interface Subscription {
  id?: string;
  user_email: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  plan: string;
  start_date?: Date;
  end_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class SubscriptionManager {
  async saveSubscription(sub: Subscription): Promise<{ success: boolean; subscription?: any; error?: string }> {
    try {
      const rows = await sql`
        INSERT INTO bsd (user_email, stripe_customer_id, stripe_subscription_id, statut, plan, subscription_end_date, updated_at)
        VALUES (${sub.user_email}, ${sub.stripe_customer_id || null}, ${sub.stripe_subscription_id || null}, ${sub.status}, ${sub.plan || 'standard'}, ${sub.end_date ? sub.end_date.toISOString() : null}, CURRENT_TIMESTAMP)
        ON CONFLICT (stripe_customer_id) DO UPDATE SET
          statut = EXCLUDED.statut,
          plan = EXCLUDED.plan,
          stripe_subscription_id = EXCLUDED.stripe_subscription_id,
          subscription_end_date = EXCLUDED.subscription_end_date,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;

      return { success: true, subscription: rows[0] };
    } catch (error: any) {
      console.error('Error saving subscription:', error);
      return { success: false, error: error.message };
    }
  }

  async getSubscription(userEmail: string): Promise<{ success: boolean; subscription?: any; error?: string }> {
    try {
      const rows = await sql`
        SELECT * FROM bsd
        WHERE user_email = ${userEmail} AND statut = 'active'
        LIMIT 1
      `;

      return { success: true, subscription: rows[0] || null };
    } catch (error: any) {
      console.error('Error getting subscription:', error);
      return { success: false, error: error.message };
    }
  }

  async updateSubscriptionStatus(userEmail: string, status: Subscription['status']): Promise<{ success: boolean; error?: string }> {
    try {
      await sql`
        UPDATE bsd
        SET statut = ${status}, updated_at = CURRENT_TIMESTAMP
        WHERE user_email = ${userEmail}
      `;

      return { success: true };
    } catch (error: any) {
      console.error('Error updating subscription status:', error);
      return { success: false, error: error.message };
    }
  }

  async cancelSubscription(userEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sql`
        UPDATE bsd
        SET statut = 'canceled', annuler_en_fin_de_periode = true, updated_at = CURRENT_TIMESTAMP
        WHERE user_email = ${userEmail}
      `;

      return { success: true };
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      return { success: false, error: error.message };
    }
  }

  async getActiveSubscriptions(): Promise<{ success: boolean; subscriptions?: any[]; error?: string }> {
    try {
      const rows = await sql`
        SELECT * FROM bsd
        WHERE statut = 'active'
      `;

      return { success: true, subscriptions: rows };
    } catch (error: any) {
      console.error('Error getting active subscriptions:', error);
      return { success: false, error: error.message };
    }
  }
}

export const subscriptionManager = new SubscriptionManager();