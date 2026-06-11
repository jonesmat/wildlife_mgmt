// Floating "?" help button (bottom-right) with a per-page explanation pop-up.
// Include with <script src="/help.js"></script> before </body> on app pages.
// Print pages (plan-print, report-print) intentionally don't include it.
(function() {
  var HELP = {
    home: {
      title: 'Home Dashboard',
      html:
        '<p><strong>What this page is for:</strong> Your launch pad. The tiles open each tool — ' +
        'the Activity Log, the Management Plan (PWD 885), Annual Reports (PWD 888), Buck Watch, ' +
        'the Property Map, and Census Trends. The Season Calendar below shows upcoming hunting ' +
        'seasons and management dates so nothing sneaks up on you.</p>' +
        '<p><strong>How it affects other pages:</strong> Nothing here changes your plan or report ' +
        'data — only your calendar choices (snoozed or dismissed events) are remembered.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>Snooze a calendar event to hide it until closer to the date, or dismiss it for good — ' +
        'the "Show dismissed/snoozed" buttons bring them back.</li>' +
        '<li>Which events appear is configurable in <strong>Settings &rarr; Calendar</strong>.</li>' +
        '<li>The printer icon prints just the calendar — handy for the fridge or the camp house.</li></ul>'
    },
    activity: {
      title: 'Activity Log',
      html:
        '<p><strong>What this page is for:</strong> Your day-to-day journal of management work — ' +
        'feeder refills, predator control, census counts, habitat work, and so on. Each entry can ' +
        'carry a date, notes, photos, and a pinned location on your property map.</p>' +
        '<p><strong>How it affects other pages:</strong> This log is the heart of the app. Entries ' +
        'from a given year are embedded (photos and all) in that year’s printed Annual Report ' +
        '(PWD 888). Census-type entries feed the <strong>Census Trends</strong> charts, and entries ' +
        'with a pinned location show up on the <strong>Property Map</strong>.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>Log activities as you do them — at report time the annual report practically writes itself.</li>' +
        '<li>Use <strong>Set Location</strong> to pin where the work happened; pins make the map view useful.</li>' +
        '<li>Photos attached here appear in the printed report, so a quick phone snap is great documentation.</li>' +
        '<li>Use the filters and sort controls to review a single activity type or season at a glance.</li></ul>'
    },
    plan: {
      title: 'Wildlife Management Plan (PWD 885)',
      html:
        '<p><strong>What this page is for:</strong> The full TPWD Wildlife Management Plan form — ' +
        'owner and property information, target species, goals, qualifying activities, deer ' +
        'management, and the Part VIII activity details. This is the plan you file when qualifying ' +
        'land for 1-d-1 wildlife management use.</p>' +
        '<p><strong>How it affects other pages:</strong> It’s the source for the printable ' +
        'PWD 885 PDF, and your owner/property details carry over to the Annual Reports so you ' +
        'don’t retype them each year.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>Everything autosaves as you type — watch for the "Saved" note in the header.</li>' +
        '<li>Use the sidebar to jump between parts; you don’t have to work top-to-bottom.</li>' +
        '<li>Only complete the sections that apply to your property — the printed form simply ' +
        'leaves the rest blank, just like filling it out by hand.</li>' +
        '<li>You must perform at least 3 of the 7 qualifying activity categories — pick ones you’ll ' +
        'realistically keep up every year.</li></ul>'
    },
    report: {
      title: 'Annual Report (PWD 888)',
      html:
        '<p><strong>What this page is for:</strong> One year’s Annual Report — recording which ' +
        'qualifying activities you actually performed that year, plus association membership and ' +
        'supporting documentation.</p>' +
        '<p><strong>How it affects other pages:</strong> It produces the year’s printable ' +
        'PWD 888 PDF. Activity Log entries from this year are listed at the bottom and embedded in ' +
        'the printout as supporting evidence — you can exclude any entry you don’t want included.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>Everything autosaves as you type.</li>' +
        '<li>Fill out the Management Plan first — owner info flows in from there.</li>' +
        '<li>If you’ve kept the Activity Log current, most of this page is just confirming what ' +
        'you already logged.</li>' +
        '<li>The parts mirror the official TPWD form, so the printed PDF matches what the appraisal ' +
        'district expects.</li></ul>'
    },
    reports: {
      title: 'Annual Reports',
      html:
        '<p><strong>What this page is for:</strong> The index of your Annual Reports (PWD 888), one ' +
        'per year. Create a new year’s report, open an existing one to edit, generate its PDF, ' +
        'or delete it.</p>' +
        '<p><strong>How it affects other pages:</strong> Deleting a report removes only that ' +
        'year’s report answers — your Activity Log entries for the year are untouched.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>Create the new year’s report early and update it as the year goes — it’s much ' +
        'easier than reconstructing everything at filing time.</li>' +
        '<li>Reports are typically due to your county appraisal district after the year ends; check ' +
        'your county’s deadline.</li></ul>'
    },
    bucks: {
      title: 'Buck Watch',
      html:
        '<p><strong>What this page is for:</strong> A catalog of individual bucks on your property — ' +
        'track each one across seasons with photos and notes (age, antler points, where he shows up).</p>' +
        '<p><strong>How it affects other pages:</strong> Reference only — Buck Watch doesn’t feed ' +
        'the plan or report forms. It’s your own record for making harvest decisions.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>Add camera-survey photos year over year; watching a buck age is the best guide to ' +
        'when he’s ready (or should be passed).</li>' +
        '<li>Give bucks memorable names — it makes camera review and hunting conversations much easier.</li></ul>'
    },
    map: {
      title: 'Property Map',
      html:
        '<p><strong>What this page is for:</strong> A bird’s-eye view of your management work — ' +
        'every Activity Log entry with a pinned location, shown on your property photo. Click a pin ' +
        'to see the entry and jump to it in the Activity Log.</p>' +
        '<p><strong>How it affects other pages:</strong> Read-only — it just visualizes the log, ' +
        'so nothing you do here changes your data.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>No map showing? Upload a property image in <strong>Settings &rarr; Property</strong> first.</li>' +
        '<li>Pins come from <strong>Set Location</strong> on Activity Log entries — the more you pin, ' +
        'the more useful this view becomes.</li>' +
        '<li>Clusters of pins are a quick way to spot which parts of the property get attention ' +
        'and which are being neglected.</li></ul>'
    },
    trends: {
      title: 'Census Trends',
      html:
        '<p><strong>What this page is for:</strong> Charts of your census counts over time, grouped ' +
        'by route, with moon phases for context. See whether the herd is growing, shrinking, or holding.</p>' +
        '<p><strong>How it affects other pages:</strong> Read-only — counts are read from census ' +
        'entries in the Activity Log.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>Run the same routes (set up in <strong>Settings &rarr; Routes</strong>) the same way each ' +
        'time — consistency is what makes year-to-year counts comparable.</li>' +
        '<li>Moon phase affects deer movement; it can explain an oddly low count night.</li>' +
        '<li>Multi-year trends are great backup for harvest recommendations and the census section ' +
        'of your annual report.</li></ul>'
    },
    settings: {
      title: 'Settings',
      html:
        '<p><strong>What this page is for:</strong> App-wide configuration — property details, census ' +
        'routes, property photos, the season calendar, data export &amp; restore, optional Google ' +
        'Drive sync, and app info.</p>' +
        '<p><strong>How it affects other pages:</strong> The property image powers the Property Map ' +
        'and location pins; routes power census logging and the Trends charts; calendar settings ' +
        'control the home page calendar.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li><strong>Most important thing in the app:</strong> all data lives in this browser — ' +
        'nothing is uploaded unless you turn on Google Sync. Use <strong>Data Export &amp; ' +
        'Restore</strong> to download a backup regularly, or enable <strong>Google Sync</strong> ' +
        'to keep a copy in your own Google Drive automatically.</li>' +
        '<li>Moving to a new computer? Export here and Restore on the new device — or connect ' +
        'both to Google Sync and they share the same data.</li>' +
        '<li>Set up your property image and census routes before logging census activities — entries ' +
        'can then be tied to a route and a spot on the map.</li></ul>'
    }
  };

  function pageKey() {
    var p = location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
    if (p === '/' || p === '/index') return 'home';
    if (p === '/log') return 'activity';
    if (p.indexOf('/report/') === 0) return 'report';
    var k = p.slice(1);
    return HELP.hasOwnProperty(k) ? k : null;
  }

  var key = pageKey();
  if (!key) return;
  var topic = HELP[key];

  var style = document.createElement('style');
  style.textContent =
    '.help-fab{position:fixed;right:18px;bottom:18px;z-index:90;width:44px;height:44px;' +
      'border-radius:50%;border:none;background:#1a4a1a;color:white;font-size:1.25rem;' +
      'font-weight:700;font-family:Arial,sans-serif;cursor:pointer;' +
      'box-shadow:0 3px 10px rgba(0,0,0,0.3);transition:background 0.15s}' +
    '.help-fab:hover{background:#256325}' +
    '.help-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:1000;' +
      'display:flex;align-items:center;justify-content:center}' +
    '.help-popup{background:white;border-radius:10px;padding:22px 26px;width:540px;' +
      'max-width:calc(100vw - 48px);max-height:82vh;overflow-y:auto;' +
      'box-shadow:0 8px 32px rgba(0,0,0,0.25);font-family:Arial,sans-serif;' +
      'animation:helpPopIn 0.18s ease}' +
    '@keyframes helpPopIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:none}}' +
    '.help-popup h3{color:#1a4a1a;font-size:1.05rem;margin:0 0 12px}' +
    '.help-popup-body{font-size:0.88rem;color:#444;line-height:1.55}' +
    '.help-popup-body p{margin:0 0 10px}' +
    '.help-popup-body ul{margin:0 0 10px;padding-left:20px}' +
    '.help-popup-body li{margin-bottom:6px}' +
    '.help-popup-body strong{color:#1a4a1a}' +
    '.help-popup-actions{display:flex;justify-content:flex-end;margin-top:14px}' +
    '.help-popup-close{background:#1a4a1a;color:white;border:none;border-radius:6px;' +
      'padding:9px 26px;font-size:0.9rem;font-weight:600;cursor:pointer}' +
    '.help-popup-close:hover{background:#256325}' +
    '@media print{.help-fab,.help-overlay{display:none !important}}' +
    '@media (max-width:720px){.help-fab{right:12px;bottom:12px;width:40px;height:40px;font-size:1.1rem}}';
  document.head.appendChild(style);

  function openPopup() {
    var overlay = document.createElement('div');
    overlay.className = 'help-overlay';
    overlay.innerHTML =
      '<div class="help-popup" role="dialog" aria-modal="true" aria-label="Page help">' +
        '<h3>❓ ' + topic.title + '</h3>' +
        '<div class="help-popup-body">' + topic.html + '</div>' +
        '<div class="help-popup-actions"><button class="help-popup-close">Got it</button></div>' +
      '</div>';
    function close() {
      document.removeEventListener('keydown', onKey);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    function onKey(ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); close(); }
    }
    overlay.addEventListener('click', function(ev) { if (ev.target === overlay) close(); });
    overlay.querySelector('.help-popup-close').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
    overlay.querySelector('.help-popup-close').focus();
  }

  function addButton() {
    var btn = document.createElement('button');
    btn.className = 'help-fab';
    btn.type = 'button';
    btn.textContent = '?';
    btn.title = 'Help: how this page is used';
    btn.setAttribute('aria-label', 'Help: how this page is used');
    btn.addEventListener('click', openPopup);
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButton);
  } else {
    addButton();
  }
})();
