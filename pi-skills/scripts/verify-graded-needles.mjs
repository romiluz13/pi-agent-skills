#!/usr/bin/env node
/**
 * graded-examples/<id>/assertions.json must equal machine needles from all-evals assertions * (same derivation as extract-grade-assertions.mjs).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { machineFromAssertions } from "./grade-needles.mjs";
import { listGradedExampleIds, gradedExamplesRoot } from "./list-graded-example-dirs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALL = join(__dirname, "..", "evals", "all-evals.json");

const data = JSON.parse(readFileSync(ALL, "utf8"));
const byId = new Map();
for (const block of data.skill_evals ?? []) {
	for (const ev of block.evals ?? []) {
		if (ev.id) byId.set(ev.id, ev.assertions ?? []);
	}
}

const errors = [];
for (const id of listGradedExampleIds()) {
	const expected = machineFromAssertions(byId.get(id) ?? []);
	let actual;
	try {
		actual = JSON.parse(readFileSync(join(gradedExamplesRoot(), id, "assertions.json"), "utf8"));
	} catch (e) {
		errors.push(`${id}: ${e.message}`);
		continue;
	}
	if (!Array.isArray(actual)) {
		errors.push(`${id}: assertions.json must be array`);
		continue;
	}
	if (JSON.stringify(actual) !== JSON.stringify(expected)) {
		errors.push(
			`${id}: assertions.json out of sync with extract-grade-needles (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`,
		);
	}
}

if (errors.length) {
	console.error("verify-graded-needles failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-graded-needles: OK");
