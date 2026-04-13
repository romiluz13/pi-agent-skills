#!/usr/bin/env node
/**
 * Subdirs of evals/graded-examples/ that contain assertions.json (graded baseline roots).
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "evals", "graded-examples");

export function listGradedExampleIds() {
	if (!existsSync(ROOT)) return [];
	const out = [];
	for (const name of readdirSync(ROOT)) {
		if (name.startsWith(".")) continue;
		const base = join(ROOT, name);
		if (!statSync(base).isDirectory()) continue;
		if (existsSync(join(base, "assertions.json"))) out.push(name);
	}
	return out.sort();
}

export function gradedExamplesRoot() {
	return ROOT;
}
