#!/usr/bin/env node
/**
 * Create evals/graded-examples/<id>/assertions.json (machine needles), evals/examples/<id>.eval_metadata.json,
 * and a stub with_skill/response.md. Edit the response, then: npm run grade-graded-examples
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { machineFromAssertions } from "./grade-needles.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ALL = join(__dirname, "..", "evals", "all-evals.json");
const GRADED = join(__dirname, "..", "evals", "graded-examples");
const EXAMPLES = join(__dirname, "..", "evals", "examples");

function parseArgs(argv) {
	const o = { force: false };
	for (let i = 2; i < argv.length; i++) {
		if (argv[i] === "--id") o.id = argv[++i];
		else if (argv[i] === "--force") o.force = true;
	}
	return o;
}

const { id, force } = parseArgs(process.argv);
if (!id) {
	console.error("Usage: node scaffold-graded-example.mjs --id <eval_id> [--force]");
	process.exit(1);
}

const data = JSON.parse(readFileSync(ALL, "utf8"));
let ev = null;
for (const block of data.skill_evals ?? []) {
	for (const e of block.evals ?? []) {
		if (e.id === id) {
			ev = { ...e, skill_name: block.skill_name };
			break;
		}
	}
	if (ev) break;
}
if (!ev) {
	console.error("scaffold-graded-example: unknown eval id", id);
	process.exit(1);
}

const base = join(GRADED, id);
const assertionsPath = join(base, "assertions.json");
if (existsSync(assertionsPath) && !force) {
	console.error("scaffold-graded-example: already exists; use --force to overwrite stubs");
	process.exit(1);
}

mkdirSync(join(base, "with_skill"), { recursive: true });

const machine = machineFromAssertions(ev.assertions ?? []);
writeFileSync(assertionsPath, `${JSON.stringify(machine, null, 2)}\n`, "utf8");

const meta = {
	eval_id: ev.id,
	eval_name: String(ev.id).replace(/-/g, "_"),
	skill_name: ev.skill_name,
	prompt: ev.prompt,
	assertions: ev.assertions ?? [],
};
mkdirSync(EXAMPLES, { recursive: true });
writeFileSync(join(EXAMPLES, `${id}.eval_metadata.json`), `${JSON.stringify(meta, null, 2)}\n`, "utf8");

const stub = `<!-- Replace with with-skill model output; must satisfy needles in ../assertions.json -->\n`;
const responsePath = join(base, "with_skill", "response.md");
if (!existsSync(responsePath) || force) {
	writeFileSync(responsePath, stub, "utf8");
}

console.log("scaffold-graded-example:", id);
console.log("  ", responsePath);
console.log("  ", join(EXAMPLES, `${id}.eval_metadata.json`));
console.log("Next: edit response.md, then: npm run grade-graded-examples && npm run verify-skills");
