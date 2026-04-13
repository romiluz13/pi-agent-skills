# Working with `pi-mono` in this repo

This workspace is **two things at once**:

1. `**pi-mono/`** — the upstream [Pi monorepo](https://github.com/badlogic/pi-mono): real source, builds, tests, and **canonical documentation** inside that tree.
2. `**pi-skills/`** — Agent Skills that teach models to answer **only** from paths that exist under your local `pi-mono/`, plus validators so citations stay honest.
3. `**skills/`** (repo root) — symlinks into `**pi-skills/pi-***` so the [open Agent Skills CLI](https://github.com/vercel-labs/skills) can install this repo with `**npx skills add owner/pi-skill**` (same distribution model as [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)).

If you only care about Pi itself, read `**pi-mono/README.md**` and `**pi-mono/packages/coding-agent/README.md**`. If you care about **skills + pins + CI**, read this file and `**pi-skills/README.md`**.

---

## First-time clone (full tree)

From an empty directory where you want both trees:

```bash
git clone https://github.com/badlogic/pi-mono.git pi-mono
cd pi-mono && npm install && npm run build && npm run check && cd ..
# clone or copy your pi-skill repo beside pi-mono so you have:
#   pi-skill/pi-mono/
#   pi-skill/pi-skills/
```

**Layout contract:** `pi-skills` validators resolve `pi-mono/` as `**../pi-mono`** relative to the `pi-skills` folder (repo root contains both). Do not nest `pi-mono` only inside `pi-skills` unless you change paths.

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

## Where the real docs live (upstream)


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


The `**pi-*` skills** under `pi-skills/` are a **curated index** into these files (and a few `src/` paths). They do not replace upstream docs.

---

## Standard Pi development commands

From `**pi-mono/`** (uses **npm**, not bun):

```bash
npm install
npm run build
npm run check   # requires build first; see pi-mono README
./test.sh       # skips LLM-dependent tests without API keys
./pi-test.sh    # run pi from sources
```

If you change upstream APIs that skills cite, update the affected `**pi-skills/pi-*/SKILL.md**` (and evals) and run `**cd pi-skills && npm run verify-skills**`.

---

## Pinning and corpus honesty (this repo)


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

## Agents editing this workspace

- **Changing `pi-skills/` only:** follow root `**AGENTS.md`** and run `**npm run verify-skills**` before claiming done.
- **Changing `pi-mono/`:** follow `**pi-mono/AGENTS.md`** and Pi’s `**CONTRIBUTING.md**`; run `**npm run check**` and `**./test.sh**` from `pi-mono/`.
- **Never invent** `pi-mono/...` paths in skills or evals — the validators and `api-allowlist` exist to catch that.

---

## Installing the skills (not pi-mono)

See the root **[README.md](../README.md)** (Pi `~/.pi`, `pi install`, optional Cursor symlinks).

## Skill-creator evaluation loop

If you are iterating skills with Anthropic’s **skill-creator** (parallel with/without skill, viewer, description optimization), use `**pi-skills/docs/skill-creator-workspace.md`** — it maps every phase to paths and npm commands in this repo.

## Grading needles

How human `**all-evals.json**` assertions become machine needles and how to extend them: `**docs/needle-rules.md**`.
