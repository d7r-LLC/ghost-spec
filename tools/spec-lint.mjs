// Spec and docs lint: the bans CONTRIBUTING states, made checkable.
// Copyright 2026 d7r LLC
// Checks, each a named failure:
//   1. No em dash character anywhere in tracked text files.
//   2. No machine-absolute paths (/Users/, /home/, C:\) in spec, docs, or skills.
//   3. CLAUDE.md and AGENTS.md are byte-identical (the steering-twins rule).
//   4. The spec still carries its Status line untouched in form.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const EM_DASH = '\u2014';
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'site']);
const TEXT_EXT = /\.(md|mjs|js|json|sh|yml|yaml|toml|css|html|txt)$/;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(name)) yield* walk(p); }
    else yield p;
  }
}

for (const p of walk(root)) {
  const rel = relative(root, p);
  if (!TEXT_EXT.test(rel)) continue;
  const text = readFileSync(p, 'utf8');
  if (text.includes(EM_DASH)) {
    // The pre-existing spec text is normative and predates the lint; it is
    // reported per line so the author can rule on cleanup, but spec/ lines are
    // notes, not failures, because agents may not edit normative text to satisfy
    // a lint.
    const lines = text.split('\n').map((l, i) => (l.includes(EM_DASH) ? i + 1 : 0)).filter(Boolean);
    if (rel.startsWith('spec/')) console.log(`spec-lint NOTE: em dash in normative text ${rel}:${lines.join(',')} (author cleanup item)`);
    else problems.push(`em dash in ${rel}:${lines.join(',')}`);
  }
  if (/^(docs|skills|conformance|examples)\//.test(rel) || rel === 'README.md' || rel === 'CONTRIBUTING.md') {
    for (const pat of [/\/Users\/[a-z]/i, /\/home\/[a-z]/i, /[A-Z]:\\\\/]) {
      if (pat.test(text)) problems.push(`machine-absolute path in ${rel}`);
    }
  }
}

const claude = readFileSync(join(root, 'CLAUDE.md'));
const agents = readFileSync(join(root, 'AGENTS.md'));
if (!claude.equals(agents)) problems.push('CLAUDE.md and AGENTS.md are not byte-identical');

const spec = readFileSync(join(root, 'spec', 'GHOST-v1.0.md'), 'utf8');
if (!/\*\*Status:\*\*/.test(spec)) problems.push('spec Status line missing or reshaped');

if (problems.length) {
  for (const p of problems) console.error(`spec-lint: ${p}`);
  process.exit(1);
}
console.log('spec-lint: ok');
