#!/usr/bin/env node
// Skills-surface validator for the d7r skills repository standard.
// Checks: frontmatter shape (name, description, optional metadata), name equals
// directory, "Use when" trigger, line budget (40 to 200 MUST; 60 to 140 SHOULD
// reported as a note), bootstrap catalog membership, six-manifest version
// lockstep, and the em dash ban across skills/.
// Generic on purpose: reads the slug from package.json name (<slug>-skills).
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// The plugin manifest is the plugin's identity; package.json may carry a
// different repo identity (a spec repo's npm package is its site build).
const plugin = JSON.parse(readFileSync(join(root, ".claude-plugin/plugin.json"), "utf8"));
const slug = plugin.name.replace(/-skills$/, "");
const bootstrapName = `${slug}-using-${slug}-skills`;

const manifests = [
  [".claude-plugin/plugin.json", (d) => d.version],
  [".claude-plugin/marketplace.json", (d) => d.plugins[0].version],
  [".codex-plugin/plugin.json", (d) => d.version],
  [".cursor-plugin/plugin.json", (d) => d.version],
  ["gemini-extension.json", (d) => d.version],
  ["package.json", (d) => d.version],
];
const versions = manifests.map(([p, pick]) => pick(JSON.parse(readFileSync(join(root, p), "utf8"))));
assert(versions.every((v) => v === versions[0]), `Manifest versions differ: ${versions.join(", ")}`);

const skillsRoot = join(root, "skills");
const names = readdirSync(skillsRoot, { withFileTypes: true })
  .filter((e) => e.isDirectory()).map((e) => e.name).sort();
assert(names.includes(bootstrapName), `Missing bootstrap skill ${bootstrapName}.`);
const bootstrap = readFileSync(join(skillsRoot, bootstrapName, "SKILL.md"), "utf8");

for (const name of names) {
  const path = join(skillsRoot, name, "SKILL.md");
  assert(existsSync(path), `${name} has no SKILL.md.`);
  const text = readFileSync(path, "utf8");
  assert(!text.includes("\u2014"), `${name} contains an em dash.`);
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert(fm, `${name} has invalid frontmatter delimiters.`);
  const keys = fm[1].split("\n")
    .map((row) => row.slice(0, row.indexOf(":")))
    .filter((k) => k && !k.startsWith(" ") && !k.startsWith("-"));
  const ok = ["name,description", "name,description,metadata"].includes(keys.join(","));
  assert(ok, `${name} frontmatter must be name, description, optionally metadata (got: ${keys.join(", ")}).`);
  const fmName = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  assert.equal(fmName, name, `${name} folder and frontmatter names differ.`);
  const description = fm[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  assert(description?.startsWith("Use when"), `${name} lacks a Use when trigger.`);
  const lines = text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
  assert(lines >= 40 && lines <= 200, `${name} outside the 40 to 200 line bound (${lines}).`);
  if (lines < 60 || lines > 140) console.log(`note: ${name} outside the 60 to 140 SHOULD band (${lines}).`);
  if (name !== bootstrapName) {
    assert(bootstrap.includes(`\`${name}\``), `${name} missing from the bootstrap catalog.`);
  }
}

// The loaders name the bootstrap skill by path. A rename or a bad scaffold
// substitution leaves a path that resolves to nothing, and the failure is
// silent at runtime: the harness loads the plugin and injects "bootstrap not
// found" instead of the rules. Caught once during the first template
// application, so it is checked here rather than trusted.
for (const [rel, pattern] of [
  ["hooks/session-start.sh", /skills\/([A-Za-z0-9_-]+)\/SKILL\.md/],
  [`.opencode/plugins/${slug}-skills.js`, /join\(skillsDir,\s*['"]([A-Za-z0-9_-]+)['"]/],
]) {
  const file = join(root, rel);
  if (!existsSync(file)) continue;
  const found = readFileSync(file, "utf8").match(pattern);
  assert(found, `${rel} does not name a bootstrap skill path.`);
  assert.equal(found[1], bootstrapName,
    `${rel} points at ${found[1]} but the bootstrap skill is ${bootstrapName}.`);
}

console.log(`validate-skills: ${names.length} skills ok, versions ${versions[0]} in lockstep, bootstrap path resolves.`);
