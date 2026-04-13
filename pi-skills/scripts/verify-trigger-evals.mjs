#!/usr/bin/env node
/**
 * Each skill in package.json pi.skills must have trigger-evals/<name>.json:
 * JSON array, length 20, exactly 10 should_trigger true and 10 false, query strings non-empty.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG = join(__dirname, "..", "package.json");
const TRIGGER = join(__dirname, "..", "trigger-evals");

const pkg = JSON.parse(readFileSync(PKG, "utf8"));
const skills = pkg.pi?.skills;
if (!Array.isArray(skills)) {
	console.error("verify-trigger-evals: package.json missing pi.skills array");
	process.exit(1);
}

const expectedNames = new Set(
	skills.map((rel) => rel.replace(/^\.\//, "").replace(/\/$/, "")),
);

const errors = [];
for (const rel of skills) {
	const name = rel.replace(/^\.\//, "").replace(/\/$/, "");
	const p = join(TRIGGER, `${name}.json`);
	if (!existsSync(p)) {
		errors.push(`missing trigger-evals/${name}.json (listed in pi.skills)`);
		continue;
	}
	let data;
	try {
		data = JSON.parse(readFileSync(p, "utf8"));
	} catch (e) {
		errors.push(`${name}.json: invalid JSON (${e.message})`);
		continue;
	}
	if (!Array.isArray(data)) {
		errors.push(`${name}.json: root must be array`);
		continue;
	}
	if (data.length !== 20) {
		errors.push(`${name}.json: expected 20 entries, got ${data.length}`);
	}
	let t = 0;
	let f = 0;
	for (let i = 0; i < data.length; i++) {
		const row = data[i];
		if (typeof row?.query !== "string" || !row.query.trim()) {
			errors.push(`${name}.json[${i}]: missing query`);
		}
		if (row?.should_trigger !== true && row?.should_trigger !== false) {
			errors.push(`${name}.json[${i}]: should_trigger must be boolean`);
		} else if (row.should_trigger) t++;
		else f++;
	}
	if (t !== 10 || f !== 10) {
		errors.push(`${name}.json: expected 10 true and 10 false should_trigger, got ${t} true ${f} false`);
	}
}

if (existsSync(TRIGGER) && statSync(TRIGGER).isDirectory()) {
	for (const name of readdirSync(TRIGGER)) {
		if (!name.endsWith(".json")) continue;
		const id = basename(name, ".json");
		if (!expectedNames.has(id)) {
			errors.push(`orphan trigger-evals/${name} (not listed in package.json pi.skills)`);
		}
	}
}

if (errors.length) {
	console.error("verify-trigger-evals failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-trigger-evals: OK");
