#!/usr/bin/env node
/**
 * Structural validation of evals/all-evals.json: required fields, allowed keys,
 * and `skill_evals` order + names match package.json `pi.skills`.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const ALL_PATH = join(root, "evals", "all-evals.json");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const TOP_KEYS = new Set(["pack_version", "corpus_note", "skill_evals"]);
const BLOCK_KEYS = new Set(["skill_name", "evals"]);
const EVAL_KEYS = new Set(["id", "prompt", "expected_output", "files", "assertions"]);
const SKILL_RE = /^pi-[a-z0-9]+(-[a-z0-9]+)*$/;
const EVAL_ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const errors = [];
let data;
try {
	data = JSON.parse(readFileSync(ALL_PATH, "utf8"));
} catch (e) {
	console.error("verify-all-evals-shape: invalid JSON", e.message);
	process.exit(1);
}

for (const k of Object.keys(data)) {
	if (!TOP_KEYS.has(k)) errors.push(`all-evals.json: disallowed top-level key "${k}"`);
}
if (data.pack_version !== 1) errors.push(`all-evals.json: pack_version must be 1 (got ${JSON.stringify(data.pack_version)})`);
if (typeof data.corpus_note !== "string" || !data.corpus_note.trim()) {
	errors.push("all-evals.json: corpus_note must be a non-empty string");
}
if (!Array.isArray(data.skill_evals) || data.skill_evals.length < 1) {
	errors.push("all-evals.json: skill_evals must be a non-empty array");
}

const piSkills = pkg.pi?.skills;
const expectedOrder = Array.isArray(piSkills)
	? piSkills.map((s) => String(s).replace(/^\.\//, "").replace(/\/$/, ""))
	: [];

if (Array.isArray(data.skill_evals)) {
	const gotNames = data.skill_evals.map((b) => b?.skill_name);
	if (expectedOrder.length && (gotNames.length !== expectedOrder.length || gotNames.some((n, i) => n !== expectedOrder[i]))) {
		errors.push(
			`all-evals.json: skill_evals order/names must match package.json pi.skills\n  expected: ${JSON.stringify(expectedOrder)}\n  got:      ${JSON.stringify(gotNames)}`,
		);
	}
	for (let bi = 0; bi < data.skill_evals.length; bi++) {
		const block = data.skill_evals[bi];
		const label = `skill_evals[${bi}]`;
		if (!block || typeof block !== "object") {
			errors.push(`${label}: must be an object`);
			continue;
		}
		for (const k of Object.keys(block)) {
			if (!BLOCK_KEYS.has(k)) errors.push(`${label}: disallowed key "${k}"`);
		}
		if (typeof block.skill_name !== "string" || !SKILL_RE.test(block.skill_name)) {
			errors.push(`${label}: skill_name must match ${SKILL_RE} (got ${JSON.stringify(block.skill_name)})`);
		}
		if (!Array.isArray(block.evals) || block.evals.length < 1) {
			errors.push(`${label}: evals must be a non-empty array`);
			continue;
		}
		for (let ei = 0; ei < block.evals.length; ei++) {
			const ev = block.evals[ei];
			const evLabel = `${label}.evals[${ei}]`;
			if (!ev || typeof ev !== "object") {
				errors.push(`${evLabel}: must be an object`);
				continue;
			}
			for (const k of Object.keys(ev)) {
				if (!EVAL_KEYS.has(k)) errors.push(`${evLabel}: disallowed key "${k}"`);
			}
			if (typeof ev.id !== "string" || !ev.id.trim() || !EVAL_ID_RE.test(ev.id)) {
				errors.push(`${evLabel}: id must be a non-empty hyphen-case string`);
			}
			if (typeof ev.prompt !== "string" || !ev.prompt.trim()) {
				errors.push(`${evLabel}: prompt must be non-empty`);
			}
			if (typeof ev.expected_output !== "string" || !ev.expected_output.trim()) {
				errors.push(`${evLabel}: expected_output must be non-empty`);
			}
			if (!Array.isArray(ev.files)) {
				errors.push(`${evLabel}: files must be an array`);
			} else if (!ev.files.every((f) => typeof f === "string")) {
				errors.push(`${evLabel}: files entries must be strings`);
			}
			if (!Array.isArray(ev.assertions) || ev.assertions.length < 1) {
				errors.push(`${evLabel}: assertions must be a non-empty array of strings`);
			} else if (!ev.assertions.every((a) => typeof a === "string" && a.length > 0)) {
				errors.push(`${evLabel}: each assertion must be a non-empty string`);
			}
		}
	}
}

if (errors.length) {
	console.error("verify-all-evals-shape failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-all-evals-shape: OK");
