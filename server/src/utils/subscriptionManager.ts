import { supabase } from '../config/supabase';

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
  async saveSubscription(subscription: Subscription): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .upsert({
          ...subscription,
          updated_at: new Date(),
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, subscription: data };
    } catch (error) {
      console.error('Error saving subscription:', error);
      return { success: false, error: error.message };
    }
  }

  async getSubscription(userEmail: string): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_email', userEmail)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"

      return { success: true, subscription: data };
    } catch (error) {
      console.error('Error getting subscription:', error);
      return { success: false, error: error.message };
    }
  }

  async updateSubscriptionStatus(userEmail: string, status: Subscription['status']): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status, updated_at: new Date() })
        .eq('user_email', userEmail);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating subscription status:', error);
      return { success: false, error: error.message };
    }
  }

  async cancelSubscription(userEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'canceled',
          end_date: new Date(),
          updated_at: new Date()
        })
        .eq('user_email', userEmail);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return { success: false, error: error.message };
    }
  }

  async getActiveSubscriptions(): Promise<{ success: boolean; subscriptions?: Subscription[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      return { success: true, subscriptions: data };
    } catch (error) {
      console.error('Error getting active subscriptions:', error);
      return { success: false, error: error.message };
    }
  }
}

export const subscriptionManager = new SubscriptionManager();