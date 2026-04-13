#!/usr/bin/env node
/**
 * Fail if any pi-mono/ path cited in skills does not exist under repo root.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { extractPiMonoPaths } from "./pi-mono-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PI_SKILLS_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PI_SKILLS_ROOT, "..");
const PI_MONO = join(REPO_ROOT, "pi-mono");

function walkSkillDirs() {
	const out = [];
	for (const name of readdirSync(PI_SKILLS_ROOT)) {
		if (!name.startsWith("pi-")) continue;
		const p = join(PI_SKILLS_ROOT, name);
		if (!statSync(p).isDirectory()) continue;
		if (!existsSync(join(p, "SKILL.md"))) continue;
		out.push(p);
	}
	return out;
}

function collectMarkdownFiles(skillDir) {
	const files = [join(skillDir, "SKILL.md")];
	const ref = join(skillDir, "references");
	if (existsSync(ref) && statSync(ref).isDirectory()) {
		for (const f of readdirSync(ref)) {
			if (f.endsWith(".md")) files.push(join(ref, f));
		}
	}
	return files;
}

const errors = [];
for (const skillDir of walkSkillDirs()) {
	for (const file of collectMarkdownFiles(skillDir)) {
		const content = readFileSync(file, "utf8");
		for (const rel of extractPiMonoPaths(content)) {
			const abs = join(REPO_ROOT, rel);
			if (!existsSync(abs)) {
				errors.push(`Missing: ${rel} (from ${relative(REPO_ROOT, file)})`);
			}
		}
	}
}

if (!existsSync(PI_MONO)) {
	errors.push("pi-mono/ directory missing at repo root — clone badlogic/pi-mono");
}

if (errors.length) {
	console.error("verify-corpus-paths failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-corpus-paths: OK");
