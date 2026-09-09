// esbuild: 4 IIFE bundles for the extension contexts + Tailwind CSS pipeline.
// Hard-fails on any error. React 19 needs process.env.NODE_ENV defined at bundle time.
import { build, context } from 'esbuild';
import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve, sep } from 'node:path';

const require = createRequire(import.meta.url);
const watch = process.argv.includes('--watch');
function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = `${dir}/${entry.name}`;
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}
// Reproducible from the AMO source archive, including without a Git checkout.
// Normalize source line endings so Windows and Linux produce the same ID.
const fingerprint = createHash('sha256');
const inputs = [...sourceFiles('src'), ...sourceFiles('manifest'),
  ...sourceFiles('packages/ui/src'), 'packages/ui/package.json',
  'packages/ui/tsconfig.json', 'packages/ui/tsconfig.build.json',
  ...sourceFiles('licenses'),
  'LICENSE', 'package.json', 'pnpm-lock.yaml', 'tools/build.mjs'];
for (const path of inputs.sort()) {
  const bytes = readFileSync(path);
  fingerprint.update(path).update('\0').update(/\.(?:tsx?|json|css|md|mjs|yaml|html|txt|svg)$/.test(path)
    ? bytes.toString('utf8').replace(/\r\n/g, '\n') : bytes).update('\0');
}
const buildId = watch
  ? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  : fingerprint.digest('hex').slice(0, 16);

// Resolve the @tailwindcss/cli bin (no shell, argv array only).
const twPkgPath = require.resolve('@tailwindcss/cli/package.json');
const twPkg = JSON.parse(readFileSync(twPkgPath, 'utf8'));
const twBin = resolve(dirname(twPkgPath), typeof twPkg.bin === 'string' ? twPkg.bin : twPkg.bin.tailwindcss);
const twArgs = [twBin, '-i', 'src/ui/styles.css', '-o', 'build/styles.css'];

// Build the first-party design-system kit from its in-repo source (packages/ui)
// to its own dist/ under its own tsconfig, then bundle that compiled output. The
// kit source is the reviewable truth; dist is a reproducible build artifact
// (git-ignored). Consuming compiled .js/.d.ts keeps the kit's looser tsconfig
// separate from this repo's stricter one (see docs/development.md).
function buildKit() {
  const tsc = require.resolve('typescript/bin/tsc');
  execFileSync(process.execPath, [tsc, '-p', 'packages/ui/tsconfig.build.json'], { stdio: 'inherit' });
  console.log('kit: built @rave-page/ui from packages/ui/src');
}
buildKit();

function generateNotices(metafile) {
  const packages = new Map();
  for (const input of Object.keys(metafile.inputs)) {
    const absolute = resolve(input);
    if (!absolute.split(sep).includes('node_modules')) continue;
    let found = false;
    for (let dir = dirname(absolute); dir !== dirname(dir); dir = dirname(dir)) {
      const file = join(dir, 'package.json');
      if (!existsSync(file)) continue;
      const pkg = JSON.parse(readFileSync(file, 'utf8'));
      if (!pkg.name || !pkg.version) continue;
      // @rave-page/ui is first-party in-repo source (packages/ui, MIT LICENSE
      // shipped there), not a third-party dependency — its own deps below still
      // get notices.
      if (pkg.name === '@rave-page/ui') { found = true; break; }
      packages.set(realpathSync(dir), { name: pkg.name, version: pkg.version });
      found = true;
      break;
    }
    if (!found) throw new Error('Cannot identify a bundled dependency for license notices');
  }
  const notices = [...packages].map(([dir, pkg]) => {
    const license = readdirSync(dir).sort().find((name) => /^licen[sc]e(?:\.md|\.txt)?$/i.test(name));
    const supplement = pkg.name === 'react-remove-scroll-bar' && pkg.version === '2.3.8'
      ? 'licenses/react-remove-scroll-bar-2.3.8.txt' : undefined;
    const file = license ? join(dir, license) : supplement;
    if (!file) throw new Error(`Missing license for ${pkg.name}@${pkg.version}`);
    return { name: `${pkg.name}@${pkg.version}`, text: readFileSync(file, 'utf8').replace(/\r\n/g, '\n') };
  });
  notices.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  writeFileSync('build/THIRD_PARTY_NOTICES.txt', notices.map((n) => `${n.name}\n${n.text.trimEnd()}\n`).join('\n'));
}

const options = {
  entryPoints: {
    background: 'src/background/main.ts',
    agent: 'src/agent/main.ts',
    popup: 'src/ui/popup/main.tsx',
    dashboard: 'src/ui/dashboard/main.tsx',
  },
  outdir: 'build',
  bundle: true,
  format: 'iife',
  target: ['chrome121', 'firefox142'],
  jsx: 'automatic',
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  sourcemap: watch,
  minify: false,
  legalComments: 'none',
  logLevel: 'info',
  metafile: true,
  plugins: [{
    name: 'third-party-notices',
    setup(builder) {
      builder.onEnd((result) => {
        if (!result.errors.length && result.metafile) generateNotices(result.metafile);
      });
    },
  }],
};

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  const tw = spawn(process.execPath, [...twArgs, '--watch'], { stdio: 'inherit' });
  tw.on('exit', (code) => {
    if (code) process.exitCode = code;
  });
  console.log(`esbuild + tailwind watching (build ${buildId})`);
} else {
  try {
    await build(options);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  try {
    execFileSync(process.execPath, [...twArgs, '--minify'], { stdio: 'inherit' });
  } catch {
    console.error('tailwind build failed');
    process.exit(1);
  }
  console.log(`build ${buildId} ok`);
}
