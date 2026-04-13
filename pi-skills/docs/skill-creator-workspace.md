# Pi skills × skill-creator playbook

This document maps **[Anthropic skill-creator](https://github.com/anthropics/claude-plugins-official)** (the “draft → parallel evals → grade → viewer → iterate → description optimization” loop) onto **this repo**. Read it when you want “skill-creator coverage” without guessing how `pi-skills/` differs from a vanilla skill folder.

**Repo-specific guardrails (on top of skill-creator):** every `pi-mono/...` citation in skills and evals must exist on disk; `npm run verify-skills` enforces that, plus frontmatter, API allowlist, and checked-in graded snapshots. See **[`docs/working-with-pi-mono.md`](../../docs/working-with-pi-mono.md)** and root **`AGENTS.md`**.

---

## 1. Resolve paths on your machine

| What | Typical location | Notes |
|------|------------------|--------|
| **skill-creator plugin** | e.g. `~/.claude/plugins/cache/claude-plugins-official/skill-creator/unknown/` | Version folder may differ; find `eval-viewer/generate_review.py` and `scripts/`. |
| **This repo** | `.../pi-skill/` | Contains `pi-skills/` and `pi-mono/`. |
| **Iteration outputs** | `pi-skill/pi-skills-workspace/` | **Gitignored.** Sibling to `pi-skills/` per skill-creator habit. |

Set shell variables once per session:

```bash
export PI_SKILL_ROOT="/absolute/path/to/pi-skill"
export SKILL_CREATOR="/absolute/path/to/skill-creator" # directory that contains eval-viewer/ and scripts/
```

---

## 2. skill-creator phases → what you do here

### A. Capture intent and draft `SKILL.md`

- Follow skill-creator guidance: **name**, **description** (primary trigger signal — make it specific and slightly “pushy” per skill-creator), **compatibility**, body with progressive disclosure.
- **This repo:** each skill lives under `pi-skills/pi-*/`; optional depth in `references/*.md`.
- After edits: `cd pi-skills && npm run verify-skills` (corpus paths, pin, frontmatter including **compatibility**, API allowlist).

### B. Test prompts (eval set)

**Canonical catalog (review + CI):** `pi-skills/evals/all-evals.json` — structured by skill; paths in assertions are validated. After changes: `npm run sync-evals`.

**skill-creator iteration runs:** you still use a **workspace** layout under `pi-skills-workspace/iteration-N/` so `generate_review.py` and `aggregate_benchmark` have a home. Prompts can mirror `all-evals.json` ids or be experimental; once stable, promote into `all-evals.json`.

### C. Spawn parallel runs (same turn — skill-creator rule)

For each eval, launch **two** runs together:

1. **With skill:** skill path = `pi-skills/<skill-name>/`; save primary model output to   `pi-skills-workspace/iteration-N/<eval_id>/with_skill/outputs/` (e.g. `response.md`).
2. **Baseline:** **new skill** → `without_skill/` (no skill). **Improving a skill** → snapshot the previous skill into the workspace and point baseline at **`old_skill/`** (see skill-creator SKILL.md).

Each eval directory should include **`eval_metadata.json`** (`eval_id`, `eval_name`, `prompt`, `assertions` — can start empty, then fill).

**Timing:** when your environment delivers `total_tokens` / `duration_ms` per run, write **`timing.json`** next to that run (skill-creator Step 3). Pi tooling does not generate this automatically.

### D. Draft assertions (while runs execute)

- Prefer **objective** checks: literal substrings such as `pi-mono/packages/...`, tokens like `U+2028`, filenames like `agent-session.ts`.
- **Machine needles from `all-evals.json`:**
  `cd pi-skills && npm run extract-grade-assertions -- --id <eval_id> [--out assertions.json]`
- **Human prose** (“Mentions …”) is fine in `all-evals.json` for reviewers; **graders** need literals — see **`evals/README.md`**.

### E. Grade runs

**Programmatic (fast, reproducible):**

```bash
cd pi-skills
node scripts/grade-assertions.mjs \
  --response ../pi-skills-workspace/iteration-1/<eval_id>/with_skill/outputs/response.md \
  --assertions path/to/assertions.json \
  --out ../pi-skills-workspace/iteration-1/<eval_id>/with_skill/grading.json
```

**Schema:** `grading.json` must use **`expectations: [{ "text", "passed", "evidence" }]`** — required by skill-creator’s viewer.

**Optional:** skill-creator’s grader subagent + `agents/grader.md` for subjective checks.

**Checked-in baselines:** `evals/graded-examples/*` mirror the same shape; repo CI verifies they stay aligned via **`verify-graded-snapshots.mjs`**. After changing assertions there, run `npm run grade-graded-examples`.

### F. Aggregate benchmark

From the **skill-creator** `scripts/` package (your install):

```bash
cd "$SKILL_CREATOR"
python -m scripts.aggregate_benchmark "$PI_SKILL_ROOT/pi-skills-workspace/iteration-1" --skill-name pi-cli-workspace
```

Produces `benchmark.json` / `benchmark.md`. Put **with_skill** before **baseline** pairs per skill-creator.

### G. Launch the eval viewer

```bash
python "$SKILL_CREATOR/eval-viewer/generate_review.py" \
  "$PI_SKILL_ROOT/pi-skills-workspace/iteration-1" \
  --skill-name "pi-cli-workspace" \
  --benchmark "$PI_SKILL_ROOT/pi-skills-workspace/iteration-1/benchmark.json"
```

- **Iteration 2+:** add `--previous-workspace "$PI_SKILL_ROOT/pi-skills-workspace/iteration-<N-1>"`.
- **No browser:** `--static /path/to/review.html` (Cowork / headless); user downloads **`feedback.json`** from the static flow.

skill-creator: **generate the viewer before** you-only critique outputs — get human eyes on results first.

### H. Read feedback and improve

- Load **`feedback.json`** from the workspace (or Downloads in static mode).
- Revise **`SKILL.md`** (and references); re-run **`npm run verify-skills`** if corpus paths or frontmatter changed.
- Start **`iteration-(N+1)`** with fresh parallel runs and baselines as skill-creator describes.

### I. Description optimization (trigger tuning)

1. **Trigger sets:** `pi-skills/trigger-evals/<skill-name>.json` — 10× should / 10× should-not (near-miss negatives). See **`trigger-evals/README.md`**.
2. **Human review of queries:** skill-creator **`assets/eval_review.html`** — fill placeholders, export `eval_set.json` (see skill-creator SKILL.md).
3. **Loop (Claude Code, `claude -p`):**

```bash
cd "$SKILL_CREATOR"
python -m scripts.run_loop \
  --eval-set "$PI_SKILL_ROOT/pi-skills/trigger-evals/pi-cli-workspace.json" \
  --skill-path "$PI_SKILL_ROOT/pi-skills/pi-cli-workspace" \
  --model <model-id-for-this-session> \
  --max-iterations 5 \
  --verbose
```

4. Apply **`best_description`** to frontmatter; re-run **`npm run verify-skills`**.

---

## 3. Layout reference

```
pi-skill/
  pi-skills-workspace/          # gitignored
    iteration-1/
      <eval_id>/
        eval_metadata.json
        with_skill/outputs/response.md
        with_skill/grading.json
        with_skill/timing.json          # optional; from task metadata
        without_skill/outputs/...
        without_skill/grading.json
      benchmark.json
      benchmark.md
      feedback.json                   # after user submits reviews
  pi-skills/
    pi-*/
    evals/ all-evals.json graded-examples/ ...
    trigger-evals/
    docs/skill-creator-workspace.md  # this file
```

---

## 4. Environment shortcuts (from skill-creator)

| Environment | Parallel subagents | Viewer | Baseline | `run_loop` |
|-------------|-------------------|--------|----------|------------|
| Claude Code | Yes | `generate_review.py` | Yes | Yes (`claude -p`) |
| Claude.ai | No — run sequentially | Inline in chat or save files | Skip | Skip |
| Cowork | Yes (or serial if flaky) | `--static` HTML | Yes | Yes |

---

## 5. End-to-end checklist

- [ ] `pi-mono/` present; **`docs/working-with-pi-mono.md`** understood.
- [ ] Draft **`SKILL.md`** + **`npm run verify-skills`** green.
- [ ] Eval prompts in **`all-evals.json`** (and **`npm run sync-evals`**).
- [ ] **`pi-skills-workspace/iteration-N/`** with parallel **with_skill** + **without_skill** (or **old_skill**).
- [ ] **`eval_metadata.json`** per eval; **assertions** as path literals for grading.
- [ ] **`grading.json`** uses **`text` / `passed` / `evidence`**.
- [ ] **`aggregate_benchmark`** → **`benchmark.json`**.
- [ ] **`generate_review.py`** opened for human review → **`feedback.json`** ingested.
- [ ] Skill revised; repeat iteration or promote to **`evals/graded-examples`** if you want CI-backed baselines.
- [ ] **Trigger evals** reviewed → **`run_loop`** → update **description** in frontmatter.

**Repo helper:** `cd pi-skills && npm run scaffold-graded-example -- --id <eval_id>` seeds `evals/graded-examples/<id>/` from `all-evals.json` (needles + metadata). CI runs **`npm run ci`** (regrade all baselines, then **`verify-skills`**).

---

## 6. Where to read more

- **skill-creator** (full process, grader/analyzer/comparator agents, schemas): plugin **`SKILL.md`** and **`references/schemas.md`**.
- **Pi corpus pins and bump:** root **`README.md`**, **`npm run bump-corpus`**.
- **Eval pack format:** **`evals/README.md`**.
