import jwt from 'jsonwebtoken';

const SUPER_ADMIN_EMAILS = ['tce.reponse@gmail.com', 'patrice.adja@gmail.com'];

export async function onRequestGet(context: any) {
  const env = context.env;
  const request = context.request;

  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET || 'bpa_facture_scan_secret_key_2026') as any;
    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes((decoded.email || '').toLowerCase().trim());

    return new Response(JSON.stringify({
      authenticated: true,
      userId: decoded.userId,
      email: decoded.email,
      isSuperAdmin,
      role: isSuperAdmin ? 'superadmin' : 'user',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
