#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALL = join(__dirname, "..", "evals", "all-evals.json");

const data = JSON.parse(readFileSync(ALL, "utf8"));
const seen = new Map();
const errors = [];

for (const block of data.skill_evals ?? []) {
	for (const ev of block.evals ?? []) {
		const id = ev.id;
		if (!id) {
			errors.push("eval missing id under skill " + (block.skill_name ?? "?"));
			continue;
		}
		if (seen.has(id)) {
			errors.push(`duplicate eval id "${id}" (skills: ${seen.get(id)} and ${block.skill_name})`);
		} else {
			seen.set(id, block.skill_name);
		}
	}
}

if (errors.length) {
	console.error("verify-unique-eval-ids failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-unique-eval-ids: OK");
