import jwt from 'jsonwebtoken';

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
    const decoded = jwt.verify(token, env.JWT_SECRET || 'kirov5_sovereign_forge_secret_key_2026') as any;
    
    return new Response(JSON.stringify({
      authenticated: true,
      userId: decoded.userId,
      email: decoded.email,
      isSuperAdmin: (decoded.email || '').toLowerCase().trim() === 'zacktunr@gmail.com',
      role: ((decoded.email || '').toLowerCase().trim() === 'zacktunr@gmail.com') ? 'superadmin' : 'user'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
