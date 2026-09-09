// Assemble dist/chrome and dist/firefox from build/ + manifest/ + static assets.
// Deep-merges base.json with the per-browser overlay. Missing bundle = hard error.
import {
  copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const buildDir = join(root, 'build');
const manifestDir = join(root, 'manifest');
const uiDir = join(root, 'src', 'ui');
const fontsDir = join(uiDir, 'fonts');
const iconsDir = join(root, 'icons');

const EXPECTED = ['background.js', 'agent.js', 'popup.js', 'dashboard.js', 'styles.css', 'THIRD_PARTY_NOTICES.txt'];
const STATIC = ['popup.html', 'dashboard.html'];

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const deepMerge = (a, b) => {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = isObj(v) && isObj(out[k]) ? deepMerge(out[k], v) : v;
  }
  return out;
};

const missing = EXPECTED.filter((f) => !existsSync(join(buildDir, f)));
if (missing.length) {
  console.error(`assemble: missing artefact(s): ${missing.join(', ')} — run build first`);
  process.exit(1);
}

const base = readJson(join(manifestDir, 'base.json'));
// package.json is the single source of the extension version; stamp it into each
// generated manifest so manifest/*.json never carries (and drifts) a version.
const { version } = readJson(join(root, 'package.json'));

for (const target of ['chrome', 'firefox']) {
  const outDir = join(root, 'dist', target);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const manifest = { ...deepMerge(base, readJson(join(manifestDir, `${target}.json`))), version };
  writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  for (const f of readdirSync(buildDir)) {
    if (/\.(js|js\.map|css|css\.map)$/.test(f)) copyFileSync(join(buildDir, f), join(outDir, f));
  }
  for (const f of STATIC) copyFileSync(join(uiDir, f), join(outDir, f));
  copyFileSync(join(buildDir, 'THIRD_PARTY_NOTICES.txt'), join(outDir, 'THIRD_PARTY_NOTICES.txt'));
  copyFileSync(join(root, 'LICENSE'), join(outDir, 'LICENSE'));
  if (existsSync(iconsDir)) {
    for (const f of readdirSync(iconsDir)) {
      if (f.endsWith('.png')) copyFileSync(join(iconsDir, f), join(outDir, f));
    }
  }
  if (existsSync(fontsDir)) {
    const outFonts = join(outDir, 'fonts');
    mkdirSync(outFonts, { recursive: true });
    for (const f of readdirSync(fontsDir)) copyFileSync(join(fontsDir, f), join(outFonts, f));
  }
  console.log(`assembled dist/${target}`);
}
