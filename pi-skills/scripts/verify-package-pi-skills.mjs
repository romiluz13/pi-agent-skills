#!/usr/bin/env node
/**
 * Every `package.json` `pi.skills` entry must resolve to a directory containing SKILL.md.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const skills = pkg.pi?.skills;

const errors = [];
if (!Array.isArray(skills) || skills.length < 1) {
	errors.push("package.json: pi.skills must be a non-empty array");
} else {
	for (const rel of skills) {
		const clean = String(rel).replace(/^\.\//, "").replace(/\/$/, "");
		const skillMd = join(root, clean, "SKILL.md");
		if (!existsSync(skillMd)) {
			errors.push(`pi.skills entry "${rel}" missing SKILL.md at ${skillMd}`);
		}
	}
}

if (errors.length) {
	console.error("verify-package-pi-skills failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-package-pi-skills: OK");
