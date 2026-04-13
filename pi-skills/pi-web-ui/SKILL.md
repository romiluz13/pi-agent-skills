---
name: pi-web-ui
description: @mariozechner/pi-web-ui — Lit web components for chat UIs, ChatPanel, IndexedDB storage stores, artifacts, tools shipped with web-ui. Use when embedding Pi AI/agent in a browser app or debugging web-ui storage, ChatPanel setup, or example app. Use for "pi web chat component", "ChatPanel", "IndexedDBStorageBackend", even if pi-coding-agent CLI is unrelated.
compatibility: Browser or bundler targeting web components; read pi-mono/packages/web-ui for component APIs in this skill.
---

# Pi web UI (`@mariozechner/pi-web-ui`)

## Grounding

1. `pi-mono/packages/web-ui/README.md` — features, installation, Quick Start snippet, APIs referenced there.
2. `pi-mono/packages/web-ui/example/` — runnable minimal app (`README.md`, `package.json`, entry source).
3. Supporting libraries: `pi-mono/packages/ai/README.md` and `pi-mono/packages/agent/README.md` when wiring model + Agent as shown in web-ui README.

## Invariants

- README documents stack (mini-lit, Tailwind v4) and integration shape; do not substitute other component frameworks without explicit user request and README cross-check.

## Workflows

- **Bootstrap**: Follow README Quick Start imports (`ChatPanel`, storage stores, `setAppStorage`, `defaultConvertToLlm`) exactly as in `pi-mono/packages/web-ui/README.md`.
- **Compare to CLI**: CLI behavior lives in `pi-coding-agent`; browser concerns stay in web-ui README — cite both paths when contrasting.

## Anti-patterns

- Do not invent artifact or tool names not listed in `pi-mono/packages/web-ui/README.md` without opening `pi-mono/packages/web-ui/src/tools/` for the specific renderer.
