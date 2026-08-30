// Builds the ghost-spec.dev static site into dist/.
//
//   node scripts/build-site.mjs
//
// The pipeline (design: docs/plans/2026-08-30-ghost-implementation-design.md):
//   1. copy site/ verbatim (the hand-written landing shell)
//   2. render spec/GHOST-v1.0.md -> /spec/           (canonical Markdown, no drift)
//   3. render docs/guide/*.md    -> /guide/<slug>/    (authored, frontmatter-ordered)
//   4. generate /conformance/  from conformance/requirements.json
//   5. generate /schema/       from schema/v1/*.schema.json
//   6. generate /skills/ and /skills/<name>/ from skills/*/SKILL.md
//   7. emit dist/nav.json, the navigation manifest the pages were built from
// Generated pages come from machine sources so they cannot drift from them; the
// gate runs this build, so a source change that breaks a page is a red gate.
//
// Copyright 2026 d7r LLC

import { readFile, writeFile, mkdir, cp, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC = resolve(root, 'spec/GHOST-v1.0.md');
const SITE = resolve(root, 'site');
const DIST = resolve(root, 'dist');

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Collected while rendering, so tables of contents match the real headings. */
const toc = [];

const renderer = new marked.Renderer();
renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const plain = text.replace(/<[^>]+>/g, '');
  const id = slug(plain);
  if (depth === 2) toc.push({ id, text: plain });
  return `<h${depth} id="${id}">${text}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${depth}>\n`;
};

const render = (markdown) => {
  toc.length = 0;
  return marked.parse(markdown, { renderer, mangle: false, headerIds: false });
};

/** Minimal frontmatter reader: `key: value` lines between --- fences. */
const frontmatter = (text) => {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w[\w_-]*):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return { data, body: text.slice(m[0].length) };
};

const NAV = [
  { href: '/', label: 'Overview' },
  { href: '/spec/', label: 'Spec' },
  { href: '/guide/', label: 'Guide' },
  { href: '/conformance/', label: 'Conformance' },
  { href: '/schema/', label: 'Schemas' },
  { href: '/skills/', label: 'Skills' },
];

const page = ({ title, description, body, path }) => `<!doctype html>
<html lang="en" data-accent="ghost">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="https://ghost-spec.dev${path}">
<script>
  (function () {
    document.documentElement.classList.add('js');
    try {
      var t = localStorage.getItem('d7r-theme');
      if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}
  })();
</script>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/assets/d7r-os.css">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>

<div class="aurora" aria-hidden="true"></div>

<header class="masthead">
  <div class="masthead-inner">
    <a class="logo" href="/" aria-label="ghost-spec.dev home"><span class="em">~/</span>ghost-spec<span class="em">.dev</span><span class="cursor" aria-hidden="true"></span></a>
    <nav aria-label="Primary">
      ${NAV.map((n) => `<a href="${n.href}"${n.href === path ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n      ')}
      <a class="btn btn-primary btn-sm" href="https://github.com/d7r-LLC/ghost-spec">GitHub</a>
      <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle color theme">
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      </button>
    </nav>
  </div>
</header>

<main class="page-single prose">
${body}
</main>

<footer class="colophon">
  <div class="wrap cols">
    <div><p>GHOST v1.0, draft &middot; CC BY 4.0 &middot; part of <a href="https://d7r.io">d7r Open Source</a>.</p></div>
    <div><p><a href="https://github.com/d7r-LLC/ghost-spec">GitHub</a> &middot; <a href="mailto:hello@d7r.io">hello@d7r.io</a></p></div>
  </div>
</footer>

<script>
(function () {
  var t = document.getElementById('theme-toggle');
  if (t) t.addEventListener('click', function () {
    var root = document.documentElement;
    var cur = root.getAttribute('data-theme');
    if (!cur) cur = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('d7r-theme', next); } catch (e) {}
  });
})();
</script>

</body>
</html>
`;

const write = async (path, html) => {
  const out = resolve(DIST, `.${path}`, 'index.html');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
};

const built = [];
const emit = async ({ path, title, description, body }) => {
  await write(path, page({ title, description, body, path }));
  built.push({ path, title, description });
};

// ---- 2. the spec ----------------------------------------------------------
const buildSpec = async () => {
  let html = render(await readFile(SPEC, 'utf8'));
  html = html.replace(
    /<p>(<strong>Status:<\/strong>[\s\S]*?)<\/p>/,
    (_, fields) => `<div class="meta"><p>${fields.trim().replace(/\n/g, '<br>\n')}</p></div>`
  );
  const tocHtml = [
    '<nav class="toc">', '<h2>Contents</h2>', '<ol>',
    ...toc.map(({ id, text }) => `<li><a href="#${id}">${escapeHtml(text.replace(/^\d+(\.\d+)*\.?\s*/, ''))}</a></li>`),
    '</ol>', '</nav>',
  ].join('\n');
  await emit({
    path: '/spec/',
    title: 'GHOST Specification v1.0',
    description: 'GHOST v1.0: governed advisor projections. Persona classes, the honest frame, the authority ladder, certification, and fifteen named failure classes.',
    body: html.replace(/(<\/div>)/, `$1\n${tocHtml}`),
  });
};

// ---- 3. guide pages -------------------------------------------------------
const buildGuide = async () => {
  const dir = resolve(root, 'docs/guide');
  const pages = [];
  if (existsSync(dir)) {
    for (const f of (await readdir(dir)).filter((f) => f.endsWith('.md'))) {
      const { data, body } = frontmatter(await readFile(resolve(dir, f), 'utf8'));
      pages.push({ slug: basename(f, '.md'), order: Number(data.order ?? 99), title: data.title ?? basename(f, '.md'), description: data.description ?? '', body });
    }
  }
  pages.sort((a, b) => a.order - b.order);
  for (const p of pages) {
    await emit({ path: `/guide/${p.slug}/`, title: `${p.title} | GHOST`, description: p.description, body: `<h1>${escapeHtml(p.title)}</h1>\n${render(p.body)}` });
  }
  const index = ['<h1>Guide</h1>', '<ul>', ...pages.map((p) => `<li><a href="/guide/${p.slug}/">${escapeHtml(p.title)}</a>: ${escapeHtml(p.description)}</li>`), '</ul>'].join('\n');
  await emit({ path: '/guide/', title: 'Guide | GHOST', description: 'Implementer documentation for the GHOST specification.', body: index });
};

// ---- 4. conformance page (generated from the register) --------------------
const buildConformance = async () => {
  const reqs = JSON.parse(await readFile(resolve(root, 'conformance/requirements.json'), 'utf8'));
  const byLevel = {};
  for (const r of reqs) byLevel[r.level] = (byLevel[r.level] || 0) + 1;
  const rows = reqs.map((r) => `<tr><td><code>${r.id}</code></td><td>${escapeHtml(r.section)}</td><td>${r.level}</td><td>${escapeHtml(r.text)}</td><td><code>${r.status}</code></td></tr>`);
  const body = [
    '<h1>Conformance register</h1>',
    `<p>Every RFC 2119 requirement of the spec, extracted mechanically (${reqs.length} total: ${Object.entries(byLevel).map(([k, v]) => `${v} ${k}`).join(', ')}). The spec is draft; this register measures coverage and makes no claim.</p>`,
    '<div style="overflow-x:auto"><table>',
    '<thead><tr><th>Id</th><th>Section</th><th>Level</th><th>Requirement</th><th>Status</th></tr></thead>',
    `<tbody>${rows.join('\n')}</tbody>`, '</table></div>',
  ].join('\n');
  await emit({ path: '/conformance/', title: 'Conformance register | GHOST', description: `The ${reqs.length} normative requirements of GHOST v1.0, extracted from the spec text.`, body });
};

// ---- 5. schema reference (generated from the schemas) ---------------------
const buildSchemas = async () => {
  const dir = resolve(root, 'schema/v1');
  const parts = ['<h1>Schemas (v1, draft)</h1>', '<p>Draft JSON Schemas for the artifacts the spec names. Each description cites the sections it interprets; the source files are canonical.</p>'];
  for (const f of (await readdir(dir)).filter((f) => f.endsWith('.schema.json')).sort()) {
    const s = JSON.parse(await readFile(resolve(dir, f), 'utf8'));
    const req = new Set(s.required ?? []);
    parts.push(`<h2>${escapeHtml(s.title)}</h2>`, `<p>${escapeHtml(s.description ?? '')}</p>`, `<p><code>schema/v1/${f}</code></p>`);
    if (s.properties) {
      parts.push('<div style="overflow-x:auto"><table><thead><tr><th>Property</th><th>Type</th><th>Required</th><th>Notes</th></tr></thead><tbody>');
      for (const [name, def] of Object.entries(s.properties)) {
        const type = def.const ? `const ${def.const}` : def.enum ? def.enum.join(' | ') : def.type ?? '';
        parts.push(`<tr><td><code>${name}</code></td><td>${escapeHtml(String(type))}</td><td>${req.has(name) ? 'yes' : 'no'}</td><td>${escapeHtml(def.description ?? '')}</td></tr>`);
      }
      parts.push('</tbody></table></div>');
    }
  }
  await emit({ path: '/schema/', title: 'Schemas | GHOST', description: 'Draft JSON Schemas for GHOST artifacts: charter, corpus manifest, creation, reliance, and calibration records.', body: parts.join('\n') });
};

// ---- 6. skills ------------------------------------------------------------
const buildSkills = async () => {
  const dir = resolve(root, 'skills');
  const entries = [];
  for (const d of (await readdir(dir, { withFileTypes: true })).filter((e) => e.isDirectory())) {
    const file = resolve(dir, d.name, 'SKILL.md');
    if (!existsSync(file)) continue;
    const { data, body } = frontmatter(await readFile(file, 'utf8'));
    entries.push({ name: data.name ?? d.name, description: data.description ?? '', body });
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const s of entries) {
    await emit({ path: `/skills/${s.name}/`, title: `${s.name} | GHOST skills`, description: s.description, body: render(s.body) });
  }
  const index = [
    '<h1>Skills</h1>',
    '<p>The official agent skills for executing the protocol. Each cites the spec sections it interprets; none takes an act the spec reserves for the operator.</p>',
    '<ul>', ...entries.map((s) => `<li><a href="/skills/${s.name}/">${escapeHtml(s.name)}</a>: ${escapeHtml(s.description)}</li>`), '</ul>',
  ].join('\n');
  await emit({ path: '/skills/', title: 'Skills | GHOST', description: 'Official agent skills for executing the GHOST protocol.', body: index });
};

// ---- build ----------------------------------------------------------------
await mkdir(DIST, { recursive: true });
await cp(SITE, DIST, { recursive: true });
await buildSpec();
await buildGuide();
await buildConformance();
await buildSchemas();
await buildSkills();
await writeFile(resolve(DIST, 'nav.json'), JSON.stringify({ generatedAt: new Date().toISOString(), pages: built }, null, 2) + '\n');
console.log(`built dist/ with ${built.length} pages:\n${built.map((b) => `  ${b.path}`).join('\n')}`);
