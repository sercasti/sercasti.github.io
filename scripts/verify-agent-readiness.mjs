#!/usr/bin/env node
/**
 * Verifies the agent-readiness fixes against a running instance of the site
 * (defaults to a local static server serving ./dist; pass a URL to check
 * the deployed site instead, e.g. `node scripts/verify-agent-readiness.mjs
 * https://sercasti.github.io`).
 *
 * GitHub Pages specifics this script assumes when testing locally:
 * - a request for `/foo` where `foo/index.html` exists resolves that file
 *   directly (no redirect)
 * - any path that resolves to nothing gets `404.html` with a real 404 status
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

const EXT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

async function resolveFile(urlPath) {
  const clean = urlPath.split('?')[0];
  const candidates = clean.endsWith('/')
    ? [path.join(distDir, clean, 'index.html')]
    : [path.join(distDir, clean), path.join(distDir, clean, 'index.html')];
  for (const candidate of candidates) {
    try {
      const s = await stat(candidate);
      if (s.isFile()) return candidate;
    } catch {
      // keep trying
    }
  }
  return null;
}

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const file = await resolveFile(decodeURIComponent(req.url ?? '/'));
      if (!file) {
        const notFound = path.join(distDir, '404.html');
        const body = await readFile(notFound);
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(body);
        return;
      }
      const body = await readFile(file);
      const ext = path.extname(file);
      res.writeHead(200, { 'Content-Type': EXT_TYPES[ext] ?? 'application/octet-stream' });
      res.end(body);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

async function main() {
  let server;
  let base = process.argv[2];
  if (!base) {
    server = await startServer();
    const { port } = server.address();
    base = `http://127.0.0.1:${port}`;
  }

  // 1. Agent-friendly 404s
  const notFoundRes = await fetch(`${base}/this-page-does-not-exist-xyz123`);
  const notFoundBody = await notFoundRes.text();
  check('404 status on nonexistent path', notFoundRes.status === 404, `status=${notFoundRes.status}`);
  const notFoundText = stripTags(notFoundBody);
  const hasRecoveryLinks = ['/about/', '/contact/', 'sitemap-index.xml', 'llms.txt'].every((s) =>
    notFoundBody.includes(s),
  );
  check('404 body has recovery links', hasRecoveryLinks, notFoundText.slice(0, 80));

  // 2. Markdown twins + alternate discovery
  for (const p of ['/index.md', '/about.md', '/contact.md', '/privacy.md', '/work.md', '/posts.md']) {
    const r = await fetch(`${base}${p}`);
    const body = await r.text();
    check(`markdown twin ${p} returns 200 markdown`, r.status === 200 && body.startsWith('#'), `status=${r.status}`);
  }
  const homeRes = await fetch(`${base}/`);
  const homeBody = await homeRes.text();
  check(
    'homepage links to its Markdown twin',
    homeBody.includes('rel="alternate"') && homeBody.includes('type="text/markdown"'),
  );

  // 3. Brand / entity structured data
  const ldJsonMatches = [...homeBody.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  let personOk = false;
  for (const m of ldJsonMatches) {
    try {
      const data = JSON.parse(m[1]);
      if (data['@type'] === 'Person' && data.name === 'Sergio Castiñeyras' && Array.isArray(data.sameAs) && data.sameAs.length >= 3) {
        personOk = true;
      }
    } catch {
      // ignore
    }
  }
  check('valid Person JSON-LD with brand name + sameAs', personOk);
  check('single <h1> on homepage (no duplicate brand heading)', (homeBody.match(/<h1/g) ?? []).length === 1);

  // 4. Agent instruction / when-to-use
  const llmsRes = await fetch(`${base}/llms.txt`);
  const llmsBody = await llmsRes.text();
  check(
    'llms.txt has a When to use section',
    llmsRes.status === 200 && /##\s*When to use this/i.test(llmsBody),
  );

  // 5. Trust anchor pages
  for (const p of ['/about/', '/contact/', '/privacy/']) {
    const r = await fetch(`${base}${p}`);
    const body = await r.text();
    const text = stripTags(body);
    check(`${p} returns 200 with >=500 chars of content`, r.status === 200 && text.length >= 500, `chars=${text.length}`);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
  server?.close();
}

main();
