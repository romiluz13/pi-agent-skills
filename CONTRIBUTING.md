# Contributing to pi-skill

This repository holds **code-grounded Agent Skills** for building with [Pi](https://github.com/badlogic/pi-mono) (vendored **`pi-mono/`** tree) plus validators so models cannot silently invent repository paths that are not on disk.

## Before you change anything

1. Read **`AGENTS.md`** and **`docs/working-with-pi-mono.md`**.
2. Keep a local **`pi-mono/`** clone at the repo root (same layout CI uses). Shallow checkout at **`.pi-mono-rev`** is enough for gates; full clone if you edit upstream.
3. From **`pi-skills/`**, run **`npm run ci`** before opening a PR (regrades baselines + all verifiers).

## Ground rules

- **No invented paths.** Every **`pi-mono/`**-prefixed path string in skills, evals, graded sample answers, and root docs must exist on disk. Verifiers enforce this.
- **Single source of truth for evals:** **`evals/all-evals.json`**. If you add or change an eval, update **`evals/examples/<id>.eval_metadata.json`**, **`evals/graded-examples/<id>/`**, run **`npm run sync-evals`**, then **`npm run ci`**.
- **Trigger sets:** each skill in **`package.json` → `pi.skills`** must have **`trigger-evals/<skill-name>.json`** (20 rows: 10 `should_trigger: true`, 10 `false`). No orphan JSON files in **`trigger-evals/`**.
- **Upstream Pi** (`pi-mono/`) follows **`pi-mono/AGENTS.md`** and **`pi-mono/CONTRIBUTING.md`**. This file is only for the **pi-skill** wrapper repo.

## Adding a skill or eval

1. Add or edit **`pi-skills/pi-*/SKILL.md`** (and **`references/`** if needed). If you add a **new** skill directory, also add it to **`pi-skills/package.json` → `pi.skills`** and create a matching symlink **`skills/<name>` → `../pi-skills/<name>`** (see **`skills/README.md`**) so **`npx skills add owner/pi-skill`** can discover it. Run **`npm run verify-skills`**.
2. Add eval rows to **`evals/all-evals.json`**, then **`npm run scaffold-graded-example -- --id <eval_id>`** (or mirror existing graded dirs), write **`with_skill/response.md`**, **`npm run grade-graded-examples`**.
3. **`npm run sync-evals`** and **`npm run ci`**.

## Corpus bump

When intentionally moving to a new **`pi-mono`** commit: **`npm run bump-corpus`** from **`pi-skills/`**, then fix any path or allowlist breaks and **`npm run ci`**.

## License

By contributing, you agree your contributions are licensed under the MIT license in **`LICENSE`**.
