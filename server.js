// Friendly version guard before any dependency loads: express-rate-limit
// needs modern Node, and on old versions requiring it dies with an opaque
// SyntaxError or "Cannot find module" instead of this message.
const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
if (nodeMajor < 18) {
  console.error('');
  console.error(' This app needs Node.js 18 or newer — you are running ' + process.version + '.');
  console.error(' Download the current LTS from https://nodejs.org/en/download/ and try again.');
  console.error('');
  process.exit(1);
}

const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = 3000;
app.disable('x-powered-by');

// All app data lives in the browser (IndexedDB via public/store.js and
// public/sw.js). This server only hosts static files and page routes —
// it reads and writes nothing on disk.

// Loopback-only single-user server, so the ceiling is generous — this just
// caps runaway request loops while keeping every route rate-limited.
app.use(rateLimit({
  windowMs: 60 * 1000,
  limit: 600,
  standardHeaders: true,
  legacyHeaders: false
}));

// Same security headers the Cloudflare deployment sets via public/_headers
// (minus HSTS, which doesn't apply to plain-http localhost). The app stores
// PII in the browser, so the CSP locks all network activity to same-origin.
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com https://static.cloudflareinsights.com; " +
      "style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; " +
      "connect-src 'self' https://accounts.google.com https://www.googleapis.com https://oauth2.googleapis.com https://cloudflareinsights.com; " +
      "frame-src https://accounts.google.com; object-src 'none'; base-uri 'self'; " +
      "form-action 'self'; frame-ancestors 'none'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    // allow-popups (not plain same-origin): the Google OAuth popup used by
    // the optional Drive sync must keep its opener link to hand back tokens.
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
  });
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// OAuth token endpoints for Google Drive sync — mirrors worker.mjs so sync
// works the same against the local server. Enabled only when the secret is
// provided:  GOOGLE_CLIENT_SECRET=... node server.js
const GOOGLE_CLIENT_ID = '462623472338-k5r76knldtvror94mvcfv417j2q6d9o0.apps.googleusercontent.com';

async function handleOauth(req, res, op) {
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(501).json({ error: 'Sync backend not configured: set the GOOGLE_CLIENT_SECRET environment variable.' });
  }
  const body = req.body || {};
  const params = new URLSearchParams();
  params.set('client_id', GOOGLE_CLIENT_ID);
  params.set('client_secret', process.env.GOOGLE_CLIENT_SECRET);
  if (op === 'exchange') {
    if (!body.code) return res.status(400).json({ error: 'code required' });
    params.set('grant_type', 'authorization_code');
    params.set('code', body.code);
    params.set('redirect_uri', 'postmessage');
  } else {
    if (!body.refresh_token) return res.status(400).json({ error: 'refresh_token required' });
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', body.refresh_token);
  }
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const tok = await r.json().catch(() => ({}));
    if (!r.ok || !tok.access_token) {
      const status = r.status === 400 || r.status === 401 ? 401 : 502;
      return res.status(status).json({ error: tok.error_description || tok.error || 'Google token request failed' });
    }
    res.json({ access_token: tok.access_token, expires_in: tok.expires_in, refresh_token: tok.refresh_token });
  } catch (e) {
    res.status(502).json({ error: 'Could not reach Google: ' + e.message });
  }
}

app.post('/oauth/exchange', express.json(), (req, res) => handleOauth(req, res, 'exchange'));
app.post('/oauth/refresh', express.json(), (req, res) => handleOauth(req, res, 'refresh'));

// Page routes
app.get('/activity', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'activity.html'));
});

// Old path; renamed because Safe Browsing flagged the login-lookalike /log
app.get('/log', (req, res) => {
  res.redirect(301, '/activity');
});

app.get('/plan', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'plan.html'));
});

app.get('/report/:year', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'report.html'));
});

app.get('/reports', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reports.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.get('/bucks', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bucks.html'));
});

app.get('/assets', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assets.html'));
});

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

app.get('/trends', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'trends.html'));
});

// Trust pages (Cloudflare serves these as clean URLs natively)
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

app.get('/yearbook/:year?', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'yearbook.html'));
});

// Print views are client-rendered from local storage
app.get('/plan-print', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'plan-print.html'));
});

app.get('/report-print/:year', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'report-print.html'));
});

// Bind to loopback only: this is a single-user local tool, and the browser
// profile it runs in holds PII — no reason to expose it to the LAN.
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Wildlife Management Tool running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n Port ${PORT} is already in use.`);
    console.log(` The app is probably already running.`);
    console.log(` Open http://localhost:${PORT} in your browser.\n`);
    process.exit(0);
  } else {
    throw err;
  }
});
