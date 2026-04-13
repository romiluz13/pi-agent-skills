#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const scripts = [
	"verify-corpus-paths.mjs",
	"verify-docs-root-corpus.mjs",
	"verify-pi-mono-rev-format.mjs",
	"verify-package-pi-skills.mjs",
	"verify-open-skills-layout.mjs",
	"verify-corpus-pin.mjs",
	"verify-all-evals-shape.mjs",
	"verify-eval-paths.mjs",
	"verify-unique-eval-ids.mjs",
	"verify-packs-in-sync.mjs",
	"verify-frontmatter.mjs",
	"verify-api-allowlist-unique.mjs",
	"verify-api-mentions.mjs",
	"verify-graded-snapshots.mjs",
	"verify-graded-response-corpus.mjs",
	"verify-eval-artifacts.mjs",
	"verify-graded-needles.mjs",
	"verify-graded-needles-in-response.mjs",
	"verify-trigger-evals.mjs",
];

for (const s of scripts) {
	const r = spawnSync(process.execPath, [join(__dirname, s)], { stdio: "inherit" });
	if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log("verify-skills: all gates passed");
