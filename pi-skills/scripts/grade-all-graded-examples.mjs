#!/usr/bin/env node
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { listGradedExampleIds, gradedExamplesRoot } from "./list-graded-example-dirs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GRADER = join(__dirname, "grade-assertions.mjs");

const ids = listGradedExampleIds();
if (!ids.length) {
	console.error("grade-all-graded-examples: no directories with assertions.json under evals/graded-examples/");
	process.exit(1);
}

let failed = false;
for (const id of ids) {
	const base = join(gradedExamplesRoot(), id);
	const response = join(base, "with_skill", "response.md");
	const assertions = join(base, "assertions.json");
	const out = join(base, "with_skill", "grading.json");
	if (!existsSync(response)) {
		console.error(`grade-all-graded-examples: missing ${id}/with_skill/response.md`);
		failed = true;
		continue;
	}
	const r = spawnSync(process.execPath, [GRADER, "--response", response, "--assertions", assertions, "--out", out], {
		stdio: "inherit",
	});
	if (r.status !== 0) failed = true;
}
process.exit(failed ? 1 : 0);
