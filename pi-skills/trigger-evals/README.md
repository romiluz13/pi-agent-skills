# Trigger evaluation sets

One JSON array per skill (`<skill-name>.json`). Each entry:

```json
{ "query": "natural user text", "should_trigger": true }
```

- **10** `should_trigger: true` and **10** `should_trigger: false` per file (near-miss negatives).
- Use with skill-creator **`python -m scripts.run_loop`** (description optimization). Full steps: **[`docs/skill-creator-workspace.md`](../docs/skill-creator-workspace.md)** § *Description optimization*.

**Review queries before `run_loop`:** skill-creator ships **`assets/eval_review.html`** — paste your JSON, edit toggles, export `eval_set.json` (see skill-creator `SKILL.md` *Description Optimization*). Merge or slice here if you batch-edit labels before running the loop.
