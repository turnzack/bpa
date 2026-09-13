import { getNeonClient } from '../_lib/neonClient';
import jwt from 'jsonwebtoken';

const SUPER_ADMIN_EMAILS = ['zacktunr@gmail.com'];

function getAuthUser(request: Request, env: any): { userId: number; email: string; isSuperAdmin: boolean } | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET || 'kirov5_sovereign_forge_secret_key_2026'
    ) as any;
    
    const email = (decoded.email || '').toLowerCase().trim();
    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(email);

    return {
      userId: Number(decoded.userId),
      email,
      isSuperAdmin
    };
  } catch {
    return null;
  }
}

export async function onRequestGet(context: any) {
  const { request, env } = context;
  const user = getAuthUser(request, env);
  
  if (!user || !user.userId) {
    return new Response(JSON.stringify({ error: 'Accès non autorisé. Veuillez vous connecter.' }), { status: 401 });
  }

  try {
    const sql = getNeonClient(env);
    
    await sql`
      CREATE TABLE IF NOT EXISTS user_projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        project_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, project_id)
      )
    `;

    const url = new URL(request.url);
    const viewAll = user.isSuperAdmin && url.searchParams.get('view') !== 'mine';

    let projects;
    if (viewAll) {
      // 👑 Mode Super-Admin : Visibilité complète sur tous les projets de tous les utilisateurs
      projects = await sql`
        SELECT p.project_id, p.title, p.content, p.updated_at, p.user_id, u.email as owner_email 
        FROM user_projects p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.updated_at DESC
      `;
    } else {
      // 🔒 Cloisonnement strict standard : UNIQUEMENT les projets du compte connecté
      projects = await sql`
        SELECT project_id, title, content, updated_at, user_id
        FROM user_projects 
        WHERE user_id = ${user.userId}
        ORDER BY updated_at DESC
      `;
    }

    return new Response(JSON.stringify({
      success: true,
      userId: user.userId,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      viewMode: viewAll ? 'global_super_admin' : 'personal_isolated',
      count: projects.length,
      projects
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('Erreur API User Projects GET:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne: ' + (error?.message || error) }), { status: 500 });
  }
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  const user = getAuthUser(request, env);
  
  if (!user || !user.userId) {
    return new Response(JSON.stringify({ error: 'Accès non autorisé. Veuillez vous connecter.' }), { status: 401 });
  }

  try {
    const sql = getNeonClient(env);
    const body = await request.json() as any;
    const rawTitle = (body.title || body.name || body.projectId || '').trim();
    if (!rawTitle) {
      return new Response(JSON.stringify({ error: 'Nom ou titre de projet requis' }), { status: 400 });
    }
    const cleanId = (body.projectId || body.name || rawTitle).trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const content = body.content || { description: body.description || 'Projet Cloud' };

    await sql`
      INSERT INTO user_projects (user_id, project_id, title, content, updated_at)
      VALUES (${user.userId}, ${cleanId}, ${rawTitle}, ${JSON.stringify(content)}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, project_id) 
      DO UPDATE SET 
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        updated_at = CURRENT_TIMESTAMP
    `;

    return new Response(JSON.stringify({
      success: true,
      message: 'Projet sauvegardé en toute sécurité dans votre espace Neon'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('Erreur API User Projects POST:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne: ' + (error?.message || error) }), { status: 500 });
  }
}

export async function onRequestDelete(context: any) {
  const { request, env } = context;
  const user = getAuthUser(request, env);
  
  if (!user || !user.userId) {
    return new Response(JSON.stringify({ error: 'Accès non autorisé. Veuillez vous connecter.' }), { status: 401 });
  }

  try {
    const sql = getNeonClient(env);
    const { projectId, targetUserId } = await request.json() as any;
    
    if (!projectId) {
      return new Response(JSON.stringify({ error: 'projectId requis' }), { status: 400 });
    }

    if (user.isSuperAdmin && targetUserId) {
      await sql`
        DELETE FROM user_projects 
        WHERE user_id = ${Number(targetUserId)} AND project_id = ${projectId}
      `;
    } else {
      await sql`
        DELETE FROM user_projects 
        WHERE user_id = ${user.userId} AND project_id = ${projectId}
      `;
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Projet supprimé avec succès'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('Erreur API User Projects DELETE:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne: ' + (error?.message || error) }), { status: 500 });
  }
}
