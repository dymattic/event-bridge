// Zero-dep supply-chain gate: exact pins only, each >=7 days old on npm.
import { readFileSync } from 'node:fs';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
const EXACT = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
// Local specs (vendored tarball / linked checkout) have no registry entry to
// age-check. `@rave-page/ui` is a `file:` tarball whose provenance +
// transitive exact pins live in vendor/PROVENANCE.md + SUPPLY_CHAIN.md; its
// deps are still age-gated transitively by pnpm minimumReleaseAge at resolve.
const LOCAL = /^(file:|link:)/;
const encode = (n) => (n.startsWith('@') ? `@${encodeURIComponent(n.slice(1))}` : n);

const rows = [];
const skipped = [];
let failed = false;

for (const [name, version] of Object.entries(deps).sort((a, b) => a[0].localeCompare(b[0]))) {
  let status = 'OK';
  let published = '-';
  let ageDays = '-';
  if (LOCAL.test(version)) {
    status = 'SKIP:local';
    skipped.push({name, version});
    rows.push({name, version, published, ageDays, status});
    continue;
  }
  if (!EXACT.test(version)) {
    status = 'FAIL:range';
    failed = true;
  } else {
    try {
      const res = await fetch(`https://registry.npmjs.org/${encode(name)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const meta = await res.json();
      const t = meta.time?.[version];
      if (!t) {
        status = 'FAIL:missing';
        failed = true;
      } else {
        published = t.slice(0, 10);
        const age = Date.now() - new Date(t).getTime();
        ageDays = Math.floor(age / 86400000);
        if (age < SEVEN_DAYS) {
          status = 'FAIL:<7d';
          failed = true;
        }
      }
    } catch (e) {
      status = `FAIL:${e.message}`;
      failed = true;
    }
  }
  rows.push({ name, version, published, ageDays, status });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad('name', 32)} ${pad('version', 12)} ${pad('published', 12)} ${pad('age days', 9)} status`);
console.log('-'.repeat(78));
for (const r of rows) {
  console.log(`${pad(r.name, 32)} ${pad(r.version, 12)} ${pad(r.published, 12)} ${pad(r.ageDays, 9)} ${r.status}`);
}

console.log('\nSUPPLY_CHAIN.md rows (paste-ready):');
for (const r of rows) console.log(`| ${r.name} | ${r.version} | | released ${r.published} |`);

if (skipped.length) {
  console.log('\nSkipped (local specs, not registry-aged; provenance in vendor/PROVENANCE.md + SUPPLY_CHAIN.md):');
  for (const s of skipped) console.log(`  - ${s.name} (${s.version})`);
}

process.exit(failed ? 1 : 0);
