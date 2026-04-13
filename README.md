# Pi Agent Skills

Source-grounded skills for [Pi](https://github.com/badlogic/pi-mono).

This repo packages 11 skills that answer Pi questions from a pinned `pi-mono` checkout instead of guessing from memory. Every cited `pi-mono/...` path is verified on disk. Every shipped eval, graded baseline, and trigger set is checked in CI.

If you want Pi-focused answers that are package-aware, file-aware, and harder to hallucinate, this repo is the point.

## Why use these skills

- Pi documentation is split across package READMEs, `docs/`, examples, and source files. These skills turn that into package-level entry points.
- Answers are forced to stay grounded in real `pi-mono/...` paths. Broken citations fail verification.
- The repo ships developer-facing checks, not just Markdown: eval catalogs, graded baselines, trigger sets, and verification scripts live alongside the skills.

## Coverage

| Skill | Focus |
|------|-------|
| `pi-cli-workspace` | CLI behavior, settings, sessions, compaction, `/tree`, providers, models, philosophy |
| `pi-extension-authoring` | `ExtensionAPI`, commands, tools, dynamic resources, TUI integration, custom providers |
| `pi-package-authoring` | Pi packages, manifests, install/update behavior, precedence |
| `pi-ai-library` | `@mariozechner/pi-ai`, providers, streaming, tool calling, provider work |
| `pi-agent-embedding` | `@mariozechner/pi-agent-core`, events, embedding, SDK examples |
| `pi-web-ui` | `@mariozechner/pi-web-ui`, storage, example app, browser integration |
| `pi-rpc-sdk` | RPC mode, JSON mode, `AgentSession`, SDK entry points |
| `pi-tui` | `@mariozechner/pi-tui`, components, overlays, rendering, input handling |
| `pi-mom` | Slack bot, sandboxing, events, artifacts server, multi-platform docs |
| `pi-pods` | GPU pod setup, vLLM config, model startup, tool parsers |
| `pi-customization` | themes, keybindings, prompt templates, system prompt overrides |

## Repo Layout

| Path | Purpose |
|------|---------|
| `pi-skills/` | Canonical skills source: `SKILL.md`, references, evals, trigger sets, scripts, tests |
| `skills/` | Symlinked install surface for the open `skills` CLI |
| `pi-mono/` | Local clone used as the source corpus when developing or verifying this repo |
| `docs/` | Repo docs for corpus layout, grading needles, and related workflows |
| `.claude-plugin/` | Claude Code plugin manifest for loading the repo as a plugin |

Read [docs/working-with-pi-mono.md](docs/working-with-pi-mono.md) before editing anything substantial. It explains the clone layout, corpus pinning, and where upstream Pi docs actually live.

## Install

### Open Skills CLI

Use the repo as a skills bundle from GitHub:

```bash
# Install all skills
npx skills add romiluz13/pi-agent-skills -a pi -y

# Inspect what the bundle exports
npx skills add romiluz13/pi-agent-skills --list

# Install a single skill
npx skills add https://github.com/romiluz13/pi-agent-skills/tree/main/skills/pi-cli-workspace -a pi -y
```

### Claude Code Plugin

The repo also ships a `.claude-plugin/plugin.json` manifest.

```bash
claude --plugin-dir /path/to/pi-agent-skills
```

That exposes the skills under the `pi-skill:` namespace, for example:

```text
/pi-skill:pi-cli-workspace
/pi-skill:pi-extension-authoring
/pi-skill:pi-ai-library
```

### Manual Pi Install

Pi can also load the skills directly from `package.json` `pi.skills`, or from copied / symlinked skill directories under `~/.pi/agent/skills/`.

Optional Cursor symlinks:

```bash
SKILLS="$PWD/pi-skills"
for d in pi-cli-workspace pi-extension-authoring pi-package-authoring pi-ai-library pi-agent-embedding pi-web-ui pi-rpc-sdk pi-tui pi-mom pi-pods pi-customization; do
  ln -sf "$SKILLS/$d" "$HOME/.cursor/skills/$d"
done
```

## Verify

```bash
cd pi-skills && npm run verify-skills
cd pi-skills && npm run ci
```

`verify-skills` runs the static repo gates: corpus paths, corpus pin, frontmatter, eval shape, pack sync, graded-needle derivation, graded-response checks, trigger-set validation, and more.

`npm run ci` adds the checked-in unit tests and regrades all baselines before running the same verification stack.

When you change eval definitions:

```bash
cd pi-skills
npm run sync-evals
npm run grade-graded-examples
```

## Local Development

This repo does **not** vendor `pi-mono` in Git. For local development, clone `pi-mono` into `./pi-mono` next to `pi-skills/`.

```bash
git clone https://github.com/romiluz13/pi-agent-skills.git
cd pi-agent-skills
git clone https://github.com/badlogic/pi-mono.git pi-mono
cd pi-mono && npm install && npm run build && cd ..
cd pi-skills && npm run verify-skills
```

When you intentionally move the corpus pin:

```bash
cd pi-skills
npm run bump-corpus
npm run verify-skills
npm run sync-evals
```

## Why this repo is useful to developers

This repo is not trying to be a second set of docs for Pi.

It is a developer toolchain for trustworthy answers about Pi:

- package-specific entry points instead of “search the monorepo and hope”
- skills that can explain behavior from source, docs, and examples together
- machine-checked evals that keep those skills honest over time

If you already work in Pi, that means less spelunking and fewer wrong answers. If you maintain Pi-related tooling, it means you can reuse the same grounded corpus in Pi, Claude Code, or any workflow that can consume skills.

## Further Reading

- [docs/working-with-pi-mono.md](docs/working-with-pi-mono.md)
- [pi-skills/README.md](pi-skills/README.md)
- [pi-skills/docs/skill-creator-workspace.md](pi-skills/docs/skill-creator-workspace.md)
- [docs/needle-rules.md](docs/needle-rules.md)
