# Skill name collision (grounded answer)

Pi resolves duplicate **skill names** by keeping the **first** registration and emitting a collision diagnostic for the loser (`skillMap` in `loadSkills`). See `pi-mono/packages/coding-agent/src/core/skills.ts`.

## Path merge order (before `loadSkills`)

`DefaultResourceLoader.reload()` builds `skillPaths` as:

`mergePaths([...cliEnabledSkills, ...enabledSkills], additionalSkillPaths)`

So **CLI / temporary extension skill paths come first**, then package-manager `enabledSkills` (sorted by metadata precedence), then `additionalSkillPaths`. See `pi-mono/packages/coding-agent/src/core/resource-loader.ts`.

`enabledSkills` entries are sorted using `resourcePrecedenceRank` in `pi-mono/packages/coding-agent/src/core/package-manager.ts` (lower rank = earlier in the list: project-local auto paths before user auto paths before package-origin resources).

## Your scenario (~/.pi vs `.pi/skills`)

Both paths are discovered via the package manager and sorted by that rank. **Whichever skill file is processed first in the merged `skillPaths` array wins the name.** The other path’s file still loads as a candidate but **loses on duplicate `name`** with a collision warning. Exact ordering for your machine depends on whether entries are project-scoped vs user-scoped and CLI `--skill` flags (CLI wins earliest slot).

**Sources to read in full:** `pi-mono/packages/coding-agent/src/core/resource-loader.ts`, `pi-mono/packages/coding-agent/src/core/package-manager.ts`, `pi-mono/packages/coding-agent/src/core/skills.ts`.
