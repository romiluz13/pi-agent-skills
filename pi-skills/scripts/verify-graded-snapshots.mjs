#!/usr/bin/env node
/**
 * Ensures checked-in graded-example artifacts stay aligned: assertions.json,
 * with_skill/response.md, and with_skill/grading.json (all expectations passed;
 * texts match assertion needles in order).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { listGradedExampleIds, gradedExamplesRoot } from "./list-graded-example-dirs.mjs";

const EVALS = gradedExamplesRoot();

const errors = [];

for (const id of listGradedExampleIds()) {
	const base = join(EVALS, id);
	const assertionsPath = join(base, "assertions.json");
	const responsePath = join(base, "with_skill", "response.md");
	const gradingPath = join(base, "with_skill", "grading.json");
	let missing = false;
	for (const [label, p] of [
		["assertions", assertionsPath],
		["response", responsePath],
		["grading", gradingPath],
	]) {
		if (!existsSync(p)) {
			errors.push(`${id}: missing ${label}: ${p}`);
			missing = true;
		}
	}
	if (missing) continue;

	const assertions = JSON.parse(readFileSync(assertionsPath, "utf8"));
	if (!Array.isArray(assertions)) {
		errors.push(`${id}: assertions.json must be a JSON array`);
		continue;
	}
	const grading = JSON.parse(readFileSync(gradingPath, "utf8"));
	const exp = grading.expectations;
	if (!Array.isArray(exp)) {
		errors.push(`${id}: grading.json missing expectations array`);
		continue;
	}
	if (exp.length !== assertions.length) {
		errors.push(`${id}: expectations length ${exp.length} !== assertions length ${assertions.length}`);
	}
	for (let i = 0; i < assertions.length; i++) {
		if (String(exp[i]?.text) !== String(assertions[i])) {
			errors.push(`${id}: expectation[${i}].text must equal assertions[${i}]`);
		}
		if (exp[i]?.passed !== true) errors.push(`${id}: expectation[${i}] must be passed`);
	}
	const { passed, total } = grading.summary ?? {};
	if (total !== assertions.length || passed !== assertions.length) {
		errors.push(`${id}: summary must show ${assertions.length}/${assertions.length} passed`);
	}
}

if (errors.length) {
	console.error("verify-graded-snapshots failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-graded-snapshots: OK");
