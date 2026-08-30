# docs

- `ENGINEERING-STANDARD.md`: the repo's engineering rules (decision 0001).
- `plans/`: designs and plans, from the templates there.
- `guide/`: implementer-facing documentation, rendered to the site at `/guide/` by
  `scripts/build-site.mjs`. Each file carries frontmatter (`title`, `order`,
  `description`). Generated reference pages (conformance, schemas, skills) are built
  from their machine sources at build time and never authored here: two copies
  drift, and the copy is always the one that is wrong.
