// Record-structure gate: log filenames, decision headers, required READMEs.
// Copyright 2026 d7r LLC
// Exit 0 clean; exit 1 with every violation named. Never silently passes a
// directory it could not read: unknown is reported as a failure with the reason.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];

const LOG_ID = /^\d{8}T\d{6}Z-[0-9a-f]{10}-[a-z0-9-]+\.md$/;
const DECISION_NAME = /^\d{4}-[a-z0-9-]+\.md$/;

// Required directory READMEs: a directory without a stated contract is a
// directory that fills with anything.
for (const dir of ['log', 'decisions', 'docs', 'docs/plans', 'schema', 'skills', 'tools', 'conformance', 'rfcs', 'examples']) {
  if (!existsSync(join(root, dir))) { problems.push(`missing directory: ${dir}/`); continue; }
  if (!existsSync(join(root, dir, 'README.md')) && !existsSync(join(root, dir, '.gitkeep'))) {
    problems.push(`missing README.md in ${dir}/`);
  }
}

if (existsSync(join(root, 'log'))) {
  const seen = new Set();
  for (const f of readdirSync(join(root, 'log')).filter((f) => f.endsWith('.md') && f !== 'README.md')) {
    if (!LOG_ID.test(f)) problems.push(`log entry does not match the minted pattern: log/${f}`);
    const id = f.slice(0, 27);
    if (seen.has(id)) problems.push(`duplicate log identifier: ${id}`);
    seen.add(id);
  }
}

if (existsSync(join(root, 'decisions'))) {
  for (const f of readdirSync(join(root, 'decisions')).filter((f) => f.endsWith('.md') && f !== 'README.md')) {
    if (!DECISION_NAME.test(f)) { problems.push(`decision filename not NNNN-kebab: decisions/${f}`); continue; }
    const text = readFileSync(join(root, 'decisions', f), 'utf8');
    if (!/\*\*Status:\*\*/.test(text)) problems.push(`decision missing **Status:** line: decisions/${f}`);
    if (!/\*\*Enforced by:\*\*/.test(text)) problems.push(`decision missing **Enforced by:** line: decisions/${f}`);
  }
}

if (problems.length) {
  for (const p of problems) console.error(`check-record: ${p}`);
  process.exit(1);
}
console.log('check-record: ok');
