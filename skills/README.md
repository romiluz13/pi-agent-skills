# `skills/`

This directory is the install surface for the open `skills` CLI.

It follows the same layout as [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills): one directory per skill, each with a `SKILL.md`.

That lets the [open `skills` CLI](https://github.com/vercel-labs/skills) install the repo from GitHub with:

```bash
npx skills add <your-github>/pi-skill -a pi
```

The canonical source lives under [`pi-skills/`](../pi-skills/). Each entry here is a symlink to the matching `pi-skills/pi-*` directory.

`pi-skills/package.json` `pi.skills` is the source of truth. CI checks that this directory stays aligned with that manifest.
