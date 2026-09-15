import express from 'express';
import { scanPaymentService } from '../services/scanPaymentService';
import { authenticateUser, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Vérifier si l'utilisateur a payé pour un scan
router.post('/check-scan-payment', authenticateUser, async (req: AuthRequest, res: express.Response) => {
    try {
        const { scanId } = req.body;
        const user = req.user;

        if (!user?.id) {
            return res.status(401).json({ error: 'Utilisateur non identifié' });
        }

        const paymentCheck = await scanPaymentService.checkScanPayment(scanId, user.id);

        res.json({ hasValidPayment: paymentCheck.paid });
    } catch (error: any) {
        console.error('Error checking scan payment:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
});

export default router;