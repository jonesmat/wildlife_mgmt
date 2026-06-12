// Floating "?" help button (bottom-right) with a per-page explanation pop-up.
// Include with <script src="/help.js"></script> before </body> on app pages.
// Print pages (plan-print, report-print) intentionally don't include it.
(function() {
  var HELP = {
    home: {
      title: 'Home Dashboard',
      html:
        '<p><strong>What this page is for:</strong> Your launch pad and year-at-a-glance status. ' +
        'The ring at the top tracks the <strong>qualifying practices</strong> documented this year ' +
        '(the annual report needs 3 of 7) — click a "+" practice chip to start logging it. The tiles ' +
        'open each tool, <strong>Ranch Highlights</strong> celebrates the year (and prints the ' +
        '📖 Yearbook), and the <strong>Season Calendar</strong> shows hunting seasons, deadlines, ' +
        'your service reminders, and your own custom events.</p>' +
        '<p><strong>How it affects other pages:</strong> Nothing here changes your plan or report ' +
        'data — only calendar choices (snoozes, dismissals, custom events) and reminder completions ' +
        'are saved.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li><strong>+ Add Event</strong> in the calendar creates your own dates (e.g. "fill feeders ' +
        'before the rut"); the ✏️ on a custom event edits or deletes it.</li>' +
        '<li>Reminders set on the Ranch Assets page appear here when due — <strong>✓ Complete</strong> ' +
        'lets you schedule the next one (7 days / 1 month / 6 months / 1 year).</li>' +
        '<li>Snooze or dismiss built-in events you don’t need; "Show dismissed/snoozed" brings them back. ' +
        'Filter whole species or regions in <strong>Settings &rarr; Calendar</strong>.</li>' +
        '<li>Import an AI-generated TPWD calendar in Settings for exact season dates.</li></ul>'
    },
    activity: {
      title: 'Activity Log',
      html:
        '<p><strong>What this page is for:</strong> Your day-to-day journal of management work — ' +
        'harvests, sightings, the seven qualifying practices, censuses, rain-gauge readings, ' +
        'maintenance, and purchases. Each entry can carry a date, notes, photos, an optional ' +
        'cost, and a pinned location on your property map.</p>' +
        '<p><strong>How it affects other pages:</strong> This log is the heart of the app. Entries ' +
        'from a given year are embedded (photos and all) in that year’s printed Annual Report ' +
        '(PWD 888) and the 📖 Yearbook, and they drive the home-page practices ring. Census and ' +
        'Rainfall entries feed the <strong>Census Trends</strong> charts, costs roll up there too, ' +
        'Maintenance entries linked to an asset build its service history, and pinned entries show ' +
        'on the <strong>Property Map</strong>.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>Log activities as you do them — at report time the annual report practically writes itself.</li>' +
        '<li>On a Maintenance entry, pick the <strong>Asset</strong> instead of typing the item — the ' +
        'service shows up on that asset’s card with a freshness chip.</li>' +
        '<li>Add the <strong>Cost</strong> when money changed hands; it counts toward your ' +
        'investment-in-the-land totals.</li>' +
        '<li>Read the rain gauge after every rain and log it — rainfall explains census swings.</li>' +
        '<li>Photos attached here appear in the printed report, so a quick phone snap is great documentation.</li></ul>'
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
        '<p><strong>What this page is for:</strong> A catalog of individual bucks on your property. ' +
        'Link Harvest and Sighting entries to a buck in the Activity Log and his story collects ' +
        'here — a <strong>season-by-season photo strip</strong>, an encounter timeline, and (with an ' +
        'estimated birth year) his age each fall, right up to "5½ at harvest".</p>' +
        '<p><strong>How it affects other pages:</strong> Reference only — Buck Watch doesn’t feed ' +
        'the plan or report forms. It’s your own record for making harvest decisions.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>Set an <strong>estimated birth year</strong> (Edit on the card) and every season photo ' +
        'gets an age label — watching him grow is the best guide to when he’s ready or should be passed.</li>' +
        '<li>Link camera-survey Sightings each year so the comparison strip fills in; the harvest ' +
        'photo caps off his story.</li>' +
        '<li>Give bucks memorable names — it makes camera review and hunting conversations much easier.</li></ul>'
    },
    map: {
      title: 'Property Map',
      html:
        '<p><strong>What this page is for:</strong> A bird’s-eye view of the place — every Activity ' +
        'Log entry with a pinned location, your census routes, and (dashed gold pins) your ' +
        'registered <strong>assets</strong>: feeders, troughs, blinds, and cameras. Click any pin ' +
        'for details and a jump-through to the log or the Asset Registry.</p>' +
        '<p><strong>How it affects other pages:</strong> Read-only — it just visualizes your data, ' +
        'so nothing you do here changes anything.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>No map showing? Upload a property image in <strong>Settings &rarr; Property</strong> first.</li>' +
        '<li>Entry pins follow the year/month filters; asset pins always show (toggle them with ' +
        '"Show assets"). Pin an asset from its Edit row on the Ranch Assets page.</li>' +
        '<li>Use the month slider to replay the year — it’s a quick way to see where work ' +
        'concentrates and what gets neglected.</li></ul>'
    },
    trends: {
      title: 'Census Trends & Analytics',
      html:
        '<p><strong>What this page is for:</strong> The numbers behind the ranch, all read from your ' +
        'Activity Log: census trend charts per route (with annual rainfall drawn behind the counts), ' +
        'the <strong>Rainfall</strong> card, your <strong>Investment in the Land</strong> spending ' +
        'roll-up, the <strong>Species Life List</strong>, and the best-hunting-time moon chart.</p>' +
        '<p><strong>How it affects other pages:</strong> Read-only — everything here is computed ' +
        'from entries you’ve already logged.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li>Run the same routes (set up in <strong>Settings &rarr; Routes</strong>) the same way each ' +
        'time — consistency is what makes year-to-year counts comparable.</li>' +
        '<li>Import regional rainfall history in <strong>Settings &rarr; Rainfall</strong> to see how ' +
        'this year stacks up against the long-term record; your own gauge readings always win.</li>' +
        '<li>Wet and dry years explain a lot of census swings — that’s why the blue rainfall bars ' +
        'sit behind the count lines.</li>' +
        '<li>The species list grows from sightings, harvests, and census target species — log the ' +
        'odd painted bunting or fox and watch the count climb.</li></ul>'
    },
    settings: {
      title: 'Settings',
      html:
        '<p><strong>What this page is for:</strong> App-wide configuration — property details and ' +
        'photos, census routes, the season calendar, regional rainfall history, photo quality, ' +
        'data management (export, restore, and optional Google Drive sync), and app info.</p>' +
        '<p><strong>How it affects other pages:</strong> The property image powers the Property Map ' +
        'and location pins; routes power census logging and the Trends charts; calendar settings ' +
        'control the home page calendar; imported rainfall backfills the Trends rainfall card.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li><strong>Most important thing in the app:</strong> all data lives in this browser — ' +
        'nothing is uploaded unless you turn on Google Sync. Use <strong>Data Management</strong> ' +
        'to download a backup regularly, or enable <strong>Google Sync</strong> there to keep a ' +
        'copy in your own Google Drive automatically.</li>' +
        '<li>The <strong>Calendar</strong> and <strong>Rainfall</strong> panes each include copyable ' +
        'AI instructions — paste them into a web-connected assistant and import the JSON it returns ' +
        'for exact season dates and your area’s rainfall record.</li>' +
        '<li>Moving to a new computer? Export here and Restore on the new device — or connect ' +
        'both to Google Sync and they share the same data.</li>' +
        '<li>Set up your property image and census routes before logging census activities — entries ' +
        'can then be tied to a route and a spot on the map.</li></ul>'
    },
    assets: {
      title: 'Ranch Assets',
      html:
        '<p><strong>What this page is for:</strong> The registry of everything you maintain — ' +
        'feeders, troughs, blinds, cameras, nest boxes, wells, and equipment like the UTV, tractor, ' +
        'and shredder. Each card shows how long since its last service and the recent history, with ' +
        'the longest-neglected assets sorted to the top. The <strong>Reminders</strong> box at the ' +
        'top holds dated to-dos ("grease the feeder motor on Sep 1"), optionally tied to an asset.</p>' +
        '<p><strong>How it affects other pages:</strong> Maintenance entries in the Activity Log ' +
        'linked to an asset build its service history. Reminders surface on the home-page Season ' +
        'Calendar when due, where <strong>✓ Complete</strong> reschedules them. Pinned assets appear ' +
        'as dashed gold pins on the Property Map.</p>' +
        '<p><strong>Tips:</strong></p><ul>' +
        '<li><strong>Log service</strong> on a card opens a Maintenance entry already linked to that ' +
        'asset — the fastest way to keep histories accurate.</li>' +
        '<li>Watch the freshness chips: amber past 90 days, red past a year.</li>' +
        '<li>Pin fixed infrastructure on the map (Edit &rarr; 📍 Pin on map) so anyone can find it.</li>' +
        '<li>Retire an asset you’ve sold or scrapped instead of deleting it — the history stays.</li></ul>'
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
