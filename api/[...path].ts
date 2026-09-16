export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const targetUrl = `https://109-205-182-17.nip.io${url.pathname}${url.search}`;

  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set('host', '109-205-182-17.nip.io');

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? (request.body as any) : undefined,
      redirect: 'follow',
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    return new Response(response.body as any, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Proxy error: ' + (error?.message || error) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
