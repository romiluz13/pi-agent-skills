# Pi builder skills

Eleven Agent Skills (`pi-*`) grounded in a local `pi-mono/` clone. The repo root must contain **`../pi-mono`** relative to this directory so validators resolve paths.

**Upstream Pi documentation** (install, RPC, SDK, contributing) lives **inside `pi-mono/`** — see **[`docs/working-with-pi-mono.md`](../docs/working-with-pi-mono.md)** for the map and first-clone steps.

## Verify (hallucination gates)

```bash
npm run verify-skills
```

- **verify-corpus-paths** — every `pi-mono/...` citation in `SKILL.md` and `references/*.md` exists.
- **verify-docs-root-corpus** — same for repo **`README.md`**, **`AGENTS.md`**, **`docs/**/*.md`**, **`pi-skills/README.md`**, **`pi-skills/docs/**/*.md`**, eval/trigger READMEs.
- **verify-pi-mono-rev-format** — when [`.pi-mono-rev`](../.pi-mono-rev) exists, its first token is a full **40-character** hex SHA.
- **verify-package-pi-skills** — every **`package.json`** `pi.skills` path resolves to a **`SKILL.md`**.
- **verify-open-skills-layout** — repo-root **`skills/<name>/`** symlinks to **`pi-skills/<name>/`** for **`npx skills add`** discovery (same layout as [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)).
- **verify-corpus-pin** — `../pi-mono` HEAD matches [`.pi-mono-rev`](../.pi-mono-rev) (if present) and every `references/CORPUS.md` commit matches.
- **verify-all-evals-shape** — `evals/all-evals.json` has the expected schema; **`skill_evals`** order and names match **`pi.skills`**.
- **verify-eval-paths** — every `pi-mono/...` path embedded in `evals/all-evals.json` assertions exists.
- **verify-unique-eval-ids** — no duplicate `id` in `all-evals.json`.
- **verify-packs-in-sync** — `evals/evals.json` and `evals/packs/*.json` match **`npm run sync-evals`** output from `all-evals.json`.
- **verify-frontmatter** — YAML `name` matches directory; **compatibility** required; only **`name` / `description` / `compatibility`** keys; description ≤ 1024 chars; compatibility ≤ 500 chars; valid hyphen name.
- **verify-api-allowlist-unique** — no duplicate **`(symbol, file)`** rows in `scripts/api-allowlist.json`.
- **verify-api-mentions** — allowlisted symbols exist in the pinned tree (`scripts/api-allowlist.json`).
- **verify-graded-snapshots** — each `evals/graded-examples/*/with_skill/grading.json` matches `assertions.json` (all passed).
- **verify-graded-response-corpus** — every `pi-mono/...` citation in graded `with_skill/response.md` exists on disk.
- **verify-eval-artifacts** — `all-evals.json` ids match `evals/examples/*.eval_metadata.json` (prompt + assertions) and `evals/graded-examples/*/` exactly (no orphans, none missing).
- **verify-graded-needles** — each `graded-examples/*/assertions.json` matches **`extract-grade-assertions`** derivation (shared **`scripts/grade-needles.mjs`**).
- **verify-graded-needles-in-response** — each **`graded-examples/*/with_skill/response.md`** contains **every** substring from that dir’s **`assertions.json`**.
- **verify-trigger-evals** — every **`package.json`** `pi.skills` entry has **`trigger-evals/<name>.json`** (20 rows, 10× `should_trigger: true`, 10× false); **no orphan** JSON in **`trigger-evals/`**.

Regenerate per-skill eval packs after editing `evals/all-evals.json`:

```bash
npm run sync-evals
```

## Pi package manifest

[`package.json`](./package.json) includes `keywords: ["pi-package"]` and `pi.skills` pointing at each skill directory. Use as a template for publishing (`pi-mono/packages/coding-agent/docs/packages.md`).

## Evals and trigger tuning

- Substantive eval prompts: [`evals/all-evals.json`](./evals/all-evals.json)
- Description trigger sets (20× per skill): [`trigger-evals/`](./trigger-evals/)
- Skill-creator playbook (full Anthropic loop × this repo): [`docs/skill-creator-workspace.md`](./docs/skill-creator-workspace.md)

## Corpus pin

Each skill’s `references/CORPUS.md` records the verified `pi-mono` commit (must match repo root **`.pi-mono-rev`** when that file exists). After updating `pi-mono`:

```bash
npm run bump-corpus && npm run verify-skills && npm run sync-evals
```

`bump-corpus` sets `.pi-mono-rev` from `git -C ../pi-mono rev-parse HEAD` and rewrites every `CORPUS.md` commit line.
