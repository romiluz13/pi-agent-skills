# Pi Skills

This directory is the canonical source for the published Pi skills.

Each `pi-*` directory contains one skill: `SKILL.md`, references, and any repo-local support files. The eval catalog, graded baselines, trigger sets, verification scripts, and tests also live here.

The repo expects a local `pi-mono/` clone at `../pi-mono` relative to this directory. If you are missing that clone, start with [docs/working-with-pi-mono.md](../docs/working-with-pi-mono.md).

## What lives here

| Path | Purpose |
|------|---------|
| `pi-*/` | Published skill directories |
| `evals/` | Canonical eval catalog, examples, packs, graded baselines |
| `trigger-evals/` | Trigger-tuning inputs, one file per skill |
| `scripts/` | Verification, grading, sync, and corpus-pin utilities |
| `tests/` | Unit tests for grading and path extraction helpers |
| `docs/` | Repo-local workflow docs such as the skill-creator playbook |

## Verify

```bash
npm run verify-skills
npm run ci
```

`npm run verify-skills` runs the static corpus and artifact gates:

- every `pi-mono/...` path cited in skills, docs, evals, and graded baselines exists
- `package.json` `pi.skills` matches the skill directories and the symlinked install surface under `../skills/`
- `all-evals.json`, `evals/evals.json`, `evals/packs/*.json`, `evals/examples/*.eval_metadata.json`, and `evals/graded-examples/*/` stay in sync
- frontmatter, allowlists, graded needles, graded responses, and trigger-eval sets all match repo rules

`npm run ci` adds the unit tests and regrades all checked-in baselines before running the same verification stack.

## Common Commands

```bash
# rebuild pack manifests from all-evals.json
npm run sync-evals

# rebuild the corpus pin after intentionally moving pi-mono
npm run bump-corpus

# derive machine needles for one eval
npm run extract-grade-assertions -- --id rpc-framing-001

# scaffold or refresh one graded example
npm run scaffold-graded-example -- --id rpc-framing-001

# regrade all checked-in baselines
npm run grade-graded-examples
```

## Evals

- Canonical catalog: [evals/all-evals.json](./evals/all-evals.json)
- Human-readable examples: [evals/examples/](./evals/examples/)
- Checked-in baselines: [evals/graded-examples/](./evals/graded-examples/)
- Per-skill packs: [evals/packs/](./evals/packs/)
- Trigger sets: [trigger-evals/](./trigger-evals/)

If you change `all-evals.json`, update the matching example metadata and graded artifacts, then run `npm run sync-evals` and `npm run ci`.

## Package Manifest

[`package.json`](./package.json) is the machine-readable source of truth for the published skills. It declares `keywords: ["pi-package"]` and a `pi.skills` array pointing at every shipped skill directory.

That manifest drives:

- repo verification
- install discovery through `../skills/`
- sync checks for eval packs and trigger sets

## Corpus Pin

Each skill’s `references/CORPUS.md` records the verified `pi-mono` commit. The repo root `.pi-mono-rev` must match that same commit when present.

After intentionally moving the local `pi-mono` checkout:

```bash
npm run bump-corpus
npm run verify-skills
npm run sync-evals
```

## Skill-Creator Workflow

The repo-specific mapping of Anthropic’s skill-creator loop lives in [docs/skill-creator-workspace.md](./docs/skill-creator-workspace.md).

Use it when you want to:

- iterate a skill against real prompts
- keep checked-in eval artifacts aligned with the live skill
- tune trigger descriptions with `run_loop`
