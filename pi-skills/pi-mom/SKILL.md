---
name: pi-mom
description: @mariozechner/pi-mom — Slack bot Master Of Mischief (Mom), self-managing agent, Docker sandbox, and events system. Use when setting up Mom in Slack, debugging data/ workspace issues, managing context.jsonl/log.jsonl memory, or creating periodic/immediate events. Use for "mom slack bot", "docker sandbox", "mom events", "artifacts server", "cloudflare tunnel", "custom tools", "MomCustomTool", "multi-platform", "v86 sandbox", even if pi-coding-agent is not mentioned.
compatibility: Node.js/Docker host environment; read pi-mono/packages/mom/README.md for core architecture.
---

# Pi Mom (Master Of Mischief)

## Grounding

1. `pi-mono/packages/mom/README.md` — features, workspace setup, memory structure (`log.jsonl` vs `context.jsonl`), Events system.
2. `pi-mono/packages/mom/docs/events.md` — detailed event JSON schema and usage.
3. `pi-mono/packages/mom/docs/sandbox.md` — Docker vs host mode security isolation details.
4. `pi-mono/packages/mom/docs/slack-bot-minimal-guide.md` — Slack app manifest and permissions.
5. `pi-mono/packages/mom/docs/artifacts-server.md` — Express+WebSocket artifacts server, Cloudflare Tunnel for public HTTPS, file watching with chokidar, live reload, path traversal protection, date-prefixed artifact organization.
6. `pi-mono/packages/mom/docs/new.md` — Multi-platform redesign: PlatformAdapter interface (Slack/Discord/CLI adapters), MomCustomTool interface with `invoke_tool` dispatch, bubblewrap channel isolation, unified ChannelMessage format, per-adapter config.
7. `pi-mono/packages/mom/docs/v86.md` — v86 x86 emulator sandbox evaluation: Alpine Linux in WebAssembly, 9p filesystem for host-guest exchange, state save/restore (~2s), outbound networking.

## Invariants

- **Dual-File History**: `log.jsonl` is the source of truth (append-only); `context.jsonl` is the compacted view sent to the LLM.
- **Workspace Isolation**: Mom runs on the host by default (no isolation). Docker mode (`--sandbox=docker:<name>`) is recommended for security — it isolates tool execution to a container where only the `data/` directory is mounted to `/workspace`.
- **Event Limits**: A maximum of 5 events can be queued per channel. Events use unique filenames to avoid overwrites.
- **Artifacts Server**: Runs Express on port 8080 with Cloudflare Tunnel for public URLs; file watching is recursive via chokidar; WebSocket live reload via `?ws=true` parameter — `pi-mono/packages/mom/docs/artifacts-server.md`.
- **Multi-Platform Design**: Design doc defines `PlatformAdapter` interface (`start`, `stop`, `getChannels`, `sendMessage`, etc.), planned adapters (Slack, Discord, CLI), `MomCustomTool` interface for host-side tool execution via `invoke_tool`, and bubblewrap per-channel isolation — `pi-mono/packages/mom/docs/new.md`.
- **Custom Tool Discovery**: Custom tools are discovered from `data/tools/**/index.ts` (workspace-local) and `~/.pi/mom/tools/**/index.ts` (global), loaded via `jiti` — `pi-mono/packages/mom/docs/new.md`.

## Workflows

- **Create Skill**: Add a `SKILL.md` file and scripts to `/workspace/skills/` (global) or `/workspace/<channel>/skills/` (channel-specific).
- **Schedule Task**: Write a JSON event file to `data/events/` (type: immediate, one-shot, or periodic).
- **Compaction**: When context exceeds limits, older messages are summarized into a compaction event.
- **Serve artifacts**: Read `docs/artifacts-server.md` for Express+Tunnel setup and `start-server.sh` bootstrap.
- **Custom host-side tools**: Read `docs/new.md` MomCustomTool section for factory pattern, ToolAPI, and tool discovery paths.

## Anti-patterns

- Do not suggest manual dependency installation on the host; Mom self-manages and installs her own tools (e.g., `apk add`, `brew install`) within her sandbox.
- Avoid using Host mode unless explicitly requested due to security risks. Use `docker` mode.
