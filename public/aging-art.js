// Illustrations for the Deer Aging tool (aging.html). Everything is drawn as
// inline SVG from a few body proportions, so every answer choice gets a
// picture that exaggerates exactly the cue it describes — neck junction,
// chest vs. hindquarter depth, leg length, belly line, head and jaw skin,
// antler spread against the ear tips, and tooth replacement / wear.
// These are schematic drawings, not photos; real deer vary.
// Loaded in <body> (not <head>) so it runs on SPA soft navigation.
(function() {
  'use strict';

  var FILL = '#a8805a', LINE = '#6e5236', LEG = '#8a6544', DARK = '#2b2118';
  var ANTLER = '#c9b58c', ANTLER_LINE = '#8f7a52', FOCUS = '#d4860f';

  // Body proportions per age class. leg/chest/ham are depths in px, sag is
  // how far the belly hangs (negative = tucked), join is where the neck's
  // front line meets the chest (0 = top, 1 = down at the brisket).
  var BUCK = [
    { leg: 50, chest: 29, ham: 25, len: 82, sag: -7, sway: 0, neck: 6,  join: 0.38, headLen: 30, headH: 10.5, jowl: 0,   ear: 1.25, antler: 'spike' },
    { leg: 47, chest: 33, ham: 30, len: 87, sag: -4, sway: 0, neck: 11, join: 0.6,  headLen: 31, headH: 12,   jowl: 0,   ear: 1.1,  antler: 'small' },
    { leg: 45, chest: 36, ham: 34, len: 90, sag: -1, sway: 0, neck: 16, join: 0.74, headLen: 31, headH: 13.5, jowl: 0,   ear: 1.0,  antler: 'med' },
    { leg: 41, chest: 41, ham: 34, len: 94, sag: 2,  sway: 0, neck: 22, join: 0.92, headLen: 32, headH: 15,   jowl: 2.5, ear: 0.95, antler: 'large' },
    { leg: 38, chest: 44, ham: 35, len: 96, sag: 8,  sway: 2, neck: 27, join: 1.0,  headLen: 32, headH: 16,   jowl: 4,   ear: 0.9,  antler: 'large' }
  ];
  var DOE = [
    { leg: 34, chest: 22, ham: 20, len: 48, sag: -3, sway: 0, neck: 6,  join: 0.45, headLen: 20, headH: 11,   jowl: 0, ear: 1.2,  spots: true },
    { leg: 46, chest: 27, ham: 24, len: 70, sag: -4, sway: 0, neck: 7,  join: 0.45, headLen: 27, headH: 11,   jowl: 0, ear: 1.1 },
    { leg: 45, chest: 33, ham: 30, len: 94, sag: 0,  sway: 0, neck: 10, join: 0.55, headLen: 35, headH: 12,   jowl: 0, ear: 0.92 },
    { leg: 43, chest: 34, ham: 30, len: 96, sag: 9,  sway: 6, neck: 11, join: 0.6,  headLen: 36, headH: 12.5, jowl: 1, ear: 0.92 }
  ];

  function r(n) { return Math.round(n * 10) / 10; }
  function pt(x, y) { return r(x) + ' ' + r(y); }
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in (b || {})) o[k] = b[k]; return o; }

  // Side-profile deer facing right. Returns { g: svg group markup, geo }.
  function deerParts(p, opt) {
    opt = opt || {};
    var G = 124;
    var cb = G - p.leg, top = cb - p.chest, hb = top + p.ham;
    var rx = 26, sx = rx + p.len, fx = sx + 13;
    var px = sx + 25, py = top - 33;
    var jy = top + p.chest * p.join;
    var s = '';

    // Legs (drawn first so the torso overlaps their tops)
    var lw = p.leg > 40 ? 4.6 : 4;
    function leg(d, shade) {
      return '<path d="' + d + '" fill="none" stroke="' + (shade ? '#755537' : LEG) + '" stroke-width="' + lw + '" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    s += leg('M' + pt(fx - 20, cb - 6) + ' L' + pt(fx - 21, G - 14) + ' L' + pt(fx - 19, G), true);
    s += leg('M' + pt(rx + 24, hb - 8) + ' L' + pt(rx + 14, G - 18) + ' L' + pt(rx + 20, G), true);
    s += leg('M' + pt(fx - 11, cb - 6) + ' L' + pt(fx - 10, G - 14) + ' L' + pt(fx - 8, G));
    s += leg('M' + pt(rx + 16, hb - 8) + ' L' + pt(rx + 6, G - 18) + ' L' + pt(rx + 11, G));

    // Torso + neck as one outline
    var throatX = px + 7, throatY = py + p.headH + p.jowl * 0.6;
    var d = 'M' + pt(rx + 8, top) +
      ' Q' + pt(rx + p.len * 0.5, top + p.sway * 2) + ' ' + pt(sx, top + 1) +
      ' Q' + pt(sx + 9 - p.neck * 0.2, top - 20 - p.neck * 0.25) + ' ' + pt(px + 1, py + 4) +
      ' L' + pt(throatX, throatY) +
      ' Q' + pt(throatX - 2 + p.neck * 0.5, (throatY + jy) / 2 + 2 + p.neck * 0.2) + ' ' + pt(fx, jy) +
      ' Q' + pt(fx + 5, (jy + cb) / 2 + 2) + ' ' + pt(fx - 7, cb) +
      ' Q' + pt(rx + p.len * 0.55, (cb + hb) / 2 + p.sag) + ' ' + pt(rx + 18, hb) +
      ' Q' + pt(rx - 9, (top + hb) / 2) + ' ' + pt(rx + 8, top) + ' Z';
    s += '<path d="' + d + '" fill="' + (opt.fill || FILL) + '" stroke="' + (opt.line || LINE) + '" stroke-width="' + (opt.lineW || 1.2) + '" stroke-linejoin="round"/>';

    // Tail
    s += '<path d="M' + pt(rx + 6, top + 3) + ' Q' + pt(rx - 6, top + 5) + ' ' + pt(rx - 5, top + 15) + '" fill="none" stroke="' + LINE + '" stroke-width="3" stroke-linecap="round"/>';

    // Fawn spots
    if (p.spots) {
      for (var i = 0; i < 7; i++) {
        s += '<circle cx="' + r(rx + 10 + i * (p.len / 7)) + '" cy="' + r(top + 5 + (i % 2) * 5) + '" r="1.5" fill="#f7efe0"/>';
      }
    }

    // Head
    var L = p.headLen, H = p.headH;
    var hd = 'M' + pt(px - 2, py + 3) +
      ' Q' + pt(px + L * 0.35, py - 3) + ' ' + pt(px + L * 0.72, py + H * 0.25) +
      ' L' + pt(px + L, py + H * 0.55) +
      ' Q' + pt(px + L + 2, py + H * 0.92) + ' ' + pt(px + L - 3, py + H) +
      ' L' + pt(px + L * 0.35, py + H + 1) +
      ' Q' + pt(px + L * 0.12, py + H + 2 + p.jowl * 1.6) + ' ' + pt(throatX, throatY) +
      ' Q' + pt(px - 5, py + H * 0.55) + ' ' + pt(px - 2, py + 3) + ' Z';
    s += '<path d="' + hd + '" fill="' + (opt.fill || FILL) + '" stroke="' + (opt.line || LINE) + '" stroke-width="' + (opt.lineW || 1.2) + '" stroke-linejoin="round"/>';
    // White throat patch, eye, nose
    s += '<ellipse cx="' + r(throatX + 3 + p.neck * 0.15) + '" cy="' + r(throatY + 6) + '" rx="3" ry="2.2" fill="#f2ead9"/>';
    s += '<circle cx="' + r(px + L * 0.42) + '" cy="' + r(py + H * 0.33) + '" r="1.4" fill="' + DARK + '"/>';
    s += '<circle cx="' + r(px + L - 0.5) + '" cy="' + r(py + H * 0.62) + '" r="1.7" fill="' + DARK + '"/>';

    // Ear
    var e = p.ear;
    s += '<path d="M' + pt(px + 1, py + 4) + ' Q' + pt(px - 13 * e, py - 3 * e) + ' ' + pt(px - 9 * e, py - 13 * e) +
      ' Q' + pt(px + 2, py - 7 * e) + ' ' + pt(px + 5, py + 3) + ' Z" fill="' + (opt.fill || FILL) + '" stroke="' + (opt.line || LINE) + '" stroke-width="1"/>';

    // Antlers (side view)
    var bx = px + 6, by = py;
    var a = '';
    if (p.antler === 'spike') {
      a = 'M' + pt(bx, by) + ' Q' + pt(bx - 1, by - 12) + ' ' + pt(bx + 5, by - 19);
    } else if (p.antler === 'small') {
      a = 'M' + pt(bx, by) + ' Q' + pt(bx - 6, by - 18) + ' ' + pt(bx + 14, by - 22) +
        ' M' + pt(bx + 2, by - 13) + ' L' + pt(bx + 4, by - 22);
    } else if (p.antler === 'med') {
      a = 'M' + pt(bx, by) + ' Q' + pt(bx - 9, by - 22) + ' ' + pt(bx + 18, by - 25) +
        ' M' + pt(bx + 1, by - 15) + ' L' + pt(bx + 2, by - 27) +
        ' M' + pt(bx + 8, by - 21) + ' L' + pt(bx + 10, by - 31) +
        ' M' + pt(bx + 1, by - 4) + ' L' + pt(bx + 6, by - 8);
    } else if (p.antler === 'large') {
      a = 'M' + pt(bx, by) + ' Q' + pt(bx - 12, by - 26) + ' ' + pt(bx + 24, by - 28) +
        ' M' + pt(bx + 0, by - 17) + ' L' + pt(bx + 0, by - 33) +
        ' M' + pt(bx + 8, by - 23) + ' L' + pt(bx + 10, by - 38) +
        ' M' + pt(bx + 16, by - 26) + ' L' + pt(bx + 19, by - 37) +
        ' M' + pt(bx + 1, by - 4) + ' L' + pt(bx + 8, by - 9);
    }
    if (a) {
      var aw = p.antler === 'large' ? 3 : p.antler === 'med' ? 2.4 : 2;
      s += '<path d="' + a + '" fill="none" stroke="' + ANTLER_LINE + '" stroke-width="' + (aw + 1.4) + '" stroke-linecap="round"/>' +
        '<path d="' + a + '" fill="none" stroke="' + ANTLER + '" stroke-width="' + aw + '" stroke-linecap="round"/>';
    }

    return { g: s, geo: { G: G, cb: cb, top: top, hb: hb, rx: rx, sx: sx, fx: fx, px: px, py: py, jy: jy, throatX: throatX, throatY: throatY } };
  }

  // Amber markup that points at the cue being judged
  function focusMark(focus, p, q) {
    var dash = ' fill="none" stroke="' + FOCUS + '" stroke-width="2" stroke-dasharray="4 3"';
    var solid = ' stroke="' + FOCUS + '" stroke-width="2.2" stroke-linecap="round"';
    function arrow(x, y1, y2) {
      return '<path d="M' + pt(x, y1) + ' L' + pt(x, y2) + ' M' + pt(x - 3, y1 + 4) + ' L' + pt(x, y1) + ' L' + pt(x + 3, y1 + 4) +
        ' M' + pt(x - 3, y2 - 4) + ' L' + pt(x, y2) + ' L' + pt(x + 3, y2 - 4) + '" fill="none"' + solid + '/>';
    }
    if (focus === 'neck') {
      // Dot where the neck's front line meets the chest
      return '<circle cx="' + r(q.fx) + '" cy="' + r(q.jy) + '" r="5"' + dash + '/>' +
        '<path d="M' + pt(q.fx + 6, q.jy) + ' L' + pt(q.fx + 20, q.jy) + '"' + solid + '/>';
    }
    if (focus === 'chest') {
      return arrow(q.fx - 15, q.top + 1, q.cb - 1) + arrow(q.rx + 13, q.top + 1, q.hb - 1);
    }
    if (focus === 'legs') return arrow(q.fx + 8, q.cb, q.G);
    if (focus === 'belly') {
      return '<ellipse cx="' + r(q.rx + p.len * 0.52) + '" cy="' + r((q.cb + q.hb) / 2 + p.sag * 0.5 + 2) + '" rx="' + r(p.len * 0.32) + '" ry="9"' + dash + '/>';
    }
    if (focus === 'box') {
      // Whole body, back to ground: a fawn fits a square, an adult a long rectangle
      return '<rect x="' + r(q.rx - 7) + '" y="' + r(q.top - 3) + '" width="' + r(q.fx - q.rx + 11) + '" height="' + r(q.G - q.top + 4) + '"' + dash + '/>';
    }
    if (focus === 'back') {
      return '<path d="M' + pt(q.rx + 6, q.top - 5) + ' Q' + pt(q.rx + p.len * 0.5, q.top - 5 + p.sway * 2) + ' ' + pt(q.sx, q.top - 4) + '"' + dash + '/>' +
        '<ellipse cx="' + r(q.rx + p.len * 0.52) + '" cy="' + r((q.cb + q.hb) / 2 + p.sag * 0.5 + 2) + '" rx="' + r(p.len * 0.3) + '" ry="8"' + dash + '/>';
    }
    return '';
  }

  function svg(viewBox, body, label) {
    return '<svg viewBox="' + viewBox + '" role="img" aria-label="' + (label || 'Illustration') + '" preserveAspectRatio="xMidYMid meet">' + body + '</svg>';
  }

  // Full side view. view 'head' crops to the head, neck and jaw.
  function deer(p, focus, view) {
    var parts = deerParts(p);
    var q = parts.geo;
    if (view === 'head') {
      var x = q.px - 24, y = q.py - 40;
      var hm = '';
      if (focus === 'jaw') {
        hm = '<ellipse cx="' + r(q.px + p.headLen * 0.25) + '" cy="' + r(q.py + p.headH + 2 + p.jowl) + '" rx="12" ry="' + r(5 + p.jowl * 0.8) + '" fill="none" stroke="' + FOCUS + '" stroke-width="1.6" stroke-dasharray="3 2.5"/>';
      }
      if (focus === 'snout') {
        var sy = q.py + p.headH + 6;
        hm = '<path d="M' + pt(q.px + p.headLen * 0.42, sy) + ' L' + pt(q.px + p.headLen, sy) + '" stroke="' + FOCUS + '" stroke-width="2" stroke-linecap="round"/>' +
          '<path d="M' + pt(q.px + p.headLen * 0.42, sy - 3) + ' L' + pt(q.px + p.headLen * 0.42, sy + 3) + ' M' + pt(q.px + p.headLen, sy - 3) + ' L' + pt(q.px + p.headLen, sy + 3) + '" stroke="' + FOCUS + '" stroke-width="2"/>';
      }
      return svg(pt(x, y) + ' 80 66', parts.g + hm, 'Head profile');
    }
    return svg('10 -30 190 158', parts.g + focusMark(focus, p, q), 'Deer side view');
  }

  // Several deer in a line; `pick` is the index to highlight
  function group(members, pick, label) {
    var s = '', x = 0;
    members.forEach(function(m, i) {
      var parts = deerParts(m.p, i === pick ? { line: FOCUS, lineW: 2.6 } : { fill: '#bfa284', line: '#8c7357' });
      var sc = m.s;
      s += '<g transform="translate(' + r(x) + ' ' + r(150 - 150 * sc) + ') scale(' + sc + ')">' + parts.g + '</g>';
      x += (m.p.len + 70) * sc;
    });
    return svg('0 -10 ' + r(Math.max(x, 200)) + ' 160', s, label || 'Group of deer');
  }

  // Head-on view to judge antler spread against the ear tips
  function front(spread, heavy) {
    var cx = 100, s = '';
    var earL = 38, earR = 162; // ear tips: "about 15 inches" relaxed
    s += '<path d="M' + pt(cx - 6, 56) + ' Q' + pt(cx - 34, 30) + ' ' + pt(earL, 36) + ' Q' + pt(cx - 28, 66) + ' ' + pt(cx - 9, 66) + ' Z" fill="' + FILL + '" stroke="' + LINE + '" stroke-width="1.2"/>';
    s += '<path d="M' + pt(cx + 6, 56) + ' Q' + pt(cx + 34, 30) + ' ' + pt(earR, 36) + ' Q' + pt(cx + 28, 66) + ' ' + pt(cx + 9, 66) + ' Z" fill="' + FILL + '" stroke="' + LINE + '" stroke-width="1.2"/>';
    s += '<path d="M' + pt(cx - 12, 58) + ' Q' + pt(cx - 30, 42) + ' ' + pt(earL + 8, 40) + ' M' + pt(cx + 12, 58) + ' Q' + pt(cx + 30, 42) + ' ' + pt(earR - 8, 40) + '" fill="none" stroke="#e9dcc8" stroke-width="2.5" stroke-linecap="round"/>';
    // Antlers: beams sweep out and forward from the bases
    var half = spread / 2, w = heavy ? 4.4 : 2.8;
    function side(sign) {
      var b = cx + sign * 9, o = cx + sign * half;
      return 'M' + pt(b, 50) + ' Q' + pt(o + sign * 4, 44) + ' ' + pt(o, 18) + ' Q' + pt(o - sign * 2, 10) + ' ' + pt(o - sign * 12, 6) +
        ' M' + pt(b + sign * (half - 9) * 0.45, 40) + ' L' + pt(b + sign * (half - 9) * 0.4, 20) +
        (heavy ? ' M' + pt(o - sign * 2, 26) + ' L' + pt(o - sign * 8, 10) : '');
    }
    var a = side(-1) + ' ' + side(1);
    s += '<path d="' + a + '" fill="none" stroke="' + ANTLER_LINE + '" stroke-width="' + (w + 1.4) + '" stroke-linecap="round"/>' +
      '<path d="' + a + '" fill="none" stroke="' + ANTLER + '" stroke-width="' + w + '" stroke-linecap="round"/>';
    // Face, eyes, nose
    s += '<path d="M' + pt(cx - 14, 52) + ' Q' + pt(cx, 44) + ' ' + pt(cx + 14, 52) + ' L' + pt(cx + 8, 92) + ' Q' + pt(cx, 98) + ' ' + pt(cx - 8, 92) + ' Z" fill="' + FILL + '" stroke="' + LINE + '" stroke-width="1.2"/>';
    s += '<circle cx="' + (cx - 8) + '" cy="62" r="2" fill="' + DARK + '"/><circle cx="' + (cx + 8) + '" cy="62" r="2" fill="' + DARK + '"/>';
    s += '<ellipse cx="' + cx + '" cy="92" rx="5" ry="3.5" fill="' + DARK + '"/>';
    // Ear-tip guides
    s += '<path d="M' + earL + ' 104 L' + earL + ' 2 M' + earR + ' 104 L' + earR + ' 2" stroke="' + FOCUS + '" stroke-width="1.4" stroke-dasharray="3 3"/>';
    s += '<text x="' + cx + '" y="112" text-anchor="middle" font-size="9.5" fill="#8b5a1a" font-weight="700">ear tips</text>';
    return svg('10 -2 180 118', s, 'Antler spread compared with ear tips');
  }

  // ── Jaw drawings (tooth 6 at the back on the left, tooth 1 at the front) ──
  var ENAMEL = '#fbfaf5', ENAMEL_LINE = '#8a8270', DENTINE = '#9a6a3a', BONE = '#efe7d3', BONE_LINE = '#bcae8e';

  function toothRow(count, sixthLow, hl) {
    var teeth = [{ n: 6, w: 50 }, { n: 5, w: 40 }, { n: 4, w: 37 }, { n: 3, w: 31 }, { n: 2, w: 25 }, { n: 1, w: 21 }];
    var s = '<path d="M4 46 Q6 30 20 30 L232 33 Q252 35 252 48 L252 62 Q240 74 210 74 L30 76 Q4 76 4 62 Z" fill="' + BONE + '" stroke="' + BONE_LINE + '" stroke-width="1.3"/>';
    var x = 12;
    teeth.forEach(function(t) {
      var present = t.n <= count || (t.n === 6 && sixthLow);
      if (present) {
        var low = t.n === 6 && sixthLow;
        var top = low ? 38 : 18, lobes = t.n >= 4 ? 2 : (t.n === 1 ? 1 : 2);
        var lw = t.w / lobes, d = 'M' + x + ' 46 L' + x + ' ' + (top + 5);
        for (var i = 0; i < lobes; i++) d += ' Q' + r(x + i * lw + lw / 2) + ' ' + (top - 6) + ' ' + r(x + (i + 1) * lw) + ' ' + (top + 5);
        d += ' L' + (x + t.w) + ' 46 Z';
        var on = hl.indexOf(t.n) !== -1;
        s += '<path d="' + d + '" fill="' + (on ? '#f6e7b8' : ENAMEL) + '" stroke="' + (on ? '#8b5a1a' : ENAMEL_LINE) + '" stroke-width="' + (on ? 2 : 1.3) + '"/>';
      } else {
        s += '<path d="M' + (x + 4) + ' 40 Q' + (x + t.w / 2) + ' 36 ' + (x + t.w - 4) + ' 40" fill="none" stroke="' + BONE_LINE + '" stroke-width="1.2" stroke-dasharray="2 2"/>';
      }
      s += '<text x="' + r(x + t.w / 2) + '" y="62" text-anchor="middle" font-size="11" font-weight="700" fill="' + (present ? '#5a5446' : '#b5ab95') + '">' + t.n + '</text>';
      x += t.w + 4;
    });
    return s;
  }

  function jawCount(count, sixthLow) {
    return svg('0 0 256 80', toothRow(count, sixthLow, sixthLow ? [6] : []), 'Cheek teeth count');
  }

  // Close-up of tooth 3 with 3 cusps (baby) or 2 cusps (permanent)
  function p3(cusps) {
    var s = '<rect x="0" y="62" width="160" height="22" rx="6" fill="' + BONE + '" stroke="' + BONE_LINE + '"/>';
    s += '<path d="M8 66 L8 34 Q22 22 36 34 L36 66 Z" fill="' + ENAMEL + '" stroke="#c9c1ae" stroke-width="1.2"/>';
    s += '<path d="M124 66 L124 36 Q138 24 152 36 L152 66 Z" fill="' + ENAMEL + '" stroke="#c9c1ae" stroke-width="1.2"/>';
    var x0 = 44, w = 72, lw = w / cusps;
    var d = 'M' + x0 + ' 66 L' + x0 + ' 30';
    for (var i = 0; i < cusps; i++) d += ' Q' + r(x0 + i * lw + lw / 2) + ' ' + (cusps === 3 ? 10 : 8) + ' ' + r(x0 + (i + 1) * lw) + ' 30';
    d += ' L' + (x0 + w) + ' 66 Z';
    s += '<path d="' + d + '" fill="' + (cusps === 3 ? '#efe4c8' : ENAMEL) + '" stroke="#8b5a1a" stroke-width="2"/>';
    if (cusps === 3) s += '<path d="M50 32 Q80 26 110 32" fill="none" stroke="' + DENTINE + '" stroke-width="2.5" opacity="0.6"/>';
    s += '<text x="80" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="#5a5446">tooth 3</text>';
    for (var c = 0; c < cusps; c++) s += '<circle cx="' + r(x0 + c * lw + lw / 2) + '" cy="6" r="2.4" fill="' + FOCUS + '"/>';
    return svg('0 0 160 86', s, 'Tooth 3 with ' + cusps + ' cusps');
  }

  // Wear on teeth 6, 5, 4 (left to right). `w` = wear of tooth 4,5,6;
  // `back` = shape of tooth 6's back cusp.
  var WEAR = [
    { w: [0.1, 0.05, 0.0], back: 'point' },
    { w: [0.42, 0.25, 0.15], back: 'concave' },
    { w: [0.68, 0.45, 0.3], back: 'slope' },
    { w: [0.9, 0.66, 0.5], back: 'slope' },
    { w: [1.05, 0.88, 0.74], back: 'slope' },
    { w: [1.15, 1.06, 0.9], back: 'slope' },
    { w: [1.25, 1.2, 1.12], back: 'slope' }
  ];

  function wear(stage) {
    var W = WEAR[stage];
    var s = '<rect x="0" y="70" width="240" height="20" rx="6" fill="' + BONE + '" stroke="' + BONE_LINE + '"/>';
    var teeth = [{ n: 6, x: 6, w: 92, lobes: 3, wv: W.w[2] }, { n: 5, x: 102, w: 66, lobes: 2, wv: W.w[1] }, { n: 4, x: 172, w: 62, lobes: 2, wv: W.w[0] }];
    teeth.forEach(function(t) {
      var lw = t.w / t.lobes, outline = 'M' + t.x + ' 74', dent = '';
      for (var i = 0; i < t.lobes; i++) {
        var wv = t.wv, xl = t.x + i * lw, xr = xl + lw, xm = (xl + xr) / 2;
        var peak = 18 + Math.min(wv, 1.3) * 16;
        var shoulder = peak + 6;
        var ctrl = wv <= 1 ? shoulder - (1 - wv) * 26 - 2 : shoulder + (wv - 1) * 18;
        // Back cusp of tooth 6 is the left-most lobe
        if (t.n === 6 && i === 0) {
          if (W.back === 'point') { outline += ' L' + pt(xl + 4, shoulder + 4) + ' L' + pt(xm - 3, peak - 14) + ' L' + pt(xr, shoulder); }
          else if (W.back === 'concave') { outline += ' L' + pt(xl, shoulder - 6) + ' Q' + pt(xm, shoulder + 8) + ' ' + pt(xr, shoulder - 2); }
          else { outline += ' L' + pt(xl, shoulder + 10 + wv * 6) + ' Q' + pt(xm, shoulder + 2) + ' ' + pt(xr, shoulder - 4); }
        } else {
          outline += ' L' + pt(xl, shoulder) + ' Q' + pt(xm, ctrl) + ' ' + pt(xr, shoulder);
        }
        // Dentine band along the crest; widens with wear
        if (wv < 1) {
          var dw = 1.5 + wv * 7;
          var c1 = ctrl;
          dent += '<path d="M' + pt(xl + 4, shoulder + 2) + ' Q' + pt(xm, c1 + 3) + ' ' + pt(xr - 4, shoulder + 2) +
            ' L' + pt(xr - 4, shoulder + 2 + dw) + ' Q' + pt(xm, c1 + 3 + dw * 1.6) + ' ' + pt(xl + 4, shoulder + 2 + dw) + ' Z" fill="' + DENTINE + '"/>';
        }
      }
      outline += ' L' + (t.x + t.w) + ' 74 Z';
      s += '<path d="' + outline + '" fill="' + ENAMEL + '" stroke="' + ENAMEL_LINE + '" stroke-width="1.4" stroke-linejoin="round"/>';
      if (t.wv >= 1) {
        // Worn smooth / dished: dentine spans the tooth, center enamel ridge gone
        var top = 18 + Math.min(t.wv, 1.3) * 16 + 9;
        s += '<rect x="' + r(t.x + 5) + '" y="' + r(top) + '" width="' + r(t.w - 10) + '" height="15" rx="6" fill="' + DENTINE + '"/>';
      } else {
        s += dent;
      }
      s += '<text x="' + r(t.x + t.w / 2) + '" y="85" text-anchor="middle" font-size="11" font-weight="700" fill="#5a5446">' + t.n + '</text>';
    });
    return svg('0 -6 240 96', s, 'Molar wear on teeth 4 to 6');
  }

  window.agArt = { BUCK: BUCK, DOE: DOE, deer: deer, group: group, front: front, jawCount: jawCount, p3: p3, wear: wear, merge: merge };
})();
