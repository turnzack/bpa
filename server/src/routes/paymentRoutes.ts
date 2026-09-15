import express from 'express';
import Stripe from 'stripe';
import { sql } from '../config/db';
import { scanPaymentService } from '../services/scanPaymentService';
import { authenticateUser, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
});

// ============================================================
// 1. VÉRIFIER SI UN SCAN EST PAYÉ DANS NEON POSTGRESQL
// ============================================================
router.post('/check-scan-payment', authenticateUser, async (req: AuthRequest, res: express.Response) => {
    try {
        const { scanId } = req.body;
        const user = req.user;

        if (!scanId) {
            return res.status(400).json({ error: 'scanId manquant' });
        }

        // Vérification directe dans Neon
        const rows = await sql`
            SELECT id, scan_id, user_id, status, stripe_payment_id, paid_at, amount
            FROM scan_payments
            WHERE scan_id = ${scanId} AND status = 'completed'
            LIMIT 1
        `;

        const hasValidPayment = rows.length > 0;

        res.json({
            hasValidPayment,
            paid: hasValidPayment,
            scanId,
            payment: hasValidPayment ? rows[0] : null
        });
    } catch (error: any) {
        console.error('[check-scan-payment] Erreur:', error);
        res.status(500).json({ error: 'Échec de la vérification du paiement' });
    }
});

// ============================================================
// 2. VÉRIFICATION EN DIRECT D'UNE SESSION STRIPE CHECKOUT & SYNCHRO NEON
// ============================================================
router.post('/verify-checkout-session', authenticateUser, async (req: AuthRequest, res: express.Response) => {
    try {
        const { sessionId, scanId } = req.body;
        const user = req.user;

        if (!sessionId) {
            return res.status(400).json({ error: 'sessionId manquant' });
        }

        console.log(`[verify-checkout-session] Vérification session Stripe ${sessionId} pour scan ${scanId}`);

        // Interroger l'API Stripe en direct
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const targetScanId = scanId || session.metadata?.scan_id || `scan_${session.id}`;
            const targetUserId = user?.id || session.metadata?.user_id || 'anonymous';
            const customerEmail = session.customer_details?.email || user?.email || null;
            const paymentIntentId = (session.payment_intent as string) || session.id;

            // 1. Mettre à jour dans Neon
            const updated = await sql`
                UPDATE scan_payments
                SET status = 'completed', stripe_payment_id = ${paymentIntentId}, paid_at = CURRENT_TIMESTAMP
                WHERE scan_id = ${targetScanId}
                RETURNING id
            `;

            // 2. Si aucune ligne pré-existante, l'insérer
            if (updated.length === 0) {
                await sql`
                    INSERT INTO scan_payments (scan_id, user_id, user_email, stripe_payment_id, amount, currency, status, paid_at)
                    VALUES (${targetScanId}, ${targetUserId}, ${customerEmail}, ${paymentIntentId}, 1.99, 'eur', 'completed', CURRENT_TIMESTAMP)
                `;
            }

            console.log(`[verify-checkout-session] ✅ Paiement Stripe confirmé et validé dans Neon pour ${targetScanId}`);

            return res.json({
                success: true,
                hasValidPayment: true,
                scanId: targetScanId,
                paymentIntentId
            });
        } else {
            return res.json({
                success: false,
                hasValidPayment: false,
                paymentStatus: session.payment_status
            });
        }
    } catch (error: any) {
        console.error('[verify-checkout-session] Erreur:', error);
        res.status(500).json({ error: error.message || 'Erreur lors de la vérification Stripe' });
    }
});

// ============================================================
// 3. SIMULATION / VALIDATION DIRECTE DU PAIEMENT (MODE TEST / ACCÈS IMMÉDIAT)
// ============================================================
router.post('/simulate-scan-payment', authenticateUser, async (req: AuthRequest, res: express.Response) => {
    try {
        const { scanId } = req.body;
        const user = req.user;

        if (!scanId || !user?.id) {
            return res.status(400).json({ error: 'scanId et utilisateur requis' });
        }

        const fakePaymentId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        const updated = await sql`
            UPDATE scan_payments
            SET status = 'completed', stripe_payment_id = ${fakePaymentId}, paid_at = CURRENT_TIMESTAMP
            WHERE scan_id = ${scanId}
            RETURNING id
        `;

        if (updated.length === 0) {
            await sql`
                INSERT INTO scan_payments (scan_id, user_id, user_email, stripe_payment_id, amount, currency, status, paid_at)
                VALUES (${scanId}, ${user.id}, ${user.email || null}, ${fakePaymentId}, 1.99, 'eur', 'completed', CURRENT_TIMESTAMP)
            `;
        }

        console.log(`[simulate-scan-payment] ✅ Scan ${scanId} validé dans Neon pour l'utilisateur ${user.id}`);

        res.json({
            success: true,
            hasValidPayment: true,
            scanId,
            message: 'Paiement du scan validé avec succès dans Neon'
        });
    } catch (error: any) {
        console.error('[simulate-scan-payment] Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la validation' });
    }
});

export default router;