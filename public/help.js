// Floating "?" help button (bottom-right) that opens a short per-page wizard —
// a few slides with visuals instead of a wall of text.
// Include with <script src="/help.js"></script> before </body> on app pages.
// Print pages (plan-print, report-print, yearbook) intentionally don't include it.
(function() {
  // Each topic is a handful of slides: a big icon, a one-line headline, a
  // sentence or two, optional short bullet points, and optional "chips" that
  // mimic the actual buttons/labels on the page so they're easy to spot.
  var HELP = {
    home: {
      title: 'Home Dashboard',
      slides: [
        { icon: '🌿', title: 'Your launch pad',
          text: 'The tiles open each tool, and the cards below give you the state of the ranch at a glance. Most days, everything starts here.',
          chips: ['📓 Activity Log', '📋 Plan', '🗓️ Reports', '🦌 Buck Watch', '🔧 Assets', '🗺️ Map', '📈 Trends'] },
        { icon: '🎯', title: 'Stay qualified',
          text: 'The ring tracks the qualifying practices documented this year — the annual report needs at least 3 of 7.',
          points: ['Green chips show what you’ve logged, with counts',
                   'Click a "+" chip to start an entry for that practice',
                   'A warning appears if you’re short late in the year'],
          chips: ['✓ Water · 2', '+ Census', '+ Shelter'] },
        { icon: '🏆', title: 'Ranch Highlights',
          text: 'A celebration of the year — acres treated, rain in the gauge, dollars invested, and the remarkable bucks this land has raised.',
          points: ['Expand it for the full gallery', 'Print the year as a keepsake'],
          chips: ['📖 Yearbook'] },
        { icon: '📅', title: 'The Season Calendar',
          text: 'Hunting seasons, TPWD deadlines, and habitat windows, sorted by what’s next. Import an exact calendar in Settings → Calendar.',
          points: ['Snooze events until closer to the date', 'Dismiss what doesn’t apply to your place'],
          chips: ['💤 Snooze', '✕ Dismiss', 'in 12 days'] },
        { icon: '📌', title: 'Make it yours',
          text: 'Add your own dates to the calendar, and your service reminders from the Assets page show up here when due.',
          points: ['Custom events can repeat every year', '✏️ edits an event — delete lives in that dialog', 'Completing a reminder schedules the next one'],
          chips: ['+ Add Event', '✓ Complete', '✏️'] }
      ]
    },
    activity: {
      title: 'Activity Log',
      slides: [
        { icon: '📓', title: 'The heart of the app',
          text: 'A dated journal of everything you do on the place. Log it when it happens, and every report, chart, and dashboard builds itself.',
          chips: ['+ New Entry'] },
        { icon: '🗂️', title: 'One type per job',
          text: 'Pick the entry type that matches the work — each has its own fields, and each feeds the right place downstream.',
          chips: ['🎯 Harvest', '👀 Sighting', '🌳 Practices', '📊 Census', '🌧️ Rainfall', '🔧 Maintenance', '🛒 Purchase'] },
        { icon: '📷', title: 'Capture the proof',
          text: 'Photos, a pinned spot on the map, and an optional dollar cost turn a note into documentation an appraiser respects.',
          points: ['Photos print inside the annual report', 'Pins power the Property Map', 'Costs roll up into your investment totals'],
          chips: ['📍 Set Location', '📷 Add Photo', 'Cost ($)'] },
        { icon: '🔗', title: 'Where entries flow',
          text: 'Nothing is logged twice. Each entry automatically reaches everywhere it matters.',
          points: ['Annual Report & Yearbook — the year’s evidence, photos and all',
                   'Census & Rainfall → the Trends charts',
                   'Maintenance linked to an asset → its service history',
                   'Harvests & sightings → Buck Watch and the species list'] },
        { icon: '💡', title: 'Work the log',
          text: 'Use the filters to review one type or one season at a time, and edit any entry in place from its card.',
          chips: ['Year ▾', 'Type ▾', 'Edit'] }
      ]
    },
    plan: {
      title: 'Wildlife Management Plan (PWD 885)',
      slides: [
        { icon: '📋', title: 'The plan you file',
          text: 'The full TPWD Wildlife Management Plan — owner and property info, target species, goals, and the qualifying activities that earn the 1-d-1 valuation.' },
        { icon: '💾', title: 'It saves itself',
          text: 'Everything autosaves as you type — watch for the "Saved" note in the header. Use the sidebar to jump between parts in any order.',
          chips: ['Saved ✓'] },
        { icon: '✅', title: 'Only what applies',
          text: 'Fill out just the sections that fit your property; the printed form leaves the rest blank, exactly like filling it in by hand.',
          points: ['Commit to at least 3 of the 7 qualifying activities', 'Pick ones you’ll realistically keep up every year'] },
        { icon: '🖨️', title: 'Print and reuse',
          text: 'The plan produces the printable PWD 885 PDF, and your owner details flow into every Annual Report so you never retype them.',
          chips: ['🖨️ Generate PDF'] }
      ]
    },
    report: {
      title: 'Annual Report (PWD 888)',
      slides: [
        { icon: '🗓️', title: 'One year’s story',
          text: 'This is the annual report for a single year — which qualifying activities you actually performed, with your log as the supporting evidence.' },
        { icon: '🪄', title: 'Mostly pre-written',
          text: 'Owner info flows in from the Management Plan, and if you kept the Activity Log current, this page is largely confirming what you already logged.',
          points: ['Everything autosaves as you type'] },
        { icon: '📎', title: 'Evidence attached',
          text: 'The year’s log entries are listed at the bottom and embedded in the printed PDF, photos included. Untick any entry you’d rather leave out.',
          chips: ['Include in report ☑'] },
        { icon: '🖨️', title: 'Matches the official form',
          text: 'The parts mirror TPWD’s PWD 888, so the printed PDF is exactly what your county appraisal district expects.' }
      ]
    },
    reports: {
      title: 'Annual Reports',
      slides: [
        { icon: '🗂️', title: 'One report per year',
          text: 'The index of your PWD 888 reports. Create a new year, open one to edit, print its PDF, or delete it.',
          chips: ['+ Create', 'Open', '🖨️ PDF'] },
        { icon: '⏳', title: 'Start early, finish easy',
          text: 'Create the new year’s report in January and nudge it along as the year goes — far easier than reconstructing everything at filing time.',
          points: ['Reports are typically due to your county appraisal district early in the new year — confirm your county’s deadline'] },
        { icon: '🛡️', title: 'Deleting is safe-ish',
          text: 'Deleting a report removes only that year’s report answers — your Activity Log entries are untouched. You’ll be asked to type "delete" to confirm.' }
      ]
    },
    bucks: {
      title: 'Buck Watch',
      slides: [
        { icon: '🦌', title: 'Know every buck',
          text: 'A card for each buck worth watching. Link Harvest and Sighting entries to him in the Activity Log and his whole story collects here.',
          chips: ['+ New Buck', 'WATCHING', 'HARVESTED'] },
        { icon: '🎞️', title: 'Watch him grow',
          text: 'The season-by-season strip shows his best photo from every year he appears — camera reviews and hunting decisions get a lot easier.',
          points: ['The harvest photo caps off the final season'] },
        { icon: '🎂', title: 'Age him',
          text: 'Set an estimated birth year (Edit on the card) and every season is labeled with his fall age — 3½, 4½ — right up to "5½ at harvest".',
          chips: ['Est. birth year', '4½'] },
        { icon: '💡', title: 'Make it stick',
          text: 'Give bucks memorable names, and link a sighting every time he shows up on camera. Buck Watch is your own record — it never touches the plan or reports.',
          chips: ['“Crabclaw”', '“Tall Tines”'] }
      ]
    },
    map: {
      title: 'Property Map',
      slides: [
        { icon: '🗺️', title: 'The ranch from above',
          text: 'Every pinned log entry, your census routes, and your registered assets — all on your own property photo. No image yet? Upload one in Settings → Property.' },
        { icon: '📍', title: 'Pins from your log',
          text: 'Entry pins come from "Set Location" on Activity Log entries; click any pin for details and a jump back to the entry.',
          points: ['Clusters show where the work happens — and what’s being neglected'] },
        { icon: '🔧', title: 'The asset layer',
          text: 'Feeders, troughs, blinds, and cameras pinned in the Asset Registry show as dashed gold pins, no matter the year filter.',
          chips: ['Show assets ☑'] },
        { icon: '⏱️', title: 'Replay the year',
          text: 'Use the year range and the month slider to scrub through time and watch the season’s work unfold.',
          chips: ['2024 → 2026', 'Jun 2026 ▸'] }
      ]
    },
    trends: {
      title: 'Census Trends & Analytics',
      slides: [
        { icon: '📈', title: 'The numbers behind the ranch',
          text: 'Everything on this page is computed from your Activity Log — nothing to fill out, just insights from what you’ve already recorded.' },
        { icon: '📊', title: 'Census trends',
          text: 'Counts charted by route and species. Run the same routes the same way each season — consistency is what makes the lines mean something.',
          points: ['Soft blue bars behind the lines are annual rainfall — wet and dry years explain a lot of swings'] },
        { icon: '🌧️', title: 'Rainfall',
          text: 'Annual totals from your rain-gauge entries, with this year measured against the long-term average.',
          points: ['Import your region’s history in Settings → Rainfall — your own readings always win'],
          chips: ['2026 so far: 14.2 in', '74% of average'] },
        { icon: '💰', title: 'Investment in the land',
          text: 'Purchases plus the optional cost on other entries, totaled by year and broken down by category — the paper trail behind your practices.',
          chips: ['Feed: $1,240', 'Habitat: $2,500'] },
        { icon: '🐾', title: 'Species life list',
          text: 'Every species ever documented in sightings, harvests, and censuses. Log the odd painted bunting and watch the property’s record grow.',
          chips: ['47 species', 'NEW'] }
      ]
    },
    settings: {
      title: 'Settings',
      slides: [
        { icon: '⚙️', title: 'Set up the ranch once',
          text: 'Property details and photos, census routes, the season calendar, rainfall history, photo quality, and data management all live here.' },
        { icon: '🛟', title: 'The most important thing in the app',
          text: 'All data lives in this browser — nothing is uploaded unless you turn on Google Sync. Protect it.',
          points: ['Download a backup regularly from Data Management',
                   'Or enable Google Sync to keep a copy in your own Drive',
                   'Moving devices? Export here, Restore there — or sync both'],
          chips: ['⬇ Export Backup', '🔄 Sync Now'] },
        { icon: '🤖', title: 'Let an AI fetch the data',
          text: 'The Calendar and Rainfall panes include copyable instructions for a web-connected AI assistant — it researches real TPWD dates or station rainfall and returns a file you import.',
          chips: ['Copy Instructions', 'Import JSON'] },
        { icon: '🗺️', title: 'Image and routes first',
          text: 'Upload a property image and draw your census routes before logging censuses — entries can then be tied to a route and a spot on the map.',
          chips: ['Property', 'Routes'] }
      ]
    },
    assets: {
      title: 'Ranch Assets',
      slides: [
        { icon: '🔧', title: 'Everything you maintain',
          text: 'One card per feeder, trough, blind, camera, nest box, well — and the equipment too: UTV, tractor, shredder, sprayer.',
          chips: ['+ New Asset', '🌽 Feeder', '🛻 UTV / ATV', '🚜 Tractor'] },
        { icon: '🩺', title: 'Service freshness',
          text: 'Each card shows how long since its last service, with the longest-neglected assets sorted to the top.',
          points: ['Amber past 90 days, red past a year',
                   '"Log service" opens a Maintenance entry already linked to the asset'],
          chips: ['last service 122 days ago', 'Log service'] },
        { icon: '⏰', title: 'Reminders',
          text: 'Dated to-dos — "grease the feeder motor Sep 1" — optionally tied to an asset. They surface on the home-page calendar when due.',
          points: ['Completing one there offers the next date: 7 days, 1 month, 6 months, or a year out'],
          chips: ['+ New Reminder', '✓ Complete'] },
        { icon: '📍', title: 'Pin it, retire it',
          text: 'Pin fixed infrastructure on the property map from the Edit row, and retire gear you’ve sold instead of deleting it — the history stays.',
          chips: ['📍 Pin on map', 'Retired'] }
      ]
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
    '.help-popup{background:white;border-radius:14px;width:560px;overflow:hidden;' +
      'max-width:calc(100vw - 40px);max-height:88vh;display:flex;flex-direction:column;' +
      'box-shadow:0 10px 40px rgba(0,0,0,0.3);font-family:Arial,sans-serif;' +
      'animation:helpPopIn 0.18s ease}' +
    '@keyframes helpPopIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:none}}' +
    '.help-head{background:linear-gradient(135deg,#1a4a1a,#2c5e2c);color:#e9f2e6;' +
      'padding:13px 20px;display:flex;align-items:center;gap:10px}' +
    '.help-head .ht{font-size:0.95rem;font-weight:700;letter-spacing:0.02em}' +
    '.help-head .hstep{margin-left:auto;font-size:0.74rem;opacity:0.75}' +
    '.help-slide{padding:26px 30px 10px;overflow-y:auto;min-height:268px;' +
      'animation:helpSlideIn 0.22s ease}' +
    '@keyframes helpSlideIn{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}' +
    '.help-slide.back{animation:helpSlideBack 0.22s ease}' +
    '@keyframes helpSlideBack{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:none}}' +
    '.help-icon{width:72px;height:72px;border-radius:50%;margin:0 auto 14px;font-size:2.1rem;' +
      'display:flex;align-items:center;justify-content:center;' +
      'background:radial-gradient(circle at 32% 30%,#eef7ea,#d4e6cc);' +
      'box-shadow:inset 0 0 0 2px rgba(26,74,26,0.18)}' +
    '.help-slide h4{color:#1a4a1a;font-size:1.12rem;text-align:center;margin:0 0 10px}' +
    '.help-text{font-size:0.89rem;color:#444;line-height:1.55;text-align:center;margin:0 0 12px}' +
    '.help-points{list-style:none;margin:0 auto 12px;padding:0;max-width:430px}' +
    '.help-points li{font-size:0.84rem;color:#555;line-height:1.45;padding:3px 0 3px 22px;position:relative}' +
    '.help-points li::before{content:"▸";position:absolute;left:6px;color:#5a8a4a;font-weight:700}' +
    '.help-chips{display:flex;gap:7px;flex-wrap:wrap;justify-content:center;margin:2px 0 8px}' +
    '.help-chip{font-size:0.76rem;font-weight:600;color:#1a4a1a;background:#eef4ec;' +
      'border:1px solid #c4d8bc;border-radius:14px;padding:4px 12px;white-space:nowrap}' +
    '.help-foot{display:flex;align-items:center;padding:12px 18px 16px;gap:10px}' +
    '.help-dots{display:flex;gap:7px;margin:0 auto}' +
    '.help-dot{width:9px;height:9px;border-radius:50%;background:#d4ddd0;border:none;' +
      'padding:0;cursor:pointer;transition:background 0.15s,transform 0.15s}' +
    '.help-dot.on{background:#1a4a1a;transform:scale(1.25)}' +
    '.help-btn{border:none;border-radius:7px;padding:9px 20px;font-size:0.86rem;font-weight:600;' +
      'font-family:Arial,sans-serif;cursor:pointer;transition:background 0.15s}' +
    '.help-btn.next{background:#1a4a1a;color:white}' +
    '.help-btn.next:hover{background:#256325}' +
    '.help-btn.back{background:#eef0ec;color:#444}' +
    '.help-btn.back:hover{background:#dde2da}' +
    '.help-btn.back.hidden{visibility:hidden}' +
    '@media print{.help-fab,.help-overlay{display:none !important}}' +
    '@media (max-width:720px){.help-fab{right:12px;bottom:12px;width:40px;height:40px;font-size:1.1rem}' +
      '.help-slide{padding:20px 18px 6px;min-height:240px}}';
  document.head.appendChild(style);

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function openPopup() {
    var idx = 0;
    var lastIdx = 0;
    var n = topic.slides.length;

    var overlay = document.createElement('div');
    overlay.className = 'help-overlay';
    overlay.innerHTML =
      '<div class="help-popup" role="dialog" aria-modal="true" aria-label="Page help">' +
        '<div class="help-head"><span>❓</span><span class="ht">' + esc(topic.title) + '</span>' +
          '<span class="hstep"></span></div>' +
        '<div class="help-slide"></div>' +
        '<div class="help-foot">' +
          '<button class="help-btn back">Back</button>' +
          '<div class="help-dots"></div>' +
          '<button class="help-btn next">Next</button>' +
        '</div>' +
      '</div>';

    var slideEl = overlay.querySelector('.help-slide');
    var dotsEl = overlay.querySelector('.help-dots');
    var backBtn = overlay.querySelector('.help-btn.back');
    var nextBtn = overlay.querySelector('.help-btn.next');
    var stepEl = overlay.querySelector('.hstep');

    function render() {
      var s = topic.slides[idx];
      slideEl.classList.remove('back');
      if (idx < lastIdx) slideEl.classList.add('back');
      // restart the slide animation
      slideEl.style.animation = 'none';
      void slideEl.offsetWidth;
      slideEl.style.animation = '';

      slideEl.innerHTML =
        '<div class="help-icon">' + s.icon + '</div>' +
        '<h4>' + esc(s.title) + '</h4>' +
        '<p class="help-text">' + esc(s.text) + '</p>' +
        (s.points ? '<ul class="help-points">' + s.points.map(function(p) {
          return '<li>' + esc(p) + '</li>';
        }).join('') + '</ul>' : '') +
        (s.chips ? '<div class="help-chips">' + s.chips.map(function(c) {
          return '<span class="help-chip">' + esc(c) + '</span>';
        }).join('') + '</div>' : '');

      dotsEl.innerHTML = topic.slides.map(function(_, i) {
        return '<button class="help-dot' + (i === idx ? ' on' : '') + '" data-i="' + i +
          '" aria-label="Slide ' + (i + 1) + '"></button>';
      }).join('');

      stepEl.textContent = (idx + 1) + ' / ' + n;
      backBtn.classList.toggle('hidden', idx === 0);
      nextBtn.textContent = (idx === n - 1) ? 'Done' : 'Next';
      lastIdx = idx;
    }

    function go(i) {
      if (i < 0) return;
      if (i >= n) { close(); return; }
      idx = i;
      render();
    }

    function close() {
      document.removeEventListener('keydown', onKey);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    function onKey(ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); close(); }
      else if (ev.key === 'ArrowRight') go(idx + 1);
      else if (ev.key === 'ArrowLeft') go(idx - 1);
    }

    overlay.addEventListener('click', function(ev) { if (ev.target === overlay) close(); });
    backBtn.addEventListener('click', function() { go(idx - 1); });
    nextBtn.addEventListener('click', function() { go(idx + 1); });
    dotsEl.addEventListener('click', function(ev) {
      var d = ev.target.closest('.help-dot');
      if (d) go(+d.getAttribute('data-i'));
    });
    document.addEventListener('keydown', onKey);
    render();
    document.body.appendChild(overlay);
    nextBtn.focus();
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
