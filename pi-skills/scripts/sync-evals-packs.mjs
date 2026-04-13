#!/usr/bin/env node
/**
 * Split evals/all-evals.json into evals/packs/<skill_name>.json (skill-creator shape)
 * and evals/evals.json (manifest listing all packs).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVALS = join(__dirname, "..", "evals");
const all = JSON.parse(readFileSync(join(EVALS, "all-evals.json"), "utf8"));
const packsDir = join(EVALS, "packs");
mkdirSync(packsDir, { recursive: true });

const manifest = { version: 1, corpus_note: all.corpus_note, packs: [] };

for (const block of all.skill_evals) {
	const { skill_name, evals } = block;
	const out = { skill_name, evals };
	const fname = `${skill_name}.json`;
	writeFileSync(join(packsDir, fname), `${JSON.stringify(out, null, 2)}\n`, "utf8");
	manifest.packs.push({ skill_name, file: `packs/${fname}` });
}

writeFileSync(join(EVALS, "evals.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`sync-evals-packs: wrote ${manifest.packs.length} packs + evals/evals.json`);
