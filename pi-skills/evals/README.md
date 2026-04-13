# Eval packs

For the **skill-creator** evaluation loop (parallel runs, viewer, description optimization) as applied to this repo, see **[`docs/skill-creator-workspace.md`](../docs/skill-creator-workspace.md)**. Needle derivation rules: **[`docs/needle-rules.md`](../../docs/needle-rules.md)**.

**Coverage:** every eval id in **`all-evals.json`** has a matching **`evals/examples/<id>.eval_metadata.json`** and **`evals/graded-examples/<id>/`** — enforced by **`scripts/verify-eval-artifacts.mjs`** (also rejects stray graded dirs).

- **`all-evals.json`** — canonical definitions (assertions as human-readable strings for review). Any `pi-mono/...` path in assertions is checked by `scripts/verify-eval-paths.mjs`.
- **`evals.json`** — manifest of per-skill packs (run `npm run sync-evals` after editing `all-evals.json`).
- **`packs/*.json`** — one object per skill: `{ "skill_name", "evals": [...] }` for skill-creator–style imports.

## Programmatic grading

`scripts/grade-assertions.mjs` checks **substring** presence. Use **exact path strings** (e.g. `pi-mono/packages/...`) in `--assertions` JSON, not prose like `Mentions pi-mono/...`.

Example (pilot):

```bash
node scripts/grade-assertions.mjs \
  --response evals/graded-examples/cli-precedence-001/with_skill/response.md \
  --assertions evals/graded-examples/cli-precedence-001/assertions.json \
  --out evals/graded-examples/cli-precedence-001/with_skill/grading.json
```

Re-run all checked-in graded baselines: `npm run grade-graded-examples`. Needles from `all-evals.json`: `npm run extract-grade-assertions -- --id <eval_id> [--out assertions.json]`. After editing assertions or responses, run **`npm run ci`** (or `grade-graded-examples` + `verify-skills`). Gates include **`verify-graded-snapshots`**, **`verify-graded-response-corpus`**, **`verify-graded-needles`** (assertions.json must match **`extract-grade-assertions`** derivation), and **`verify-eval-artifacts`**.

Output `grading.json` uses `expectations: [{ text, passed, evidence }]` for the skill-creator viewer.

## Examples

- **`evals/examples/*.eval_metadata.json`** — one per eval id (prompt + human assertions + `skill_name`).
- **`evals/graded-examples/<eval_id>/`** — **`assertions.json`**, **`with_skill/response.md`**, **`with_skill/grading.json`** (20 ids today; matches **`all-evals.json`**).

Adding a new graded example:

1. `cd pi-skills && npm run scaffold-graded-example -- --id <eval_id>` — writes `assertions.json` (machine needles), `evals/examples/<id>.eval_metadata.json`, and a stub `with_skill/response.md`.
2. Replace the stub with a real with-skill response that satisfies every needle.
3. `npm run grade-graded-examples` — refreshes every `with_skill/grading.json` under `evals/graded-examples/*/`.
4. `npm run verify-skills` — **`verify-graded-snapshots`** auto-discovers any `evals/graded-examples/*/` that contains `assertions.json` (no manual list).
