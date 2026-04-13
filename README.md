# pi-skill workspace

Code-grounded **Pi builder** Agent Skills plus a pinned [pi-mono](https://github.com/badlogic/pi-mono) corpus. Skills answer from `pi-mono/` paths only; validators enforce cited paths exist.

**New here?** Read **[docs/working-with-pi-mono.md](docs/working-with-pi-mono.md)** for how to clone, where upstream documentation lives, Pi’s `npm` dev commands, and how pins (`.pi-mono-rev`, `CORPUS.md`) relate to **`pi-skills/`**. Agents should read root **`AGENTS.md`**.

## Layout

| Path | Purpose |
|------|---------|
| `skills/` | **Open Skills CLI** install root (same idea as [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)): symlinks to each `pi-skills/pi-*` so `npx skills add <github>/pi-skill` discovers skills. See **`skills/README.md`**. |
| `pi-mono/` | Upstream Pi monorepo — CI and pins use `.pi-mono-rev` at repo root. After updating `pi-mono`, run `cd pi-skills && npm run bump-corpus` (writes `.pi-mono-rev` + all `CORPUS.md` lines), then `npm run verify-skills && npm run sync-evals`. |
| `pi-skills/` | Eleven `pi-*` skills + validators (`npm run verify-skills` or **`npm run ci`** = regrade + all gates). |
| `pi-skills/evals/` | Skill-creator eval prompts (`all-evals.json`). |
| `pi-skills/trigger-evals/` | Description trigger tuning sets (should / should-not) per skill. |
| `pi-skills-workspace/` | Skill-creator iteration outputs (gitignored). Layout: `pi-skills/docs/skill-creator-workspace.md`. |

## Commands

```bash
cd pi-skills && npm run verify-skills   # fast: all static gates
cd pi-skills && npm run ci              # CI parity: regrade 35 baselines, then all gates
```

`verify-skills` runs **19** sub-verifiers (skill corpus paths, **docs/README corpus paths**, **40-char `.pi-mono-rev`**, **`pi.skills` → `SKILL.md`**, pin, **all-evals schema + pack order**, eval paths, **unique eval ids**, **packs manifest sync**, frontmatter key allowlist, **unique API allowlist rows**, API symbol checks, graded snapshots, graded response paths, eval artifact sync, graded needles, **needles present in baseline responses**, trigger-eval JSON incl. **orphan** files). Run **`npm test`** for **`grade-needles`** / **`pi-mono-paths`** unit checks. Grading rules: **`docs/needle-rules.md`**.

After editing eval definitions: `cd pi-skills && npm run sync-evals`. New baseline: `npm run scaffold-graded-example -- --id <eval_id>`. Extract needles: `npm run extract-grade-assertions -- --id rpc-framing-001`.

## Completion (this repo)

| Area | Status |
|------|--------|
| Eleven code-grounded `pi-*` skills + `CORPUS.md` pins | Done |
| `all-evals.json` ↔ examples ↔ graded baselines (35/35) | Done |
| Automated gates (incl. trigger sets: 10 should / 10 should-not × 11 skills) | Done |
| Docs: `docs/working-with-pi-mono.md`, **`docs/needle-rules.md`**, skill-creator playbook, `AGENTS.md`, `CONTRIBUTING.md`, `LICENSE` | Done |
| GitHub Action: shallow `pi-mono` + `npm run ci` + pack diff | Done |

**~100%** = everything above is implemented and enforced in CI. What stays **manual / environment-specific**: skill-creator **`run_loop`** (needs `claude -p`), parallel with/without-skill runs, `generate_review.py`, and choosing when to **`bump-corpus`**. Distribution for end users is **`npx skills add your/pi-skill`** (GitHub), not publishing these markdown trees as an npm package.

Upstream **pi-mono** uses **npm** (not bun) for its own build/check.

## Skill-creator

Full loop (parallel runs, `grading.json` schema, `aggregate_benchmark`, `generate_review.py`, `run_loop`, trigger sets) is mapped step-by-step in **`pi-skills/docs/skill-creator-workspace.md`**. Upstream plugin: [claude-plugins-official / skill-creator](https://github.com/anthropics/claude-plugins-official). Point `eval-viewer/generate_review.py` at `pi-skills-workspace/iteration-N` after baselines complete.

## Claude Code Plugin

This repo ships a `.claude-plugin/plugin.json` manifest so the **repo root is a valid Claude Code plugin**. Skills load under the `pi-skill:` namespace.

```bash
# Local dev / one-off session
claude --plugin-dir /path/to/pi-skill

# Skills are invocable as:
# /pi-skill:pi-cli-workspace
# /pi-skill:pi-extension-authoring
# /pi-skill:pi-ai-library
# ... (all 11 skills)
```

To submit to the official Anthropic marketplace: `claude.ai/settings/plugins/submit` or `platform.claude.com/plugins/submit`.

---

## Installing skills (Vercel / Open Skills CLI)

This repo is meant to be consumed **from GitHub** the same way as [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills): the [open `skills` CLI](https://github.com/vercel-labs/skills) (`npx skills`, npm package `skills`) clones the repo and wires skills into agents. **Skill bodies** are under repo-root **`skills/`** (symlinks to **`pi-skills/pi-*`**).

```bash
# Install all skills into Pi’s skill dirs (~/.pi/agent/skills/ / .pi/skills/)
npx skills add <your-github-username>/pi-skill -a pi -y

# List what the CLI sees without installing
npx skills add <your-github-username>/pi-skill --list

# One skill only (path matches GitHub “tree” URL form)
npx skills add https://github.com/<you>/pi-skill/tree/main/skills/pi-cli-workspace -a pi -y
```

Format reference: [Agent Skills](https://agentskills.io/). The **`skills`** package is what ships to npm; **this** repo is a **skills bundle** (like `agent-skills`), not a second CLI.

## Installing in Pi (manual / packages)

Symlink or copy skill dirs under `~/.pi/agent/skills/` or use `pi install` with a package that lists these paths in `package.json` `pi.skills` (see `pi-skills/package.json`).

**Cursor (optional):** from the repo root, with absolute paths:

```bash
SKILLS="$PWD/pi-skills"
for d in pi-cli-workspace pi-extension-authoring pi-package-authoring pi-ai-library pi-agent-embedding pi-web-ui pi-rpc-sdk pi-tui pi-mom pi-pods pi-customization; do
  ln -sf "$SKILLS/$d" "$HOME/.cursor/skills/$d"
done
```
