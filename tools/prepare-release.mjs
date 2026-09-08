// A commit's version stays stable across retries and out-of-order CI runs.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const base = 'v0.2.0';
git('merge-base', '--is-ancestor', base, 'HEAD');
const baseVersion = JSON.parse(git('show', `${base}:package.json`)).version;
if (!/^\d+\.\d+\.\d+$/.test(baseVersion)) throw new Error('Release base must be a numeric version');
const parts = baseVersion.split('.').map(Number);
const distance = Number(git('rev-list', '--count', '--first-parent', `${base}..HEAD`));
if (!Number.isSafeInteger(distance) || distance < 1) throw new Error('No new commit to release');
parts[2] += distance;
if (parts.some((part) => part > 65535)) throw new Error('Release version exceeds browser limits');
const version = parts.join('.');
if (process.argv.includes('--write')) {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  pkg.version = version;
  writeFileSync('package.json', `${JSON.stringify(pkg, null, 2)}\n`);
}
console.log(version);
