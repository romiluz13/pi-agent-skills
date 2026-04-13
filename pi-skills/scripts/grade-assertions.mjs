#!/usr/bin/env node
/**
 * Programmatically grade a model response against substring assertions.
 * Emits grading.json with expectations: [{ text, passed, evidence }] for skill-creator viewer.
 *
 * Usage:
 *   node scripts/grade-assertions.mjs --response ./response.md --assertions ./assertions.json --out ./grading.json
 *
 * assertions.json: string[] or { "assertions": string[] }
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

function parseArgs(argv) {
	const o = {};
	for (let i = 2; i < argv.length; i++) {
		if (argv[i] === "--response") o.response = argv[++i];
		else if (argv[i] === "--assertions") o.assertions = argv[++i];
		else if (argv[i] === "--out") o.out = argv[++i];
	}
	return o;
}

const { response, assertions: assertionsPath, out } = parseArgs(process.argv);
if (!response || !assertionsPath || !out) {
	console.error(
		"Usage: node grade-assertions.mjs --response <response.md> --assertions <json> --out <grading.json>",
	);
	process.exit(1);
}

const text = readFileSync(resolve(response), "utf8");
const raw = JSON.parse(readFileSync(resolve(assertionsPath), "utf8"));
const assertions = Array.isArray(raw) ? raw : raw.assertions;
if (!Array.isArray(assertions)) {
	console.error("assertions must be string[] or { assertions: string[] }");
	process.exit(1);
}

const expectations = assertions.map((needle) => {
	const n = String(needle);
	const passed = text.includes(n);
	return {
		text: n,
		passed,
		evidence: passed ? `Found substring in response` : `Missing: ${n.slice(0, 80)}${n.length > 80 ? "…" : ""}`,
	};
});

const grading = {
	generated_by: "pi-skills/scripts/grade-assertions.mjs",
	expectations,
	summary: {
		passed: expectations.filter((e) => e.passed).length,
		total: expectations.length,
	},
};

writeFileSync(resolve(out), `${JSON.stringify(grading, null, 2)}\n`, "utf8");
console.log(`Wrote ${out} (${grading.summary.passed}/${grading.summary.total} passed)`);
process.exit(expectations.every((e) => e.passed) ? 0 : 1);
