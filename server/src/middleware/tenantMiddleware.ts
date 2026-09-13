import { Request, Response, NextFunction } from 'express';
import { resolveTenant, TenantContext } from '../services/tenantService';

export interface TenantRequest extends Request {
    tenant?: TenantContext;
}

export async function tenantMiddleware(
    req: TenantRequest,
    res: Response,
    next: NextFunction
) {
    // Option to skip middleware for public routes if needed
    if (req.path.startsWith('/public') || req.path === '/health') {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Missing Auth Header for path:', req.path);
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    try {
        const tenant = await resolveTenant(authHeader);
        req.tenant = tenant;
        next();
    } catch (error: any) {
        console.error('Tenant resolution error:', error.message);
        res.status(401).json({ error: 'Unauthorized: ' + error.message });
    }
}
