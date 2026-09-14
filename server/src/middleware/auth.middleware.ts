import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kirov5-fallback-secret-key-32chars!';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

/**
 * Middleware pour protéger les routes avec JWT
 */
export async function authenticateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Header d\\'autorisation manquant. Format requis: Bearer <token>' });
      return;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token invalide ou expiré' });
      return;
    }
  } catch (error: any) {
    console.error('[authenticateUser] Middleware error:', error);
    res.status(500).json({ error: 'Échec de l\\'authentification' });
  }
}

/**
 * Middleware optionnel
 */
export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization || '';

    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role
        };
      } catch (err) {
        // Ignorer
      }
    }
    
    next();
  } catch (error) {
    next();
  }
}

/**
 * Middleware pour vérifier un rôle spécifique
 */
export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentification requise' });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({ error: `Rôle "${role}" requis` });
      return;
    }

    next();
  };
}
