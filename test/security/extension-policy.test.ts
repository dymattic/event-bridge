// @vitest-environment node
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { expect, test } from 'vitest';

function staticName(node: ts.Node): string | undefined {
  if (ts.isIdentifier(node) || ts.isStringLiteralLike(node)) return node.text;
  if (ts.isComputedPropertyName(node)) return staticName(node.expression);
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = staticName(node.left);
    const right = staticName(node.right);
    if (left !== undefined && right !== undefined) return left + right;
  }
  return undefined;
}

function member(node: ts.Node): string | undefined {
  if (ts.isPropertyAccessExpression(node)) return node.name.text;
  if (ts.isElementAccessExpression(node)) return staticName(node.argumentExpression);
  return undefined;
}

function unsafeHtml(source: string, file = 'fixture.tsx'): string[] {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const violations: string[] = [];
  const report = (node: ts.Node, message: string) => {
    const { line } = tree.getLineAndCharacterOfPosition(node.getStart(tree));
    violations.push(`${file}:${line + 1}: ${message}`);
  };
  function visit(node: ts.Node): void {
    if ((ts.isJsxAttribute(node) || ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node))
      && staticName(node.name) === 'dangerouslySetInnerHTML') {
      report(node, 'raw HTML props are forbidden');
    }
    if (ts.isBinaryExpression(node)
      && node.operatorToken.kind >= ts.SyntaxKind.FirstAssignment
      && node.operatorToken.kind <= ts.SyntaxKind.LastAssignment
      && ['innerHTML', 'outerHTML', 'dangerouslySetInnerHTML'].includes(member(node.left) ?? '')) {
      report(node, 'HTML assignment is forbidden');
    }
    if (ts.isCallExpression(node)) {
      const name = member(node.expression);
      if (name === 'insertAdjacentHTML') report(node, 'HTML insertion is forbidden');
      if ((name === 'write' || name === 'writeln')
        && (ts.isPropertyAccessExpression(node.expression) || ts.isElementAccessExpression(node.expression))
        && staticName(node.expression.expression) === 'document') {
        report(node, 'document HTML writing is forbidden');
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return violations;
}

test.each([
  'element.innerHTML = input;',
  'element.outerHTML += input;',
  'element["inner" + "HTML"] = input;',
  'element.insertAdjacentHTML("beforeend", input);',
  'document.write(input);',
  'document["writeln"](input);',
  'const view = <div dangerouslySetInnerHTML={{ __html: input }} />;',
  'const props = { dangerouslySetInnerHTML: { __html: input } };',
  'const props = { dangerouslySetInnerHTML };',
])('rejects unsafe HTML use: %s', (source) => {
  expect(unsafeHtml(source)).not.toHaveLength(0);
});

test('allows escaped rendering, textContent and detached/read-only extraction', () => {
  expect(unsafeHtml(`
    const view = <p>{input}</p>;
    element.textContent = input;
    const html = document.documentElement.outerHTML;
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const label = 'innerHTML = not code'; // element.innerHTML = input;
  `)).toEqual([]);
});

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name) ? [path] : [];
  });
}

test('application and vendored kit do not invoke raw HTML rendering APIs', () => {
  const files = [...sourceFiles('src'), ...sourceFiles('packages/ui/src')];
  expect(files.length).toBeGreaterThan(100);
  expect(files.flatMap((file) => unsafeHtml(readFileSync(file, 'utf8'), file))).toEqual([]);
});

test('documented React warning provenance remains the unmodified official release', () => {
  const pkg = JSON.parse(readFileSync('node_modules/react-dom/package.json', 'utf8')) as { version: string };
  expect(pkg.version).toBe('19.2.8');
  const source = readFileSync('node_modules/react-dom/cjs/react-dom-client.production.js');
  expect(createHash('sha256').update(source).digest('hex'))
    .toBe('6cf4932e0c20a4572ae395035ca2e512a42d7d49c1a659fa73d6197069c28df0');
});

test('Firefox version floor covers data-collection compatibility without enabling Android', () => {
  const manifest = JSON.parse(readFileSync('manifest/firefox.json', 'utf8')) as {
    browser_specific_settings: { gecko: { strict_min_version: string }; gecko_android?: unknown };
  };
  expect(Number.parseInt(manifest.browser_specific_settings.gecko.strict_min_version, 10)).toBeGreaterThanOrEqual(142);
  expect(manifest.browser_specific_settings.gecko_android).toBeUndefined();
});

test('Firefox declares authenticated event transmission, not no-data or telemetry', () => {
  const manifest = JSON.parse(readFileSync('manifest/firefox.json', 'utf8')) as {
    browser_specific_settings: { gecko: { data_collection_permissions: { required: string[]; optional?: string[] } } };
  };
  expect(manifest.browser_specific_settings.gecko.data_collection_permissions).toEqual({
    required: ['personallyIdentifyingInfo', 'authenticationInfo', 'websiteContent'],
  });
});

test('private browsing stays disabled without additional API permissions', () => {
  const manifest = JSON.parse(readFileSync('manifest/base.json', 'utf8')) as { incognito: string; permissions: string[] };
  expect(manifest.incognito).toBe('not_allowed');
  expect(manifest.permissions).toEqual(['storage', 'scripting']);
});

test('extension CSP permits only local scripts and encrypted remote connections/images', () => {
  const manifest = JSON.parse(readFileSync('manifest/base.json', 'utf8')) as { content_security_policy: { extension_pages: string } };
  const directives = manifest.content_security_policy.extension_pages.split(';').map((d) => d.trim()).filter(Boolean);
  expect(directives).toEqual(["script-src 'self'", "object-src 'none'", "base-uri 'none'", 'connect-src https:', "img-src 'self' https: data: blob:"]);
});

test.each(['popup', 'dashboard'])('%s sends no referrer from its UI', (page) => {
  expect(readFileSync(`src/ui/${page}.html`, 'utf8')).toContain('<meta name="referrer" content="no-referrer">');
});
