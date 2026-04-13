---
name: pi-tui
description: @mariozechner/pi-tui — Minimal terminal UI framework with differential rendering, CSI 2026 synchronized output, and Component interfaces. Use when building or debugging terminal interfaces, TUI components, Editor, Markdown, SelectList, or handling input and ANSI widths. Use for "differential rendering", "matchesKey", "Focusable IME", even if pi-coding-agent is not mentioned.
compatibility: TypeScript/Node; read pi-mono/packages/tui/README.md for APIs referenced here.
---

# Pi TUI library (`@mariozechner/pi-tui`)

## Grounding

1. `pi-mono/packages/tui/README.md` — core TUI concepts, Overlays, Component interface, Focusable IME, Built-in Components, and Differential Rendering.
2. `pi-mono/packages/coding-agent/docs/tui.md` — agent-specific TUI component usage (if applicable).
3. `pi-mono/packages/tui/src/` — read specific component implementations when needing deeper context.

## Invariants

- **Synchronized Output**: Uses CSI 2026 for atomic screen updates. Do not attempt to bypass differential rendering with raw `console.log` when the TUI is active.
- **Component Interface**: Each line returned by `render(width)` MUST NOT exceed the `width` parameter; use `truncateToWidth` or `wrapTextWithAnsi`.
- **IME Support**: Components needing text input (cursors) must implement the `Focusable` interface to position the hardware cursor correctly.

## Workflows

- **Custom Component**: Implement `Component` interface (`render`, `handleInput`, `invalidate`). Check width constraints explicitly.
- **Overlays**: Use `tui.showOverlay(component, options)` for floating UI elements like dialogs, menus, or alerts.
- **Key Detection**: Use `matchesKey(data, Key.xxx)` for keyboard input detection instead of manual string matching.

## Anti-patterns

- Do not use generic string length for text formatting; always use `visibleWidth` and `truncateToWidth` to account for ANSI escape codes properly.
- Do not clear the screen manually; let the differential rendering strategies handle updates.
