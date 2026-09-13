import { supabase } from '../config/supabase';

export class ScanPaymentService {
  async checkScanPayment(scanId: string, userId: string): Promise<{ paid: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('scan_payments')
        .select('status')
        .eq('scan_id', scanId)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        return { paid: false, error: error.message };
      }

      return { paid: !!data };
    } catch (error) {
      console.error('Error checking scan payment:', error);
      return { paid: false, error: error.message };
    }
  }

  async createScanId(): Promise<string> {
    // Generate a unique scan ID
    return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async recordScanAttempt(scanId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('scan_attempts')
        .insert({
          scan_id: scanId,
          user_id: userId,
          attempted_at: new Date(),
          status: 'pending_payment',
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error recording scan attempt:', error);
      return { success: false, error: error.message };
    }
  }
}

export const scanPaymentService = new ScanPaymentService();