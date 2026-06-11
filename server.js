const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
app.disable('x-powered-by');

// All app data lives in the browser (IndexedDB via public/store.js and
// public/sw.js). This server only hosts static files and page routes —
// it reads and writes nothing on disk.

// Same security headers the Cloudflare deployment sets via public/_headers
// (minus HSTS, which doesn't apply to plain-http localhost). The app stores
// PII in the browser, so the CSP locks all network activity to same-origin.
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; " +
      "connect-src 'self'; object-src 'none'; base-uri 'self'; " +
      "form-action 'self'; frame-ancestors 'none'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Opener-Policy': 'same-origin'
  });
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

app.get('/trends', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'trends.html'));
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
