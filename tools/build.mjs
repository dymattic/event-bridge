// esbuild: 4 IIFE bundles for the extension contexts + Tailwind CSS pipeline.
// Hard-fails on any error. React 19 needs process.env.NODE_ENV defined at bundle time.
import { build, context } from 'esbuild';
import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

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
const inputs = [...sourceFiles('src'), ...sourceFiles('manifest'), ...sourceFiles('vendor'),
  'package.json', 'pnpm-lock.yaml', 'tools/build.mjs'];
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
  target: ['chrome121', 'firefox140'],
  jsx: 'automatic',
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  sourcemap: watch,
  minify: false,
  legalComments: 'none',
  logLevel: 'info',
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
  } catch {
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
