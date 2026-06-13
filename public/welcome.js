// First-run "Welcome!" tour for the home page. A one-time wizard — the same
// style as the per-page Help screens (it reuses window.appWizard from help.js)
// — that gives a quick overview of the whole app, a short getting-started
// tutorial, and a pointer to the Help system.
//
// Shown only the first time someone lands on the home page on this device.
// "Seen" is tracked in localStorage (per-browser, survives offline, never
// synced) so a fresh device gets its own first-run. The App Info tab in
// Settings can re-arm it for one more viewing via window.replayWelcome().
//
// Include with <script src="/welcome.js"></script> after help.js on the home
// page only.
(function() {
  var SEEN_KEY = 'wm-welcome-seen';

  // The tour itself — mirrors the structure of the help topics in help.js: a
  // big icon, a headline, a sentence or two, optional bullet points, and chips
  // that echo the real buttons/labels so they're easy to spot.
  var TOUR = {
    title: 'Welcome!',
    slides: [
      { icon: '🌿', title: 'Welcome to your ranch tool',
        text: 'An unofficial, all-in-one companion for managing Texas land under the TPWD 1-d-1 wildlife valuation. Everything you need to prepare your plan and annual reports lives here.',
        points: ['All your data stays in this browser — nothing is uploaded unless you turn on Google Sync',
                 'Works offline once loaded; changes sync back up when you’re online again'] },
      { icon: '🧭', title: 'What’s inside',
        text: 'Seven tools, all reachable from the tiles on this home page. Log what you do, and the plan, reports, charts, and map build themselves.',
        chips: ['📓 Activity Log', '📋 Plan', '🗓️ Reports', '🦌 Buck Watch', '🔧 Assets', '🗺️ Map', '📈 Trends'] },
      { icon: '🎯', title: 'The goal: stay qualified',
        text: 'The 1-d-1 valuation needs at least 3 of 7 qualifying practices documented each year. The ring at the top of this page tracks your progress and nudges you as the year runs out.',
        chips: ['✓ Water · 2', '+ Census', '+ Shelter'] },
      { icon: '1️⃣', title: 'Getting started · set up the ranch',
        text: 'First, open Settings and tell the app about your place. It only takes a few minutes and makes everything afterward easier.',
        points: ['Upload an aerial photo or map under Property, and draw your census Routes',
                 'Import a TPWD season Calendar and your region’s Rainfall history',
                 'Back up regularly, or enable Google Sync to keep a copy in your own Drive'],
        chips: ['⚙️ Settings', 'Property', 'Routes'] },
      { icon: '2️⃣', title: 'Getting started · log your work',
        text: 'Then just keep a running journal. Each time you do something on the land, add an Activity Log entry — pick the type that fits, and add photos, a map pin, and a cost where it helps.',
        points: ['Harvest, Sighting, Practices, Census, Rainfall, Maintenance, Purchase',
                 'Every entry automatically flows into the right report, chart, and dashboard'],
        chips: ['📓 Activity Log', '+ New Entry', '📷 Add Photo', '📍 Set Location'] },
      { icon: '3️⃣', title: 'Getting started · file the paperwork',
        text: 'When it’s time, the app produces the official forms for you. Fill out the Management Plan once, then confirm each year’s Annual Report — mostly pre-filled from what you already logged.',
        chips: ['📋 PWD 885', '🗓️ PWD 888', '🖨️ Generate PDF'] },
      { icon: '❓', title: 'Help is always one tap away',
        text: 'See the green “?” button in the bottom-right corner? Every page has one. Tap it any time for a short, page-specific walkthrough just like this one.',
        points: ['No need to memorize anything — the help is right where you’re working',
                 'You can replay this welcome tour anytime from Settings → App Info'],
        chips: ['❓ Help'] }
    ]
  };

  function seen() {
    try { return localStorage.getItem(SEEN_KEY) === '1'; }
    catch (e) { return true; } // no storage (private mode): don't nag every load
  }

  function markSeen() {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* nothing we can do */ }
  }

  function show() {
    if (typeof window.appWizard !== 'function') return; // help.js not loaded yet
    // Mark seen as soon as it opens so a reload mid-tour doesn't show it twice.
    markSeen();
    window.appWizard(TOUR);
  }

  // Settings → App Info uses this to re-arm and immediately replay the tour.
  window.replayWelcome = function() {
    try { localStorage.removeItem(SEEN_KEY); } catch (e) { /* ignore */ }
    show();
  };

  function maybeShow() {
    if (seen()) return;
    show();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeShow);
  } else {
    maybeShow();
  }
})();
