// Builds public/ into dist/ with minified HTML, JS, and CSS.
//
// public/ stays the editable source (and is what `npm start` serves for local
// dev); dist/ is the optimized copy that gets deployed — wrangler.jsonc points
// assets.directory at it. Run after build-version.js so the generated
// version.js is minified too. `npm run build` chains both.
//
// Safety: terser runs with default options, which for classic (non-module)
// scripts do NOT mangle or drop top-level names. That's essential here — the
// app wires up hundreds of inline onclick handlers (onclick="saveEntry()")
// that reference global functions by name, so those names must survive.

const fs = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');
const { minify: minifyJs } = require('terser');
const CleanCSS = require('clean-css');

const SRC = path.join(__dirname, 'public');
const OUT = path.join(__dirname, 'dist');

const cleanCss = new CleanCSS({ level: 2, returnPromise: false });

const HTML_OPTS = {
  collapseWhitespace: true,   // preserves <pre>/<textarea>/<script>/<style> contents
  conservativeCollapse: false,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,             // terser on inline <script> blocks (default-safe options)
  // Deliberately NOT enabling attribute/quote removal — keep markup behavior
  // identical, just smaller.
};

function listFiles(dir, base) {
  base = base || dir;
  var out = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function(ent) {
    var full = path.join(dir, ent.name);
    if (ent.isDirectory()) out = out.concat(listFiles(full, base));
    else out.push(path.relative(base, full));
  });
  return out;
}

async function buildOne(rel) {
  const srcPath = path.join(SRC, rel);
  const outPath = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const ext = path.extname(rel).toLowerCase();
  const before = fs.statSync(srcPath).size;

  // Non-text assets and Cloudflare config files are copied verbatim.
  if (ext !== '.html' && ext !== '.js' && ext !== '.css') {
    fs.copyFileSync(srcPath, outPath);
    return { rel, copied: true, before, after: before };
  }

  const raw = fs.readFileSync(srcPath, 'utf8');
  let out;
  if (ext === '.html') {
    out = await minifyHtml(raw, HTML_OPTS);
  } else if (ext === '.js') {
    const r = await minifyJs(raw);
    if (r.error) throw r.error;
    out = r.code;
  } else { // .css
    const r = cleanCss.minify(raw);
    if (r.errors && r.errors.length) throw new Error(r.errors.join('; '));
    out = r.styles;
  }
  fs.writeFileSync(outPath, out);
  return { rel, before, after: Buffer.byteLength(out) };
}

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const files = listFiles(SRC);
  let totalBefore = 0, totalAfter = 0, minified = 0, copied = 0;

  for (const rel of files) {
    let res;
    try {
      res = await buildOne(rel);
    } catch (e) {
      console.error('  ✗ ' + rel + ' — ' + e.message);
      process.exit(1);
    }
    totalBefore += res.before;
    totalAfter += res.after;
    if (res.copied) copied++;
    else minified++;
  }

  const pct = totalBefore ? Math.round((1 - totalAfter / totalBefore) * 100) : 0;
  console.log('build-static: ' + minified + ' minified, ' + copied + ' copied -> dist/');
  console.log('build-static: ' + (totalBefore / 1024).toFixed(0) + ' KB -> ' +
    (totalAfter / 1024).toFixed(0) + ' KB (' + pct + '% smaller)');
}

main();
