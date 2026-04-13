---
name: pi-agent-embedding
description: @mariozechner/pi-agent-core Agent runtime — message flow, tool execution modes, event sequence for prompt() and continue(), embedding in apps. Use when building on Agent class, wiring subscribers, or debugging tool loops beside pi-ai. Use for "pi agent events", "beforeToolCall", "agent.subscribe", even if coding-agent CLI is not involved.
compatibility: TypeScript consumer of @mariozechner/pi-agent-core; read pi-mono/packages/agent for runtime behavior cited here.
---

# Pi agent embedding (`@mariozechner/pi-agent-core`)

## Grounding

1. `pi-mono/packages/agent/README.md` — Agent options, event tables, tool parallel vs sequential, `convertToLlm` / `transformContext` flow diagram.
2. `pi-mono/packages/coding-agent/examples/sdk/` — integration patterns (`README.md` index + numbered examples).
3. `pi-mono/packages/coding-agent/docs/sdk.md` — higher-level SDK documentation when present.

## Invariants

- Event ordering and barrier behavior (`message_end` before tool preflight) are specified in `pi-mono/packages/agent/README.md`; cite that file instead of restating from memory.

## Workflows

- **Pick integration depth**: README Quick Start vs full `examples/sdk/` depending on user needs; always point to concrete example filenames under `pi-mono/packages/coding-agent/examples/sdk/`.

## Anti-patterns

- Do not merge pi-coding-agent session semantics with core `Agent` without reading `agent-session.ts` when the question is about the CLI harness specifically — route CLI questions to `pi-cli-workspace` after citing boundaries from READMEs.
