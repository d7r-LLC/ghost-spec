// Builds the ghost-spec.dev static site into dist/.
//
//   node scripts/build-site.mjs
//
// Copies site/ verbatim, then renders spec/GHOST-v1.0.md into dist/spec/index.html
// so the published specification is always generated from the canonical Markdown
// and cannot drift from it.
//
// Copyright 2026 d7r LLC

import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
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

/** Collected while rendering, so the table of contents matches the real headings. */
const toc = [];

const renderer = new marked.Renderer();
renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const plain = text.replace(/<[^>]+>/g, '');
  const id = slug(plain);
  if (depth === 2) toc.push({ id, text: plain });
  return `<h${depth} id="${id}">${text}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${depth}>\n`;
};

const page = ({ title, description, body }) => `<!doctype html>
<html lang="en" data-accent="ghost">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="https://ghost-spec.dev/spec/">
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
      <a href="/">Overview</a>
      <a href="https://github.com/d7r-LLC/ghost-spec/blob/main/spec/GHOST-v1.0.md">Markdown source</a>
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

const build = async () => {
  const markdown = await readFile(SPEC, 'utf8');

  toc.length = 0;
  let html = marked.parse(markdown, { renderer, mangle: false, headerIds: false });

  // The document opens with a block of "**Status:** ..." metadata lines. Give it the
  // boxed treatment, and keep one field per line: Markdown folds the source newlines
  // into spaces, which runs the fields together into a single paragraph.
  html = html.replace(
    /<p>(<strong>Status:<\/strong>[\s\S]*?)<\/p>/,
    (_, fields) => `<div class="meta"><p>${fields.trim().replace(/\n/g, '<br>\n')}</p></div>`
  );

  const tocHtml = [
    '<nav class="toc">',
    '<h2>Contents</h2>',
    '<ol>',
    ...toc.map(({ id, text }) => {
      // Section headings read "1. Abstract"; the list numbering would double it up.
      const label = text.replace(/^\d+(\.\d+)*\.?\s*/, '');
      return `<li><a href="#${id}">${escapeHtml(label)}</a></li>`;
    }),
    '</ol>',
    '</nav>',
  ].join('\n');

  // Insert the table of contents after the title and metadata block.
  const withToc = html.replace(/(<\/div>)/, `$1\n${tocHtml}`);

  await mkdir(DIST, { recursive: true });
  await cp(SITE, DIST, { recursive: true });
  await mkdir(resolve(DIST, 'spec'), { recursive: true });
  await writeFile(
    resolve(DIST, 'spec/index.html'),
    page({
      title: 'GHOST Specification v1.0',
      description:
        'GHOST v1.0: governed advisor projections. Persona classes, the honest frame, the authority ladder, certification, and fifteen named failure classes.',
      body: withToc,
    })
  );

  console.log(`built dist/ with ${toc.length} spec sections`);
};

await build();
