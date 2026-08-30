// Gate tests: the validator accepts the examples and rejects the broken fixture,
// and the extractor's register matches the spec.
// Copyright 2026 d7r LLC
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const run = (args) => {
  try {
    return { code: 0, out: execFileSync('node', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

test('every example validates against its schema', () => {
  const r = run(['tools/validate.mjs', '--all']);
  assert.equal(r.code, 0, r.out);
});

test('the invalid charter fixture is rejected, with the rung and rights violations named', () => {
  const r = run(['tools/validate.mjs', 'tools/tests/fixtures/invalid-charter.json', '--schema', 'counselor-charter']);
  assert.equal(r.code, 1, 'a fixture that must fail passed');
  assert.match(r.out, /authorityRung/);
  assert.match(r.out, /rightsDeclaration|required/);
});

test('the conformance register matches the spec', () => {
  const r = run(['tools/extract-requirements.mjs', '--check']);
  assert.equal(r.code, 0, r.out);
});

test('a file the validator cannot map to a schema is a failure, not a skip', () => {
  const r = run(['tools/validate.mjs', 'package.json']);
  assert.equal(r.code, 1);
  assert.match(r.out, /cannot map/);
});
