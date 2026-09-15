import { sql } from '../config/db';

export class ScanPaymentService {
  async checkScanPayment(scanId: string, userId: string): Promise<{ paid: boolean; error?: string }> {
    try {
      const rows = await sql`
        SELECT status 
        FROM scan_payments 
        WHERE scan_id = ${scanId} AND user_id = ${userId} AND status = 'completed'
        LIMIT 1
      `;

      return { paid: rows.length > 0 };
    } catch (error: any) {
      console.error('Error checking scan payment:', error);
      return { paid: false, error: error.message };
    }
  }

  async createScanId(): Promise<string> {
    return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async recordScanAttempt(scanId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sql`
        INSERT INTO scan_attempts (scan_id, user_id, status)
        VALUES (${scanId}, ${userId}, 'pending_payment')
      `;

      return { success: true };
    } catch (error: any) {
      console.error('Error recording scan attempt:', error);
      return { success: false, error: error.message };
    }
  }

  async completeScanPayment(scanId: string, stripePaymentId: string, userEmail?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sql`
        UPDATE scan_payments
        SET status = 'completed', stripe_payment_id = ${stripePaymentId}, paid_at = CURRENT_TIMESTAMP
        WHERE scan_id = ${scanId}
      `;
      return { success: true };
    } catch (error: any) {
      console.error('Error completing scan payment:', error);
      return { success: false, error: error.message };
    }
  }
}

export const scanPaymentService = new ScanPaymentService();