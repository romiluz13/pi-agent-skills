---
name: pi-ai-library
description: @mariozechner/pi-ai — unified LLM streaming API, tools, providers, thinking events, and cross-provider handoffs as implemented in pi-mono. Use when integrating or debugging pi-ai, adding providers, using stream/complete, TypeBox tools, or token usage. Use for "pi-ai stream", "getModel", "new provider in pi", even if the user only says OpenRouter or Anthropic APIs.
compatibility: TypeScript consumer of @mariozechner/pi-ai; read pi-mono/packages/ai for APIs referenced in this skill.
---

# Pi AI library (`@mariozechner/pi-ai`)

## Grounding

1. `pi-mono/packages/ai/README.md` — primary API surface, providers list, examples.
2. `pi-mono/AGENTS.md` — section **Adding a New LLM Provider (packages/ai)** (file checklist: `types.ts`, `providers/`, `register-builtins.ts`, tests, coding-agent touchpoints).
3. `pi-mono/packages/ai/src/` — read only the specific provider or type files needed after narrowing via README.

## Invariants

- Library scope is **tool-capable models** — stated in `pi-mono/packages/ai/README.md` opening note.
- Provider work spans multiple files — follow `pi-mono/AGENTS.md` checklist verbatim when changing `pi-mono`.

## Workflows

- **Call pattern**: Use README Quick Start for `stream` / `complete` / `Context` / `Tool` shapes; cite line ranges by re-reading the file, do not paraphrase signatures from memory.
- **New provider**: Execute the AGENTS.md checklist in order; link each step to the listed paths.

## Anti-patterns

- Do not document providers that appear only in other products; enumerate from `pi-mono/packages/ai/README.md` **Supported Providers** section.
