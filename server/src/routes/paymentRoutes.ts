import express from 'express';
import { checkScanPaymentStatus } from '../services/scanPaymentService';
import { masterSupabase } from '../config/supabase';

const router = express.Router();

// Middleware to authenticate user
const authenticateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authHeader = req.headers.authorization || '';

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }

        const jwt = authHeader.replace('Bearer ', '').trim();
        const { data: { user }, error: authError } = await masterSupabase.auth.getUser(jwt);

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

// Check if user has valid scan payment
router.post('/check-scan-payment', authenticateUser, async (req: express.Request, res: express.Response) => {
    try {
        const { scanId } = req.body;
        const user = req.user;

        if (!user?.email) {
            return res.status(401).json({ error: 'User email not found' });
        }

        const hasValidPayment = await checkScanPaymentStatus(user.id, scanId);

        res.json({ hasValidPayment });
    } catch (error) {
        console.error('Error checking scan payment:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
});

export default router;