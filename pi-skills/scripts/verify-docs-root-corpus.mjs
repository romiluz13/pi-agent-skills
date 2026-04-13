#!/usr/bin/env node
/**
 * Repo and pi-skills *documentation* markdown (not SKILL bodies — those are verify-corpus-paths).
 * Ensures every pi-mono/ citation resolves under repo root.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { extractPiMonoPaths } from "./pi-mono-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PI_SKILLS = join(__dirname, "..");
const REPO_ROOT = join(PI_SKILLS, "..");
const PI_MONO = join(REPO_ROOT, "pi-mono");

function walkMarkdownRecursive(dir, out = []) {
	if (!existsSync(dir) || !statSync(dir).isDirectory()) return out;
	for (const name of readdirSync(dir)) {
		if (name.startsWith(".")) continue;
		const p = join(dir, name);
		if (statSync(p).isDirectory()) {
			walkMarkdownRecursive(p, out);
		} else if (name.endsWith(".md")) {
			out.push(p);
		}
	}
	return out;
}

const files = [];
const singles = [
	join(REPO_ROOT, "README.md"),
	join(REPO_ROOT, "AGENTS.md"),
	join(REPO_ROOT, "skills", "README.md"),
	join(PI_SKILLS, "README.md"),
	join(PI_SKILLS, "evals", "README.md"),
	join(PI_SKILLS, "trigger-evals", "README.md"),
];
for (const f of singles) {
	if (existsSync(f)) files.push(f);
}
walkMarkdownRecursive(join(REPO_ROOT, "docs"), files);
walkMarkdownRecursive(join(PI_SKILLS, "docs"), files);

const errors = [];
for (const file of files) {
	const content = readFileSync(file, "utf8");
	for (const rel of extractPiMonoPaths(content)) {
		const abs = join(REPO_ROOT, rel);
		if (!existsSync(abs)) {
			errors.push(`Missing: ${rel} (from ${relative(REPO_ROOT, file)})`);
		}
	}
}

if (!existsSync(PI_MONO)) {
	errors.push("pi-mono/ directory missing at repo root");
}

if (errors.length) {
	console.error("verify-docs-root-corpus failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-docs-root-corpus: OK");
