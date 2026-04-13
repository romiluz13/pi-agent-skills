# Contributing

This repo packages source-grounded skills for [Pi](https://github.com/badlogic/pi-mono) and the verification rules that keep them honest.

The workflow is simple:

1. change the skill or eval source
2. regenerate any derived artifacts
3. run the repo checks

## Before you start

1. Read `AGENTS.md`.
2. Read `docs/working-with-pi-mono.md`.
3. Keep a local `pi-mono/` clone at the repo root. A shallow checkout at `.pi-mono-rev` is enough for most repo gates; use a full clone if you are editing upstream source.

## Ground rules

- No invented `pi-mono/...` paths. Every cited path in skills, evals, graded baselines, and repo docs must exist on disk.
- `evals/all-evals.json` is the eval source of truth.
- Every published skill in `pi-skills/package.json` `pi.skills` must have a matching trigger set in `trigger-evals/<skill-name>.json`.
- If you touch upstream `pi-mono/`, follow `pi-mono/AGENTS.md` and `pi-mono/CONTRIBUTING.md`. This file is only for the skills repo.

## Changing skills

If you add or update a skill:

1. Edit `pi-skills/pi-*/SKILL.md` and any matching `references/` files.
2. If it is a new skill, add it to `pi-skills/package.json` `pi.skills`.
3. Add the matching symlink under `skills/<name>` so `npx skills add ...` can discover it.
4. Run `cd pi-skills && npm run verify-skills`.

## Changing evals

If you add or update eval coverage:

1. Edit `pi-skills/evals/all-evals.json`.
2. Update the matching `pi-skills/evals/examples/<id>.eval_metadata.json`.
3. Update or scaffold the graded example under `pi-skills/evals/graded-examples/<id>/`.
4. Run:

```bash
cd pi-skills
npm run sync-evals
npm run grade-graded-examples
npm run ci
```

## Corpus pin

When intentionally moving the supported `pi-mono` revision:

```bash
cd pi-skills
npm run bump-corpus
npm run verify-skills
npm run sync-evals
```

Then fix any broken paths, allowlist mismatches, or stale graded artifacts before you open a PR.

## License

By contributing, you agree that your contributions are licensed under the MIT license in `LICENSE`.
