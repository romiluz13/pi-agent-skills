#!/usr/bin/env node
/**
 * Each graded baseline `with_skill/response.md` must contain every substring in that dir's assertions.json
 * (same strings the grader uses).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { listGradedExampleIds, gradedExamplesRoot } from "./list-graded-example-dirs.mjs";

const errors = [];

for (const id of listGradedExampleIds()) {
	const root = gradedExamplesRoot();
	const assertionsPath = join(root, id, "assertions.json");
	const respPath = join(root, id, "with_skill", "response.md");
	if (!existsSync(respPath)) {
		errors.push(`${id}: missing with_skill/response.md`);
		continue;
	}
	let needles;
	try {
		needles = JSON.parse(readFileSync(assertionsPath, "utf8"));
	} catch (e) {
		errors.push(`${id}: ${e.message}`);
		continue;
	}
	if (!Array.isArray(needles)) {
		errors.push(`${id}: assertions.json must be an array`);
		continue;
	}
	const response = readFileSync(respPath, "utf8");
	for (let i = 0; i < needles.length; i++) {
		const n = needles[i];
		if (typeof n !== "string") {
			errors.push(`${id}: assertions[${i}] must be a string`);
			continue;
		}
		if (!response.includes(n)) {
			errors.push(`${id}: response.md missing needle ${i}: ${JSON.stringify(n)}`);
		}
	}
}

if (errors.length) {
	console.error("verify-graded-needles-in-response failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-graded-needles-in-response: OK");
