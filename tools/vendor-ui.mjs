// Vendor the @rave-page/ui design-system kit as a local tarball under vendor/.
//
// Why a tarball (not link:/workspace:)? event-bridge is a standalone public
// repo; outside contributors cloning it have no sibling rave.page checkout. A
// committed tarball makes `pnpm install` self-contained. Switch to the npm
// version once the kit is published (plan P8).
//
// Usage:  node tools/vendor-ui.mjs [kitDir]
//   kitDir precedence: argv[2] > $EVENT_BRIDGE_UI_KIT_DIR > ../rave.page/packages/ui
//   (today the kit lives on a worktree; pass its path explicitly, e.g.
//    node tools/vendor-ui.mjs ../rave.page-wt-uikit/packages/ui)
//
// Steps: assert kit identity -> `pnpm --dir <kit> build` (tsc -> dist/) ->
// `pnpm --dir <kit> pack` into vendor/ -> drop stale tgz -> verify the packed
// `.` export resolves to dist/ (event-bridge's tsconfig is stricter than the
// kit's, so we consume the compiled .js/.d.ts, never the kit TS sources) ->
// write vendor/PROVENANCE.md -> sync the package.json spec.
//
// PROBED 2026-09-03 (pnpm 10.x): `pnpm pack` DOES apply publishConfig.exports,
// so the packed `.` export already points at ./dist. The rewrite branch below
// is a safety net for a future pnpm that stops doing so.
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync, gzipSync} from 'node:zlib';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const vendorDir = join(repoRoot, 'vendor');
const pkgPath = join(repoRoot, 'package.json');

const kitDir = resolve(
  repoRoot,
  process.argv[2] ?? process.env.EVENT_BRIDGE_UI_KIT_DIR ?? '../rave.page/packages/ui',
);

const die = (msg) => {
  console.error(`vendor-ui: ${msg}`);
  process.exit(1);
};
const pnpm = (args) => execFileSync('pnpm', args, {stdio: 'inherit'});
const gitCap = (args) => execFileSync('git', ['-C', kitDir, ...args], {encoding: 'utf8'}).trim();

// 1. identity
const kitPkgPath = join(kitDir, 'package.json');
if (!existsSync(kitPkgPath)) die(`kit package.json not found at ${kitPkgPath}`);
const kitPkg = JSON.parse(readFileSync(kitPkgPath, 'utf8'));
if (kitPkg.name !== '@rave-page/ui') die(`expected kit name @rave-page/ui, got ${kitPkg.name}`);
const version = kitPkg.version;
const tgzName = `rave-page-ui-${version}.tgz`;
const tgzPath = join(vendorDir, tgzName);

mkdirSync(vendorDir, {recursive: true});

// 2. build + 3. pack (argv arrays, no shell strings)
console.log(`vendor-ui: building ${kitPkg.name}@${version} in ${kitDir}`);
pnpm(['--dir', kitDir, 'build']);

// drop ALL stale tarballs first so the dir holds exactly one tgz after pack
for (const f of readdirSync(vendorDir)) {
  if (/^rave-page-ui-.*\.tgz$/.test(f)) unlinkSync(join(vendorDir, f));
}
console.log(`vendor-ui: packing into ${vendorDir}`);
pnpm(['--dir', kitDir, 'pack', '--pack-destination', vendorDir]);
if (!existsSync(tgzPath)) die(`expected ${tgzName} in vendor/ after pack`);

// ── minimal, cross-platform tar helpers (avoid shelling to a `tar` that
//    mis-parses Windows `C:\` paths as remote hosts) ────────────────────
const octal = (n, len) => `${n.toString(8).padStart(len - 1, '0')}\0`;
// Parse a ustar buffer into regular-file entries {name, content}.
function readTar(buf) {
  const out = [];
  for (let off = 0; off + 512 <= buf.length;) {
    const h = buf.subarray(off, off + 512);
    if (h.every((b) => b === 0)) break;
    const name = h.subarray(0, 100).toString('utf8').replace(/\0.*$/s, '');
    const size = parseInt(h.subarray(124, 136).toString('ascii').replace(/[\0 ]/g, '') || '0', 8);
    const type = String.fromCharCode(h[156] || 0x30);
    const start = off + 512;
    if (type === '0' || type === '\0') out.push({name, content: Buffer.from(buf.subarray(start, start + size))});
    off = start + Math.ceil(size / 512) * 512;
  }
  return out;
}
// Emit a fresh ustar header + build a gzipped tarball (regular files only;
// fresh headers sidestep pax/global entries entirely).
function tarHeader(name, size) {
  const h = Buffer.alloc(512);
  h.write(name.slice(0, 100), 0, 'utf8');
  h.write(octal(0o644, 8), 100, 'ascii');
  h.write(octal(0, 8), 108, 'ascii');
  h.write(octal(0, 8), 116, 'ascii');
  h.write(octal(size, 12), 124, 'ascii');
  h.write(octal(Math.floor(Date.now() / 1000), 12), 136, 'ascii');
  h.write('        ', 148, 'ascii');
  h.write('0', 156, 'ascii');
  h.write('ustar\0', 257, 'ascii');
  h.write('00', 263, 'ascii');
  let sum = 0;
  for (let i = 0; i < 512; i++) sum += h[i];
  h.write(sum.toString(8).padStart(6, '0'), 148, 'ascii');
  h[154] = 0;
  h[155] = 0x20;
  return h;
}
function writeTgz(entries) {
  const chunks = [];
  for (const e of entries) {
    chunks.push(tarHeader(e.name, e.content.length), e.content);
    const pad = (512 - (e.content.length % 512)) % 512;
    if (pad) chunks.push(Buffer.alloc(pad));
  }
  chunks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(chunks));
}

// 4. verify the packed `.` export points at dist (rewrite if a future pnpm regresses)
const entries = readTar(gunzipSync(readFileSync(tgzPath)));
const pjEntry = entries.find((e) => e.name === 'package/package.json');
if (!pjEntry) die('packed tarball has no package/package.json');
const packed = JSON.parse(pjEntry.content.toString('utf8'));
const dot = packed.exports?.['.'];
const def = typeof dot === 'string' ? dot : dot?.default;
if (typeof def === 'string' && def.includes('dist/')) {
  console.log(`vendor-ui: OK - packed "." export -> ${def} (publishConfig applied by pnpm pack)`);
} else {
  console.warn(`vendor-ui: packed "." export is ${JSON.stringify(dot)} (not dist) - rewriting to compiled paths`);
  packed.exports = {...(packed.exports ?? {}), '.': {types: './dist/index.d.ts', default: './dist/index.js'}};
  delete packed.publishConfig;
  pjEntry.content = Buffer.from(`${JSON.stringify(packed, null, 2)}\n`, 'utf8');
  unlinkSync(tgzPath);
  writeFileSync(tgzPath, writeTgz(entries));
  console.log('vendor-ui: rewrote packed package.json "." export -> ./dist/index.js + ./dist/index.d.ts');
}

// 5. provenance
const sha256 = createHash('sha256').update(readFileSync(tgzPath)).digest('hex');
const commit = gitCap(['rev-parse', 'HEAD']);
const branch = gitCap(['rev-parse', '--abbrev-ref', 'HEAD']);
const utc = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const provenance = `# vendor/ provenance - @rave-page/ui

Vendored tarball of the rave.page design-system kit \`@rave-page/ui\`. Committed
so \`pnpm install\` is self-contained for outside contributors (no sibling
rave.page checkout needed). Interim until the kit ships on npm (plan P8).

| Field | Value |
|---|---|
| Package | \`@rave-page/ui@${version}\` |
| Tarball | \`vendor/${tgzName}\` |
| sha256 | \`${sha256}\` |
| Kit commit | \`${commit}\` |
| Kit branch | \`${branch}\` |
| Vendored (UTC) | ${utc} |

The packed tarball ships \`dist/\` (compiled ESM + \`.d.ts\`), \`src/\` (Tailwind
scans it via \`@source\`), \`src/styles/{tokens,font}.css\`, \`fonts/\` (Orbitron +
OFL), and \`LICENSE\` (MIT). event-bridge consumes the compiled \`.\` export
(\`dist/index.js\` / \`dist/index.d.ts\`) - not the kit TS sources, whose tsconfig
is looser than ours.

## Refresh

\`\`\`sh
pnpm vendor:ui                                     # default kit: ../rave.page/packages/ui
pnpm vendor:ui ../rave.page-wt-uikit/packages/ui   # or a worktree/explicit path
# then, if the spec/tarball changed:
pnpm install
\`\`\`

Re-vendoring the SAME version replaces the tarball in place; if node_modules
still holds the old copy, \`pnpm install --force\`. Never hand-edit files under
\`vendor/\`; re-run \`pnpm vendor:ui\`. Never edit the kit worktree from this repo.
`;
writeFileSync(join(vendorDir, 'PROVENANCE.md'), provenance);
console.log(`vendor-ui: wrote vendor/PROVENANCE.md (sha256 ${sha256.slice(0, 12)})`);

// 6. sync package.json spec
const spec = `file:vendor/${tgzName}`;
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.dependencies ??= {};
const current = pkg.dependencies['@rave-page/ui'];
if (current !== spec) {
  pkg.dependencies['@rave-page/ui'] = spec;
  pkg.dependencies = Object.fromEntries(Object.entries(pkg.dependencies).sort((a, b) => a[0].localeCompare(b[0])));
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`vendor-ui: package.json "@rave-page/ui" -> ${spec}`);
  console.log('vendor-ui: spec changed - run `pnpm install`');
} else {
  console.log(`vendor-ui: package.json "@rave-page/ui" already ${spec}`);
  console.log('vendor-ui: tarball content refreshed - run `pnpm install --force` if node_modules is stale');
}
