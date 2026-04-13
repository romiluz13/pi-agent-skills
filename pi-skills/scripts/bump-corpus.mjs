#!/usr/bin/env node
/**
 * Set repo .pi-mono-rev and all pi-*/references/CORPUS.md commit lines to match current pi-mono HEAD.
 * Run after: git -C pi-mono pull && git -C pi-mono checkout <desired>
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PI_SKILLS_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PI_SKILLS_ROOT, "..");
const PI_MONO = join(REPO_ROOT, "pi-mono");

if (!existsSync(PI_MONO)) {
	console.error("bump-corpus: pi-mono not found");
	process.exit(1);
}
const r = spawnSync("git", ["-C", PI_MONO, "rev-parse", "HEAD"], { encoding: "utf8" });
if (r.status !== 0) {
	console.error("bump-corpus:", r.stderr);
	process.exit(1);
}
const sha = r.stdout.trim();
if (!/^[a-f0-9]{40}$/i.test(sha)) {
	console.error("bump-corpus: unexpected SHA", sha);
	process.exit(1);
}

writeFileSync(join(REPO_ROOT, ".pi-mono-rev"), `${sha}\n`, "utf8");
console.log("Wrote .pi-mono-rev:", sha);

const corpusLine = new RegExp(
`Verified tree: \`pi-mono/\` at commit \`[a-f0-9]{40}\`\\.`,
	"i",
);

for (const name of readdirSync(PI_SKILLS_ROOT)) {
	if (!name.startsWith("pi-")) continue;
	const dir = join(PI_SKILLS_ROOT, name);
	if (!statSync(dir).isDirectory()) continue;
	const corpus = join(dir, "references", "CORPUS.md");
	if (!existsSync(corpus)) continue;
	let text = readFileSync(corpus, "utf8");
	const next = text.replace(
		corpusLine,
		`Verified tree: \`pi-mono/\` at commit \`${sha}\`.`,
	);
	if (text === next) {
		console.warn(`bump-corpus: no commit line updated in ${name}/references/CORPUS.md (check format)`);
		continue;
	}
	writeFileSync(corpus, next, "utf8");
	console.log("Updated:", name, "CORPUS.md");
}

console.log("bump-corpus: run: cd pi-skills && npm run verify-skills && npm run sync-evals");
