# Agent guidance (pi-skill repo)

This repository combines **vendor `pi-mono/`** and `**pi-skills/**` (code-grounded Agent Skills). Treat them as separate concerns unless a task touches both.

## Before you edit `pi-skills/`

1. Read `**docs/working-with-pi-mono.md**` for clone layout, pin semantics, and links to upstream docs. For **assertions → machine needles**, read `**docs/needle-rules.md`**. For the full **skill-creator** loop (eval workspace, viewer, `run_loop`), follow `**pi-skills/docs/skill-creator-workspace.md`**. Contributing: `**CONTRIBUTING.md**`.
2. Ground skill content in **real paths** under `pi-mono/` that exist in the working tree.
3. Before claiming done: `cd pi-skills && npm run verify-skills` (or `**npm run ci`** to match GitHub Actions: regrade baselines then all gates). If you changed `evals/all-evals.json`, also `npm run sync-evals`, update matching `**evals/examples/<id>.eval_metadata.json**`, and keep `**evals/graded-examples/<id>/assertions.json**` aligned with `**extract-grade-assertions**` (`**verify-graded-needles**`). `**verify-eval-artifacts**` requires catalog, metadata, and graded dirs in lockstep. `**verify-packs-in-sync**` and `**verify-all-evals-shape**` lock pack manifests and eval JSON shape (including `**skill_evals**` order vs `**pi.skills**`). `**verify-graded-needles-in-response**` requires baseline `**with_skill/response.md**` to contain every graded needle. `**verify-trigger-evals**` enforces each `**pi.skills**` entry has a valid `**trigger-evals/*.json**`.
4. Do not add `**TODO**`, placeholders, or uncited APIs. Extend `**scripts/api-allowlist.json**` only when a new symbol is intentionally part of the contract.

## Before you edit `pi-mono/`

Follow `**pi-mono/AGENTS.md**` and `**pi-mono/CONTRIBUTING.md**`. Run Pi’s `**npm run check**` and `**./test.sh**` from `pi-mono/`. If upstream paths cited in skills move or rename, update the corresponding `**pi-skills/pi-*/SKILL.md**` and evals.

## Corpus bump

When `pi-mono` HEAD should become the new truth: `cd pi-skills && npm run bump-corpus`, then verify + sync as above.
