// Artifact validator: GHOST artifacts against schema/v1.
// Copyright 2026 d7r LLC
// Usage:
//   node tools/validate.mjs --all                 validate every file in examples/
//   node tools/validate.mjs <file> [--schema s]   validate one file; schema inferred
//                                                 from the filename stem otherwise
// Exits non-zero with every violation named. A file it cannot map to a schema is a
// failure, never a skip.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schemaDir = join(root, 'schema', 'v1');

// strictRequired is off because the schemas use if/then conditional requires
// (held -> hash, projection -> rightsDeclaration), where the property is defined
// on the parent; that is standard draft-07 and safe.
const ajv = new Ajv({ allErrors: true, strict: true, strictRequired: false });
addFormats(ajv);

const validators = {};
for (const f of readdirSync(schemaDir).filter((f) => f.endsWith('.schema.json'))) {
  const stem = f.replace('.schema.json', '');
  validators[stem] = ajv.compile(JSON.parse(readFileSync(join(schemaDir, f), 'utf8')));
}

function schemaFor(file, explicit) {
  if (explicit) return explicit;
  const base = basename(file);
  for (const stem of Object.keys(validators)) {
    if (base.startsWith(stem) || base.replace(/\.(composite|simulated|projection|official)/, '').startsWith(stem)) return stem;
  }
  // Charter examples may be named charter.<class>.json.
  if (/^charter\./.test(base)) return 'counselor-charter';
  return null;
}

function validateOne(file, explicit) {
  const stem = schemaFor(file, explicit);
  if (!stem || !validators[stem]) {
    console.error(`validate: cannot map ${file} to a schema (have: ${Object.keys(validators).join(', ')})`);
    return false;
  }
  let data;
  try { data = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { console.error(`validate: ${file} is not valid JSON: ${e.message}`); return false; }
  const ok = validators[stem](data);
  if (!ok) {
    for (const err of validators[stem].errors) console.error(`validate: ${file} [${stem}] ${err.instancePath || '/'} ${err.message}`);
    return false;
  }
  console.log(`validate: ${file} ok [${stem}]`);
  return true;
}

const args = process.argv.slice(2);
if (args.includes('--all')) {
  const dir = join(root, 'examples');
  if (!existsSync(dir)) { console.error('validate: examples/ missing'); process.exit(1); }
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  if (!files.length) { console.error('validate: examples/ has no JSON files; an empty example set proves nothing'); process.exit(1); }
  let allOk = true;
  for (const f of files) allOk = validateOne(join(dir, f)) && allOk;
  process.exit(allOk ? 0 : 1);
}

const schemaIdx = args.indexOf('--schema');
const explicit = schemaIdx >= 0 ? args[schemaIdx + 1] : null;
const files = args.filter((a, i) => !a.startsWith('--') && (schemaIdx < 0 || i !== schemaIdx + 1));
if (!files.length) { console.error('usage: validate.mjs --all | <file> [--schema <stem>]'); process.exit(1); }
let allOk = true;
for (const f of files) allOk = validateOne(f, explicit) && allOk;
process.exit(allOk ? 0 : 1);
