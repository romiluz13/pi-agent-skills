#!/usr/bin/env node
/**
 * From evals/all-evals.json, print machine substring assertions for grade-assertions.mjs.
 * - Extracts all pi-mono/... paths from assertion strings
 * - Keeps tokens like U+2028, U+2029, and single-line codes like "4" when assertion is short
 *
 * Usage: node scripts/extract-grade-assertions.mjs --id rpc-framing-001
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { machineFromAssertions } from "./grade-needles.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALL = join(__dirname, "..", "evals", "all-evals.json");

function parseArgs(argv) {
	const o = {};
	for (let i = 2; i < argv.length; i++) {
		if (argv[i] === "--id") o.id = argv[++i];
		else if (argv[i] === "--out") o.out = argv[++i];
	}
	return o;
}

const { id, out } = parseArgs(process.argv);
if (!id) {
	console.error("Usage: node extract-grade-assertions.mjs --id <eval_id> [--out path.json]");
	process.exit(1);
}

const data = JSON.parse(readFileSync(ALL, "utf8"));
let found = null;
for (const block of data.skill_evals ?? []) {
	for (const ev of block.evals ?? []) {
		if (ev.id === id) {
			found = ev.assertions ?? [];
			break;
		}
	}
	if (found) break;
}
if (!found) {
	console.error("extract-grade-assertions: unknown eval id", id);
	process.exit(1);
}

const machine = machineFromAssertions(found);
const json = `${JSON.stringify(machine, null, 2)}\n`;
if (out) {
	writeFileSync(out, json, "utf8");
	console.log("Wrote", out, machine.length, "needles");
} else {
	process.stdout.write(json);
}
