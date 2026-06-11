const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// All app data lives in the browser (IndexedDB via public/store.js and
// public/sw.js). This server only hosts static files and page routes —
// it reads and writes nothing on disk.

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

const server = app.listen(PORT, () => {
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
