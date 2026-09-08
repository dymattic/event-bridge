// @vitest-environment node
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, expect, test } from 'vitest';

const script = resolve('tools/prepare-release.mjs');
const directories: string[] = [];
afterEach(() => {
  for (const dir of directories.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), 'eb-release-test-'));
  directories.push(cwd);
  const env = { ...process.env, GIT_CONFIG_GLOBAL: join(cwd, 'no-global-config') };
  const git = (...args: string[]) => execFileSync('git', args, { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-b', 'master');
  git('config', 'user.name', 'Release test');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  writeFileSync(join(cwd, 'package.json'), '{"name":"fixture","version":"0.2.0"}\n');
  git('add', 'package.json');
  git('commit', '-m', 'base');
  git('tag', 'v0.2.0');
  const commit = () => git('commit', '--allow-empty', '-m', 'change');
  const run = (...args: string[]) => spawnSync(process.execPath, [script, ...args], { cwd, env, encoding: 'utf8' });
  return { cwd, git, commit, run };
}

test('refuses to re-release the base or a checkout missing the base tag', () => {
  const f = fixture();
  expect(f.run().status).not.toBe(0);
  f.git('tag', '-d', 'v0.2.0');
  f.commit();
  expect(f.run().status).not.toBe(0);
});

test('each master commit gets a distinct increasing version independent of CI completion order', () => {
  const f = fixture();
  f.commit();
  const first = f.git('rev-parse', 'HEAD');
  f.commit();
  expect(f.run().stdout.trim()).toBe('0.2.2');
  f.git('checkout', first);
  expect(f.run().stdout.trim()).toBe('0.2.1');
});

test('stamping is idempotent, including retries after package.json was stamped', () => {
  const f = fixture();
  f.commit();
  expect(f.run('--write').status).toBe(0);
  expect(f.run('--write').stdout.trim()).toBe('0.2.1');
  expect(JSON.parse(readFileSync(join(f.cwd, 'package.json'), 'utf8'))).toEqual({ name: 'fixture', version: '0.2.1' });
});

test('a merged feature branch advances the version once at its master merge', () => {
  const f = fixture();
  f.git('checkout', '-b', 'feature');
  f.commit();
  f.commit();
  f.git('checkout', 'master');
  f.git('merge', '--no-ff', 'feature', '-m', 'merge feature');
  expect(f.run().stdout.trim()).toBe('0.2.1');
});
