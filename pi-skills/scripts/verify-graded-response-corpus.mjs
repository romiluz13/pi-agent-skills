#!/usr/bin/env node
/**
 * Every pi-mono/ path cited in graded with_skill/response.md must exist (same rules as skill markdown).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listGradedExampleIds, gradedExamplesRoot } from "./list-graded-example-dirs.mjs";
import { extractPiMonoPaths } from "./pi-mono-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const PI_MONO = join(REPO_ROOT, "pi-mono");

const errors = [];
for (const id of listGradedExampleIds()) {
	const responsePath = join(gradedExamplesRoot(), id, "with_skill", "response.md");
	if (!existsSync(responsePath)) continue;
	const content = readFileSync(responsePath, "utf8");
	for (const rel of extractPiMonoPaths(content)) {
		const abs = join(REPO_ROOT, rel);
		if (!existsSync(abs)) {
			errors.push(`Missing: ${rel} (from graded-examples/${id}/with_skill/response.md)`);
		}
	}
}

if (!existsSync(PI_MONO)) {
	errors.push("pi-mono/ directory missing at repo root");
}

if (errors.length) {
	console.error("verify-graded-response-corpus failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-graded-response-corpus: OK");
