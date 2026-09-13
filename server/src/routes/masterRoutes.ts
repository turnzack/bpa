import express from 'express';
import { getUserPermissions } from '../services/masterAuthService';

const router = express.Router();

// GET /api/auth/permissions
router.get('/permissions', async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';

        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }

        const jwt = authHeader.replace('Bearer ', '').trim();
        const permissions = await getUserPermissions(jwt);

        res.json(permissions);
    } catch (error: any) {
        console.error('Get permissions error:', error);
        res.status(500).json({ error: error.message || 'Internal error' });
    }
});

export default router;
