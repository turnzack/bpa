import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sql } from '../config/db';
import { authenticateUser, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kirov5-fallback-secret-key-32chars!';

// ============================================================
// INSCRIPTION (Neon Native)
// ============================================================
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Check if user exists
    const existingUsers = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}`;
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Cet agent existe déjà dans le Nexus.' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email.toLowerCase().trim()}, ${passwordHash})
      RETURNING id, email, role
    `;

    const user = result[0];

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      message: 'Habilitation créée avec succès',
      token,
      userId: user.id,
      email: user.email
    });

  } catch (error: any) {
    console.error('[register] Exception:', error);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
  }
});

// ============================================================
// CONNEXION (Neon Native)
// ============================================================
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Find user
    const userResult = await sql`SELECT id, email, password_hash, role FROM users WHERE email = ${email.toLowerCase().trim()}`;
    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const user = userResult[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      userId: user.id,
      email: user.email
    });

  } catch (error: any) {
    console.error('[login] Exception:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

// ============================================================
// DÉCONNEXION
// ============================================================
router.post('/logout', authenticateUser, async (req: AuthRequest, res: Response) => {
  // With stateless JWT, logout is handled on the client by destroying the token
  res.json({ message: 'Déconnexion réussie' });
});

// ============================================================
// UTILISATEUR ACTUEL
// ============================================================
router.get('/me', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================================================
// VÉRIFIER L'ÉTAT DE LA SESSION
// ============================================================
router.get('/session', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      authenticated: true,
      userId: req.user!.id,
      email: req.user!.email,
      role: req.user!.role
    });
  } catch (error: any) {
    res.status(401).json({ authenticated: false, error: 'Session invalide' });
  }
});

export default router;
