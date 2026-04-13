#!/usr/bin/env node
/**
 * Every pi-mono/ path substring appearing in evals/all-evals.json assertions must exist.
 * Handles "Mentions pi-mono/..." prose; extracts path tokens.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const ALL = join(__dirname, "..", "evals", "all-evals.json");

const PATH_RE = /pi-mono\/[a-zA-Z0-9_.\/-]+/g;

function collectPathsFromString(s) {
	const out = new Set();
	let m;
	while ((m = PATH_RE.exec(s)) !== null) {
		out.add(m[0].replace(/[.,;:!?)]+$/, ""));
	}
	return [...out];
}

const data = JSON.parse(readFileSync(ALL, "utf8"));
const errors = [];

for (const block of data.skill_evals ?? []) {
	for (const ev of block.evals ?? []) {
		const id = ev.id ?? "?";
		for (const a of ev.assertions ?? []) {
			for (const rel of collectPathsFromString(String(a))) {
				const abs = join(REPO_ROOT, rel);
				if (!existsSync(abs)) {
					errors.push(`${id}: assertion references missing ${rel}`);
				}
			}
		}
	}
}

if (errors.length) {
	console.error("verify-eval-paths failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-eval-paths: OK");
