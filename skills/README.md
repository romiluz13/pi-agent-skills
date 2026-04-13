# `skills/` (Open Skills CLI)

This folder follows the same layout as [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills): **one directory per skill** with a `SKILL.md`, so the [open `skills` CLI](https://github.com/vercel-labs/skills) can install from GitHub with:

```bash
npx skills add <your-github>/pi-skill -a pi
```

Canonical trees (evals, `references/`, CI) live under [`pi-skills/`](../pi-skills/). Each entry here is a **symlink** to the matching `pi-skills/pi-*` directory. **`pi-skills/package.json`** → **`pi.skills`** is the source of truth; CI checks that this layout stays aligned.
