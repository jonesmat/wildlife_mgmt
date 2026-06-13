// Cloudflare Worker entry point. Static assets in public/ are served by the
// platform before this script runs; the Worker only receives non-asset
// requests. Its sole job is the OAuth token endpoints that need the Google
// client SECRET — which must never ship to the browser. It exchanges and
// refreshes tokens, and never sees or stores any app data.
//
// Refresh-token storage: when the optional TOKENS KV namespace is bound, the
// Worker keeps Google refresh tokens server-side (surviving deploys and
// restarts) and hands the browser only an opaque device id. Without the
// binding it falls back to the original stateless mode, returning the
// refresh token to the browser.
//
// Configuration:
//   - GOOGLE_CLIENT_ID     plain var (wrangler.jsonc "vars")
//   - GOOGLE_CLIENT_SECRET Worker secret:  npx wrangler secret put GOOGLE_CLIENT_SECRET
//     (or dashboard → the Worker → Settings → Variables and Secrets → Add → Secret)
//   - TOKENS               optional KV namespace binding (wrangler.jsonc
//     "kv_namespaces") for persistent server-side refresh-token storage

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

const RT_PREFIX = 'rt:';

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

  const kv = env.TOKENS || null;

  // Disconnect: kill the grant at Google and forget the stored token.
  if (op === 'revoke') {
    let rt = body.refresh_token || '';
    if (!rt && body.device_id && kv) {
      rt = (await kv.get(RT_PREFIX + body.device_id)) || '';
      await kv.delete(RT_PREFIX + body.device_id);
    }
    if (rt) {
      await fetch('https://oauth2.googleapis.com/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'token=' + encodeURIComponent(rt)
      }).catch(() => { /* best effort */ });
    }
    return json({ ok: true });
  }

  const params = new URLSearchParams();
  params.set('client_id', env.GOOGLE_CLIENT_ID || '');
  params.set('client_secret', env.GOOGLE_CLIENT_SECRET);
  let deviceId = '';
  if (op === 'exchange') {
    if (!body.code) return json({ error: 'code required' }, 400);
    params.set('grant_type', 'authorization_code');
    params.set('code', body.code);
    // GIS popup-mode code clients use the special 'postmessage' redirect.
    params.set('redirect_uri', 'postmessage');
  } else {
    if (body.device_id && kv) {
      deviceId = String(body.device_id);
      const rt = await kv.get(RT_PREFIX + deviceId);
      if (!rt) return json({ error: 'Unknown device — sign in again.' }, 401);
      params.set('grant_type', 'refresh_token');
      params.set('refresh_token', rt);
    } else if (body.refresh_token) {
      // Legacy mode: the browser still holds its own refresh token.
      params.set('grant_type', 'refresh_token');
      params.set('refresh_token', body.refresh_token);
    } else {
      return json({ error: 'refresh_token required' }, 400);
    }
  }

  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  const tok = await r.json().catch(() => ({}));
  if (!r.ok || !tok.access_token) {
    // 401 tells the client its grant is gone (revoked/expired) and it should
    // forget its credentials and fall back to an interactive sign-in.
    const status = r.status === 400 || r.status === 401 ? 401 : 502;
    if (status === 401 && deviceId && kv) await kv.delete(RT_PREFIX + deviceId);
    return json({ error: tok.error_description || tok.error || 'Google token request failed' }, status);
  }

  if (kv) {
    if (op === 'exchange' && tok.refresh_token) {
      // Keep the refresh token here; the browser gets an opaque device id.
      deviceId = crypto.randomUUID();
      await kv.put(RT_PREFIX + deviceId, tok.refresh_token);
      return json({ access_token: tok.access_token, expires_in: tok.expires_in, device_id: deviceId });
    }
    if (deviceId) {
      // Google occasionally rotates refresh tokens; keep the newest.
      if (tok.refresh_token) await kv.put(RT_PREFIX + deviceId, tok.refresh_token);
      return json({ access_token: tok.access_token, expires_in: tok.expires_in });
    }
  }
  // Stateless fallback: pass through only what the client needs.
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
    if (url.pathname === '/oauth/revoke') return handleOauth(request, env, 'revoke');
    // Anything else that didn't match a static asset: let the asset handler
    // produce its normal 404 behavior.
    return env.ASSETS.fetch(request);
  }
};
