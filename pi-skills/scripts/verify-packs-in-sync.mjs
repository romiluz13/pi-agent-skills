#!/usr/bin/env node
/**
 * evals/evals.json and evals/packs/*.json must match `scripts/sync-evals-packs.mjs` output from all-evals.json.
 */
import { deepStrictEqual } from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVALS = join(__dirname, "..", "evals");
const ALL_PATH = join(EVALS, "all-evals.json");
const MANIFEST_PATH = join(EVALS, "evals.json");

const all = JSON.parse(readFileSync(ALL_PATH, "utf8"));
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));

const expectedManifest = {
	version: 1,
	corpus_note: all.corpus_note,
	packs: (all.skill_evals ?? []).map((b) => ({
		skill_name: b.skill_name,
		file: `packs/${b.skill_name}.json`,
	})),
};

try {
	deepStrictEqual(manifest, expectedManifest);
} catch (e) {
	console.error("verify-packs-in-sync: evals/evals.json out of sync with all-evals.json (run: npm run sync-evals)");
	console.error(e.message);
	process.exit(1);
}

for (const block of all.skill_evals ?? []) {
	const expectedPack = { skill_name: block.skill_name, evals: block.evals };
	const packPath = join(EVALS, "packs", `${block.skill_name}.json`);
	if (!existsSync(packPath)) {
		console.error(`verify-packs-in-sync: missing ${packPath} (run: npm run sync-evals)`);
		process.exit(1);
	}
	let disk;
	try {
		disk = JSON.parse(readFileSync(packPath, "utf8"));
	} catch (err) {
		console.error(`verify-packs-in-sync: invalid JSON in ${packPath}: ${err.message}`);
		process.exit(1);
	}
	try {
		deepStrictEqual(disk, expectedPack);
	} catch (e2) {
		console.error(`verify-packs-in-sync: pack ${block.skill_name}.json out of sync (run: npm run sync-evals)`);
		console.error(e2.message);
		process.exit(1);
	}
}

console.log("verify-packs-in-sync: OK");
