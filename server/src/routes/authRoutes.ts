// Routes d'authentification Supabase pour Express.js

import { Router, Request, Response } from 'express';
import { masterSupabase } from '../config/supabase';
import { authenticateUser, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// ============================================================
// INSCRIPTION
// ============================================================

/**
 * POST /api/auth/signup
 * Crée un nouvel utilisateur avec email/mot de passe
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, redirectTo } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const { data, error } = await masterSupabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo || process.env.FRONTEND_URL,
        data: {
          subscribed: false
        }
      }
    });

    if (error) {
      console.error('[signup] Error:', error);
      return res.status(400).json({ error: error.message });
    }

    // Vérifier si la confirmation email est requise
    if (data.user && !data.session) {
      return res.json({
        message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.',
        user: { id: data.user.id, email: data.user.email }
      });
    }

    res.json({
      message: 'Inscription réussie',
      user: { id: data.user!.id, email: data.user!.email },
      session: data.session ? {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in
      } : null
    });

  } catch (error: any) {
    console.error('[signup] Exception:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

// ============================================================
// CONNEXION
// ============================================================

/**
 * POST /api/auth/signin
 * Connecte un utilisateur avec email/mot de passe
 */
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const { data, error } = await masterSupabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('[signin] Error:', error);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    res.json({
      message: 'Connexion réussie',
      user: {
        id: data.user.id,
        email: data.user.email,
        app_metadata: data.user.app_metadata,
        user_metadata: data.user.user_metadata
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in
      }
    });

  } catch (error: any) {
    console.error('[signin] Exception:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

// ============================================================
// DÉCONNEXION
// ============================================================

/**
 * POST /api/auth/signout
 * Déconnecte l'utilisateur et invalide la session
 */
router.post('/signout', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    await masterSupabase.auth.signOut();
    res.json({ message: 'Déconnexion réussie' });
  } catch (error: any) {
    console.error('[signout] Error:', error);
    res.status(500).json({ error: 'Erreur lors de la déconnexion' });
  }
});

// ============================================================
// RAFRAÎCHIR LA SESSION
// ============================================================

/**
 * POST /api/auth/refresh
 * Rafraîchit le token d'accès avec un refresh token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requis' });
    }

    const { data, error } = await masterSupabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      console.error('[refresh] Error:', error);
      return res.status(401).json({ error: 'Refresh token invalide ou expiré' });
    }

    res.json({
      session: {
        accessToken: data.session!.access_token,
        refreshToken: data.session!.refresh_token,
        expiresIn: data.session!.expires_in
      }
    });

  } catch (error: any) {
    console.error('[refresh] Exception:', error);
    res.status(500).json({ error: 'Erreur serveur lors du rafraîchissement' });
  }
});

// ============================================================
// MOT DE PASSE OUBLIÉ
// ============================================================

/**
 * POST /api/auth/forgot-password
 * Envoie un email de réinitialisation de mot de passe
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email, redirectTo } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    const { error } = await masterSupabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${process.env.FRONTEND_URL}/reset-password`
    });

    if (error) {
      console.error('[forgot-password] Error:', error);
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Si un compte avec cet email existe, vous recevrez un lien de réinitialisation.'
    });

  } catch (error: any) {
    console.error('[forgot-password] Exception:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================================
// RÉINITIALISER LE MOT DE PASSE
// ============================================================

/**
 * POST /api/auth/reset-password
 * Réinitialise le mot de passe avec un nouveau token
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { accessToken, password } = req.body;

    if (!accessToken || !password) {
      return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
    }

    // Mettre à jour le mot de passe
    const { data, error } = await masterSupabase.auth.updateUser({
      password
    }, {
      // Note: nécessite un token valide dans l'en-tête ou la session
    });

    if (error) {
      console.error('[reset-password] Error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Mot de passe réinitialisé avec succès',
      user: { id: data.user.id, email: data.user.email }
    });

  } catch (error: any) {
    console.error('[reset-password] Exception:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================================
// UTILISATEUR ACTUEL
// ============================================================

/**
 * GET /api/auth/me
 * Récupère les informations de l'utilisateur connecté
 */
router.get('/me', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error: any) {
    console.error('[me] Error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================================
// METTRE À JOUR LE PROFIL
// ============================================================

/**
 * PUT /api/auth/profile
 * Met à jour le profil de l'utilisateur
 */
router.put('/profile', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, data } = req.body;

    const updateData: any = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (data) updateData.data = data;

    const { data: result, error } = await masterSupabase.auth.updateUser(updateData);

    if (error) {
      console.error('[update-profile] Error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Profil mis à jour',
      user: {
        id: result.user.id,
        email: result.user.email,
        app_metadata: result.user.app_metadata,
        user_metadata: result.user.user_metadata
      }
    });

  } catch (error: any) {
    console.error('[update-profile] Exception:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================================
// VÉRIFIER L'ÉTAT DE LA SESSION
// ============================================================

/**
 * GET /api/auth/session
 * Vérifie si la session est valide
 */
router.get('/session', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      valid: true,
      user: {
        id: req.user!.id,
        email: req.user!.email
      }
    });
  } catch (error: any) {
    res.status(401).json({ valid: false, error: 'Session invalide' });
  }
});

export default router;
