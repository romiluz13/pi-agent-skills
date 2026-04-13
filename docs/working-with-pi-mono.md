# Working with `pi-mono`

This repo has two jobs:

1. `pi-mono/` is the upstream source tree. It provides the real docs, code, examples, and tests.
2. `pi-skills/` packages that source into skills, evals, and verification rules that keep answers grounded.
3. `skills/` is the install surface for the open `skills` CLI. It symlinks back into `pi-skills/pi-*`.

If you want to understand Pi itself, start with `pi-mono/README.md` and `pi-mono/packages/coding-agent/README.md`.

If you want to work on the skills repo, read this file and `pi-skills/README.md`.

---

## First-time setup

From an empty directory where you want both trees:

```bash
git clone https://github.com/badlogic/pi-mono.git pi-mono
cd pi-mono && npm install && npm run build && npm run check && cd ..
# clone or copy your skills repo beside pi-mono so you have:
#   pi-skill/pi-mono/
#   pi-skill/pi-skills/
```

`pi-skills` validators resolve `pi-mono/` as `../pi-mono` relative to `pi-skills/`. Keep that layout unless you also change the verification scripts.

---

## Shallow clone at the pinned commit (CI-style)

To match exactly what `**.pi-mono-rev**` records (same recipe as `.github/workflows/pi-skills-verify.yml`):

```bash
REV=$(tr -d ' \n\r' < .pi-mono-rev)
git clone --filter=blob:none --no-checkout https://github.com/badlogic/pi-mono.git pi-mono
git -C pi-mono fetch --depth 1 origin "$REV"
git -C pi-mono checkout FETCH_HEAD
```

Use a **full** clone when you are editing `pi-mono` or running its full test suite.

---

## Where the upstream docs live


| Need                                       | Start here                                                                                            |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Monorepo overview, package list            | `[pi-mono/README.md](../pi-mono/README.md)`                                                           |
| Terminal agent install, skills, extensions | `[pi-mono/packages/coding-agent/README.md](../pi-mono/packages/coding-agent/README.md)`               |
| Skill discovery, `/skill`, collisions      | `[pi-mono/packages/coding-agent/docs/skills.md](../pi-mono/packages/coding-agent/docs/skills.md)`     |
| Pi packages (`pi-package`, manifests)      | `[pi-mono/packages/coding-agent/docs/packages.md](../pi-mono/packages/coding-agent/docs/packages.md)` |
| RPC / JSONL framing                        | `[pi-mono/packages/coding-agent/docs/rpc.md](../pi-mono/packages/coding-agent/docs/rpc.md)`           |
| SDK embedding                              | `[pi-mono/packages/coding-agent/docs/sdk.md](../pi-mono/packages/coding-agent/docs/sdk.md)`           |
| Contributing to Pi                         | `[pi-mono/CONTRIBUTING.md](../pi-mono/CONTRIBUTING.md)`                                               |
| Rules for humans/agents on **pi-mono**     | `[pi-mono/AGENTS.md](../pi-mono/AGENTS.md)`                                                           |


The `pi-*` skills under `pi-skills/` are a curated index into these files and selected `src/` paths. They do not replace the upstream docs.

---

## Pi development commands

From `**pi-mono/`** (uses **npm**, not bun):

```bash
npm install
npm run build
npm run check   # requires build first; see pi-mono README
./test.sh       # skips LLM-dependent tests without API keys
./pi-test.sh    # run pi from sources
```

If you change upstream APIs that the skills cite, update the affected `pi-skills/pi-*/SKILL.md` files and evals, then run `cd pi-skills && npm run verify-skills`.

---

## Pinning and corpus honesty


| File                                  | Role                                                            |
| ------------------------------------- | --------------------------------------------------------------- |
| `[.pi-mono-rev](../.pi-mono-rev)`     | Full 40-char commit SHA the skills corpus is validated against. |
| `pi-skills/pi-*/references/CORPUS.md` | Human-readable note of the same pin + canonical remote.         |


After moving `pi-mono` to a new commit you intend to support:

```bash
cd pi-skills && npm run bump-corpus && npm run verify-skills && npm run sync-evals
```

`bump-corpus` reads `git -C ../pi-mono rev-parse HEAD` and updates `.pi-mono-rev` and every `CORPUS.md` line.

---

## Editing this workspace

- If you change `pi-skills/` only, follow the root `AGENTS.md` and run `npm run verify-skills` before you call it done.
- If you change `pi-mono/`, follow `pi-mono/AGENTS.md` and Pi’s `CONTRIBUTING.md`, then run `npm run check` and `./test.sh` from `pi-mono/`.
- Never invent `pi-mono/...` paths in skills or evals. The validators and `api-allowlist` exist to catch that.

---

## Installing the skills

See the root **[README.md](../README.md)** (Pi `~/.pi`, `pi install`, optional Cursor symlinks).

## Skill-creator loop

If you are iterating skills with Anthropic’s skill-creator, use `pi-skills/docs/skill-creator-workspace.md`. It maps the full loop onto this repo: eval workspaces, grading, viewer output, and trigger-description tuning.

## Grading needles

`docs/needle-rules.md` explains how human assertions from `all-evals.json` become machine substring needles and how to extend the extractor safely.
