// Package the built extension into store-ready zips under web-ext-artifacts/
// (git-ignored). Zero runtime deps:
//   - Chrome: a minimal Node ZIP writer (STORE method, no compression) of
//     dist/chrome — the folder a user unzips + "Load unpacked"s.
//   - Firefox: `pnpm dlx web-ext@10.6.0 build` (pinned, on-demand — never a dep),
//     so the artefact matches exactly what AMO would sign.
// Version is single-sourced from package.json. Requires `pnpm build` first.
import { execFileSync, execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const version = pkg.version;
// Version flows into a shell command + filenames below; refuse anything that
// isn't a plain semver so no metacharacters can reach the shell.
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version ?? '')) {
  console.error(`package: refusing to package a non-semver version: ${JSON.stringify(version)}`);
  process.exit(1);
}
const outDir = join(root, 'web-ext-artifacts');
mkdirSync(outDir, { recursive: true });

for (const target of ['chrome', 'firefox']) {
  if (!existsSync(join(root, 'dist', target, 'manifest.json'))) {
    console.error(`package: dist/${target} is missing — run \`pnpm build\` first`);
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(join(root, 'dist', target, 'manifest.json'), 'utf8'));
  if (manifest.version !== version) throw new Error(`package: stale dist/${target}; rebuild for ${version}`);
}

// ---- minimal STORE-only ZIP writer (Node built-ins only) ----

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

// Fixed DOS timestamp (1980-01-01) so the zip is reproducible.
const DOS_TIME = 0;
const DOS_DATE = 0x0021;

function zipStore(sourceDir, zipPath, paths = walk(sourceDir)) {
  const files = paths.sort(); // stable entry order
  const locals = [];
  const central = [];
  let offset = 0;

  for (const full of files) {
    const name = relative(sourceDir, full).split('\\').join('/'); // ZIP uses '/'
    const nameBytes = Buffer.from(name, 'utf8');
    const data = readFileSync(full);
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // local file header sig
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(0, 8); // method: store
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18); // compressed size
    local.writeUInt32LE(data.length, 22); // uncompressed size
    local.writeUInt16LE(nameBytes.length, 26);
    local.writeUInt16LE(0, 28); // extra length
    locals.push(local, nameBytes, data);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0); // central dir header sig
    cd.writeUInt16LE(20, 4); // version made by
    cd.writeUInt16LE(20, 6); // version needed
    cd.writeUInt16LE(0, 8); // flags
    cd.writeUInt16LE(0, 10); // method: store
    cd.writeUInt16LE(DOS_TIME, 12);
    cd.writeUInt16LE(DOS_DATE, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(data.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBytes.length, 28);
    cd.writeUInt16LE(0, 30); // extra len
    cd.writeUInt16LE(0, 32); // comment len
    cd.writeUInt16LE(0, 34); // disk number start
    cd.writeUInt16LE(0, 36); // internal attrs
    cd.writeUInt32LE(0, 38); // external attrs
    cd.writeUInt32LE(offset, 42); // local header offset
    central.push(cd, nameBytes);

    offset += local.length + nameBytes.length + data.length;
  }

  const centralBuf = Buffer.concat(central);
  const localBuf = Buffer.concat(locals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // end of central dir sig
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // disk with CD
  eocd.writeUInt16LE(files.length, 8); // entries this disk
  eocd.writeUInt16LE(files.length, 10); // total entries
  eocd.writeUInt32LE(centralBuf.length, 12); // CD size
  eocd.writeUInt32LE(localBuf.length, 16); // CD offset
  eocd.writeUInt16LE(0, 20); // comment len

  writeFileSync(zipPath, Buffer.concat([localBuf, centralBuf, eocd]));
}

const chromeZip = join(outDir, `event-bridge-chrome-${version}.zip`);
zipStore(join(root, 'dist', 'chrome'), chromeZip);

// ---- Firefox via pinned web-ext (matches the AMO-signed artefact) ----
// Shell invocation so the pnpm launcher resolves on every OS (Windows `.cmd`).
// The filename is version-derived and space-free, so no quoting hazard.
const firefoxName = `event-bridge-firefox-${version}.zip`;
execSync(
  `pnpm dlx web-ext@10.6.0 build --source-dir dist/firefox --artifacts-dir web-ext-artifacts --overwrite-dest --filename ${firefoxName}`,
  { stdio: 'inherit' },
);
const firefoxZip = join(outDir, firefoxName);

// Only tracked source; the CI-stamped package.json matches the browser zips.
// Includes the in-repo kit source (packages/ui), lockfile and build instructions.
const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
if (tracked.some((path) => /(^|\/)(?:\.env(?:\.|$)|\.devnotes\/|\.profile\/|CLAUDE\.local\.md$)|\.(?:har|log)$/.test(path))) {
  throw new Error('package: private files must not be tracked');
}
const sourceZip = join(outDir, `event-bridge-source-${version}.zip`);
zipStore(root, sourceZip, tracked.map((path) => join(root, path)));
const archives = [chromeZip, firefoxZip, sourceZip];
const checksums = archives.map((path) =>
  `${createHash('sha256').update(readFileSync(path)).digest('hex')}  ${relative(outDir, path)}`).join('\n');
writeFileSync(join(outDir, 'SHA256SUMS'), `${checksums}\n`);

const kb = (p) => `${(statSync(p).size / 1024).toFixed(1)} KiB`;
console.log('\npackaged:');
console.log(`  ${relative(root, chromeZip).split('\\').join('/')}  (${kb(chromeZip)})`);
console.log(`  ${relative(root, firefoxZip).split('\\').join('/')}  (${kb(firefoxZip)})`);
console.log(`  ${relative(root, sourceZip).split('\\').join('/')}  (${kb(sourceZip)})`);
