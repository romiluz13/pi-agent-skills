#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PI_SKILLS_ROOT = join(__dirname, "..");

const MAX_NAME = 64;
const MAX_DESC = 1024;
const MAX_COMPAT = 500;
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ALLOWED_FM_KEYS = new Set(["name", "description", "compatibility"]);

function parseFrontmatter(raw) {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return null;
	const fm = {};
	for (const line of m[1].split(/\r?\n/)) {
		const idx = line.indexOf(":");
		if (idx === -1) continue;
		const key = line.slice(0, idx).trim();
		let val = line.slice(idx + 1).trim();
		if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
			val = val.slice(1, -1);
		}
		fm[key] = val;
	}
	return fm;
}

const errors = [];
for (const name of readdirSync(PI_SKILLS_ROOT)) {
	if (!name.startsWith("pi-")) continue;
	const dir = join(PI_SKILLS_ROOT, name);
	if (!statSync(dir).isDirectory()) continue;
	const skillMd = join(dir, "SKILL.md");
	if (!existsSync(skillMd)) continue;
	const raw = readFileSync(skillMd, "utf8");
	const fm = parseFrontmatter(raw);
	if (!fm) {
		errors.push(`${name}: missing YAML frontmatter`);
		continue;
	}
	if (!fm.name) errors.push(`${name}: missing name in frontmatter`);
	if (!fm.description) errors.push(`${name}: missing description`);
	if (!fm.compatibility) errors.push(`${name}: missing compatibility (tools/env this skill assumes)`);
	for (const k of Object.keys(fm)) {
		if (!ALLOWED_FM_KEYS.has(k)) errors.push(`${name}: disallowed frontmatter key "${k}" (allowed: ${[...ALLOWED_FM_KEYS].sort().join(", ")})`);
	}
	if (fm.compatibility && fm.compatibility.length > MAX_COMPAT) {
		errors.push(`${name}: compatibility exceeds ${MAX_COMPAT}`);
	}
	if (fm.name !== name) errors.push(`${name}: frontmatter name "${fm.name}" must match directory`);
	if (fm.name && fm.name.length > MAX_NAME) errors.push(`${name}: name exceeds ${MAX_NAME}`);
	if (fm.description && fm.description.length > MAX_DESC) errors.push(`${name}: description exceeds ${MAX_DESC}`);
	if (fm.name && !NAME_RE.test(fm.name)) errors.push(`${name}: invalid name pattern (lowercase, hyphens, no --)`);
	if (fm.name && (fm.name.startsWith("-") || fm.name.endsWith("-"))) errors.push(`${name}: name must not start/end with hyphen`);
	if (fm.name && fm.name.includes("--")) errors.push(`${name}: name must not contain --`);
}

if (errors.length) {
	console.error("verify-frontmatter failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-frontmatter: OK");
