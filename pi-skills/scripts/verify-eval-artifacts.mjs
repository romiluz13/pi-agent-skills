#!/usr/bin/env node
/**
 * Single source of truth: evals/all-evals.json
 * - Every eval id has evals/examples/<id>.eval_metadata.json matching catalog (eval_id, skill_name, prompt, assertions).
 * - Every eval id has evals/graded-examples/<id>/ with assertions.json (same set as catalog; no orphans).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listGradedExampleIds, gradedExamplesRoot } from "./list-graded-example-dirs.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALL = join(__dirname, "..", "evals", "all-evals.json");
const EXAMPLES = join(__dirname, "..", "evals", "examples");
const GRADED = gradedExamplesRoot();

const data = JSON.parse(readFileSync(ALL, "utf8"));
const catalog = new Map();
for (const block of data.skill_evals ?? []) {
	const skill = block.skill_name;
	for (const ev of block.evals ?? []) {
		const id = ev.id;
		if (!id) continue;
		catalog.set(id, { skill_name: skill, prompt: ev.prompt, assertions: ev.assertions ?? [] });
	}
}

const errors = [];
const gradedSet = new Set(listGradedExampleIds());

for (const [id, expected] of catalog) {
	const metaPath = join(EXAMPLES, `${id}.eval_metadata.json`);
	if (!existsSync(metaPath)) {
		errors.push(`${id}: missing ${metaPath}`);
		continue;
	}
	let meta;
	try {
		meta = JSON.parse(readFileSync(metaPath, "utf8"));
	} catch (e) {
		errors.push(`${id}: invalid JSON in eval_metadata (${e.message})`);
		continue;
	}
	if (meta.eval_id !== id) errors.push(`${id}: eval_metadata.eval_id is "${meta.eval_id}"`);
	if (meta.skill_name !== expected.skill_name) {
		errors.push(`${id}: eval_metadata.skill_name "${meta.skill_name}" !== catalog "${expected.skill_name}"`);
	}
	if (meta.prompt !== expected.prompt) errors.push(`${id}: eval_metadata.prompt out of sync with all-evals.json`);
	if (JSON.stringify(meta.assertions) !== JSON.stringify(expected.assertions)) {
		errors.push(`${id}: eval_metadata.assertions out of sync with all-evals.json`);
	}

	const assertionsPath = join(GRADED, id, "assertions.json");
	if (!existsSync(assertionsPath)) {
		errors.push(`${id}: missing graded-examples assertions.json`);
	}
}

for (const id of gradedSet) {
	if (!catalog.has(id)) errors.push(`orphan graded-examples/: ${id} (not in all-evals.json)`);
}

for (const id of catalog.keys()) {
	if (!gradedSet.has(id)) errors.push(`${id}: missing graded-examples/ (no assertions.json)`);
}

if (errors.length) {
	console.error("verify-eval-artifacts failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-eval-artifacts: OK");
