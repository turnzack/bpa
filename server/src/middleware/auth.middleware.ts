// Middleware d'authentification Supabase pour Express.js

import { Request, Response, NextFunction } from 'express';
import { masterSupabase } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
  };
}

/**
 * Middleware pour protéger les routes avec authentification Supabase
 * Vérifie le token JWT dans le header Authorization: Bearer <token>
 */
export async function authenticateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Header d\'autorisation manquant. Format requis: Bearer <token>' });
      return;
    }

    const jwt = authHeader.replace('Bearer ', '').trim();
    
    const { data: { user }, error: authError } = await masterSupabase.auth.getUser(jwt);

    if (authError || !user) {
      console.error('[authenticateUser] Auth error:', authError);
      res.status(401).json({ error: 'Token invalide ou expiré' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      app_metadata: user.app_metadata,
      user_metadata: user.user_metadata
    };
    
    next();
  } catch (error: any) {
    console.error('[authenticateUser] Middleware error:', error);
    res.status(500).json({ error: 'Échec de l\'authentification' });
  }
}

/**
 * Middleware optionnel - ajoute l'utilisateur si présent mais ne bloque pas
 */
export async function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization || '';

    if (authHeader.startsWith('Bearer ')) {
      const jwt = authHeader.replace('Bearer ', '').trim();
      const { data: { user }, error } = await masterSupabase.auth.getUser(jwt);

      if (!error && user) {
        req.user = {
          id: user.id,
          email: user.email,
          app_metadata: user.app_metadata,
          user_metadata: user.user_metadata
        };
      }
    }
    
    next();
  } catch (error) {
    // Ignorer les erreurs et continuer sans utilisateur
    next();
  }
}

/**
 * Middleware pour vérifier un rôle spécifique dans les metadata
 */
export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentification requise' });
      return;
    }

    const userRole = req.user.app_metadata?.role;
    
    if (userRole !== role) {
      res.status(403).json({ error: `Rôle "${role}" requis` });
      return;
    }

    next();
  };
}
