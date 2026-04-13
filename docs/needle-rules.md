# Grading needles: from human assertions to machine checks

Substring grading (`scripts/grade-assertions.mjs`) is dumb on purpose: each **needle** must appear literally in the model response. This doc explains how `**evals/all-evals.json`** assertions become `**evals/graded-examples/<id>/assertions.json**` and how to extend the rules safely.

## Pipeline

1. Authors write **human-readable** assertions in `**all-evals.json`** (often “Mentions …” plus a real **pi-mono/** file path and protocol tokens).
2. `**scripts/extract-grade-assertions.mjs`** (and `**scaffold-graded-example**`) call `**machineFromAssertions()**` in `**scripts/grade-needles.mjs**`.
3. The JSON array is saved as `**assertions.json**` and checked by `**verify-graded-needles.mjs**` (must match a fresh derivation from `**all-evals.json**` — no hand-edited drift).
4. `**grade-assertions.mjs**` checks each needle with `response.includes(needle)`.

## What `machineFromAssertions` extracts today

For each assertion string `s`:


| Pattern                                            | Needle added                              | Example assertion (human line in all-evals)                                                |
| -------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| Substrings matching `**pi-mono/**` + path segments | Full path (trailing punctuation stripped) | Mentions **packages/coding-agent/docs/rpc.md** with the usual repo prefix (see real evals) |
| Whole line `U+NNNN` (hex)                          | Same token                                | `U+2028`                                                                                   |
| Whole line digits, length ≤ 3                      | Same digits                               | `4`                                                                                        |
| Whole line exact token in allowlist                | Same token                                | `matchesKey`, `render(width)`, `--vllm`, `no documented include directive`                |
| Contains `read tool` (case-insensitive)            | `read tool`                               | `Mentions read tool`                                                                       |
| Contains `packages/ai` and no `pi-mono`            | `packages/ai`                             | Second assertion on provider checklist                                                     |
| Contains `agent-session.ts` and no `pi-mono`       | `agent-session.ts`                        | RPC eval pointing at TS file                                                               |


Order is deterministic: first occurrence of each needle wins (Set dedupes).

## Adding a new non-path token

If a new eval needs a mandatory substring that is **not** a monorepo path (e.g. a function name or protocol keyword):

1. Prefer putting it as its **own** assertion line in `**all-evals.json`** so reviewers see it.
2. Extend `**machineFromAssertions**` in `**scripts/grade-needles.mjs**` with a **narrow** condition (avoid broad substrings that false-positive in other evals). Prefer an **exact whole-line token allowlist** for literals like `matchesKey`, `showOverlay`, `--vllm`, or `no documented include directive`.
3. Run `**npm run scaffold-graded-example -- --id <id> --force`** or manually align `**assertions.json**`, then `**npm run ci**`.

## Path extraction everywhere

`**scripts/pi-mono-paths.mjs**` exports `**extractPiMonoPaths(markdown)**` — the same rules as skill corpus verification:

- Backticks around a full repo-relative path (prefix **pi-mono/** plus segments).
- Markdown links with target **pi-mono/**….
- Bare tokens: word boundary + **pi-mono/** + path characters (see script; every match must resolve on disk in CI).

Used by `**verify-corpus-paths`**, `**verify-graded-response-corpus**`, `**verify-docs-root-corpus**`.

## Common pitfalls

- **Backticks inside needles:** ``read` tool` does not contain the substring `read tool`. Use plain **read tool** in the graded response if the needle is `read tool`.
- **OR prose in one assertion:** e.g. “extendResources or mergePaths” — only path-shaped tokens are extracted unless you split into separate assertions or extend `**grade-needles.mjs`**.
- **Grading is substring, not semantic:** A needle `**4`** matches inside `**40**` — keep context in the answer or use a more specific needle if that bites.

## Related scripts


| Script                              | Role                                      |
| ----------------------------------- | ----------------------------------------- |
| `**grade-needles.mjs**`             | `machineFromAssertions`                   |
| `**extract-grade-assertions.mjs**`  | CLI `--id` / `--out`                      |
| `**verify-graded-needles.mjs**`     | `assertions.json` === derive(`all-evals`) |
| `**grade-assertions.mjs**`          | Write `**grading.json**`                  |
| `**grade-all-graded-examples.mjs**` | Batch regrade                             |
