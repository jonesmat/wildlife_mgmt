// Cloudflare Worker entry point. Static assets in public/ are served by the
// platform before this script runs; the Worker only receives non-asset
// requests. Its sole job is the two OAuth token endpoints that need the
// Google client SECRET — which must never ship to the browser. It exchanges
// and refreshes tokens, and never sees or stores any app data.
//
// Configuration:
//   - GOOGLE_CLIENT_ID    plain var (wrangler.jsonc "vars")
//   - GOOGLE_CLIENT_SECRET  Worker secret:  npx wrangler secret put GOOGLE_CLIENT_SECRET
//     (or dashboard → the Worker → Settings → Variables and Secrets → Add → Secret)

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

async function handleOauth(request, env, op) {
  if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
  if (!env.GOOGLE_CLIENT_SECRET) {
    return json({ error: 'Sync backend not configured: the GOOGLE_CLIENT_SECRET Worker secret is missing.' }, 501);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const params = new URLSearchParams();
  params.set('client_id', env.GOOGLE_CLIENT_ID || '');
  params.set('client_secret', env.GOOGLE_CLIENT_SECRET);
  if (op === 'exchange') {
    if (!body.code) return json({ error: 'code required' }, 400);
    params.set('grant_type', 'authorization_code');
    params.set('code', body.code);
    // GIS popup-mode code clients use the special 'postmessage' redirect.
    params.set('redirect_uri', 'postmessage');
  } else {
    if (!body.refresh_token) return json({ error: 'refresh_token required' }, 400);
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', body.refresh_token);
  }

  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  const tok = await r.json().catch(() => ({}));
  if (!r.ok || !tok.access_token) {
    // 401 tells the client its grant is gone (revoked/expired) and it should
    // forget the refresh token and fall back to an interactive sign-in.
    const status = r.status === 400 || r.status === 401 ? 401 : 502;
    return json({ error: tok.error_description || tok.error || 'Google token request failed' }, status);
  }
  // Pass through only what the client needs.
  return json({
    access_token: tok.access_token,
    expires_in: tok.expires_in,
    refresh_token: tok.refresh_token
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/oauth/exchange') return handleOauth(request, env, 'exchange');
    if (url.pathname === '/oauth/refresh') return handleOauth(request, env, 'refresh');
    // Anything else that didn't match a static asset: let the asset handler
    // produce its normal 404 behavior.
    return env.ASSETS.fetch(request);
  }
};
