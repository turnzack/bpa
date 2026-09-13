import { getNeonClient } from '../_lib/neonClient';
import jwt from 'jsonwebtoken';

const SUPER_ADMIN_EMAILS = ['zacktunr@gmail.com'];

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET || 'kirov5_sovereign_forge_secret_key_2026') as any;
    const email = (decoded.email || '').toLowerCase().trim();
    
    if (!SUPER_ADMIN_EMAILS.includes(email)) {
      return new Response(JSON.stringify({ error: 'Accès réservé au Super-Administrateur.' }), { status: 403 });
    }

    const sql = getNeonClient(env);
    
    const users = await sql`
      SELECT u.id, u.email, u.created_at, COUNT(p.id) as project_count
      FROM users u
      LEFT JOIN user_projects p ON u.id = p.user_id
      GROUP BY u.id, u.email, u.created_at
      ORDER BY u.created_at DESC
    `;

    const totalProjects = await sql`SELECT COUNT(*) as count FROM user_projects`;

    return new Response(JSON.stringify({
      success: true,
      isSuperAdmin: true,
      stats: {
        totalUsers: users.length,
        totalProjects: Number(totalProjects[0]?.count || 0),
        users
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Erreur: ' + err.message }), { status: 500 });
  }
}
