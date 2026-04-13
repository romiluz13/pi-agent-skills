---
name: pi-customization
description: Pi coding agent customization — Themes, Keybindings, Prompt Templates, and Settings. Use when configuring or modifying the visual appearance, UI colors, keyboard shortcuts, or default prompt behavior of the pi terminal agent. Use for "custom theme pi", "change keybindings", "modify system prompt", "settings.json", "keybindings.json", "prompt template", even if pi-cli-workspace is already active.
compatibility: Configuration files for pi agent; read pi-mono/packages/coding-agent/docs for specific feature documentation.
---

# Pi Customization

## Grounding

1. `pi-mono/packages/coding-agent/docs/themes.md` — theme JSON format (`name`, optional `vars`, required 51 `colors` tokens), locations (`~/.pi/agent/themes/*.json`, `.pi/themes/*.json`, packages, settings, CLI `--theme`), hot reload, color value formats.
2. `pi-mono/packages/coding-agent/docs/keybindings.md` — customization via `~/.pi/agent/keybindings.json`, namespaced action IDs (`tui.input.submit`, `tui.editor.cursorUp`, `app.interrupt`, etc.), key format (`modifier+key`), full action tables.
3. `pi-mono/packages/coding-agent/docs/prompt-templates.md` — Markdown snippets invoked via `/name`, locations (`~/.pi/agent/prompts/*.md`, `.pi/prompts/*.md`, packages), positional arguments (`$1`, `$2`, `$@`, `${@:N}`), YAML frontmatter with optional `description`.
4. `pi-mono/packages/coding-agent/docs/settings.md` — the overall `settings.json` structure for tying these together.

## Invariants

- **Theme Format**: Themes define `name` (required, unique), optional `vars` for reusable color aliases, and all 51 `colors` tokens. There is no `type`, `ui`, `syntax`, or `borders` top-level key — everything is under `colors`. Loaded from `~/.pi/agent/themes/*.json` (global) and `.pi/themes/*.json` (project).
- **Keybinding Config**: Keybindings are configured in `~/.pi/agent/keybindings.json` (not `settings.json`). IDs are namespaced: `tui.input.submit` (submit), `tui.editor.cursorUp`, `app.interrupt`, etc. Run `/reload` to apply changes without restarting.
- **Prompt Template Arguments**: Templates use `$1`, `$2`, `$@`, `${@:N}` positional syntax — not `{variable}` or `<include>`. The filename (minus `.md`) becomes the `/name` command.

## Workflows

- **Create a Theme**: Copy `dark.json` from `packages/coding-agent/src/modes/interactive/theme/`, customize color values under the `colors` key, place it in `~/.pi/agent/themes/`, and select via `/settings` or `pi --theme <name>`.
- **Override Keys**: Create or edit `~/.pi/agent/keybindings.json` mapping action IDs to key arrays (e.g., `"tui.input.submit": ["ctrl+enter"]`). Run `/reload` to apply.
- **Create a Prompt Template**: Write a `.md` file in `~/.pi/agent/prompts/` with optional YAML frontmatter (`description`); use `$1`, `$@` for arguments. Invoke with `/filename` in the editor.

## Anti-patterns

- Do not hardcode keybindings into agent component source code — use the configurable namespaces from `keybindings.md`.
- Do not put keybindings in `settings.json` — keybindings have their own file (`~/.pi/agent/keybindings.json`).
- Do not use `{variable}` or `<include src="...">` syntax in prompt templates — the actual syntax is `$1`, `$@`, `${@:N}`.
