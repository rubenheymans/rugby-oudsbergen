import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { page, url } from './src/layout.mjs';
import { pages, redirects } from './src/pages.mjs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
cpSync('assets', 'dist/assets', { recursive: true });

for (const p of pages) {
  const file = p.path.endsWith('.html') ? `dist/${p.path}` : `dist/${p.path}index.html`;
  mkdirSync(file.slice(0, file.lastIndexOf('/')), { recursive: true });
  writeFileSync(file, page(p));
}

for (const [from, to] of Object.entries(redirects)) {
  mkdirSync(`dist/${from}`, { recursive: true });
  writeFileSync(`dist/${from}index.html`, `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${url(to)}"><link rel="canonical" href="${url(to)}"><a href="${url(to)}">Verder</a>`);
}

writeFileSync('dist/.nojekyll', '');
execSync('npx @tailwindcss/cli -i src/styles.css -o dist/styles.css --minify', { stdio: 'inherit' });
console.log(`Built ${pages.length} pages + ${Object.keys(redirects).length} redirects`);
