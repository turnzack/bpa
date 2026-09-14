import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
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
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const insertResult = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role',
      [email, passwordHash]
    );

    const user = insertResult.rows[0];

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      message: 'Inscription réussie',
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
    const userResult = await pool.query('SELECT id, email, password_hash, role FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const user = userResult.rows[0];

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
