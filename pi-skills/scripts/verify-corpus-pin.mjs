#!/usr/bin/env node
/**
 * Ensures every references/CORPUS.md documents the same commit as ../pi-mono HEAD.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PI_SKILLS_ROOT = join(__dirname, "..");
const REPO_ROOT = join(PI_SKILLS_ROOT, "..");
const PI_MONO = join(REPO_ROOT, "pi-mono");

if (!existsSync(PI_MONO)) {
	console.error("verify-corpus-pin: pi-mono missing");
	process.exit(1);
}

const head = spawnSync("git", ["-C", PI_MONO, "rev-parse", "HEAD"], { encoding: "utf8" });
if (head.status !== 0) {
	console.error("verify-corpus-pin: git rev-parse failed", head.stderr);
	process.exit(1);
}
const headSha = head.stdout.trim();
const pinFile = join(REPO_ROOT, ".pi-mono-rev");
let expected = headSha;
if (existsSync(pinFile)) {
	const pinned = readFileSync(pinFile, "utf8").trim().split(/\s+/)[0];
	if (pinned.length >= 7 && /^[a-f0-9]+$/i.test(pinned)) {
		if (headSha !== pinned) {
			console.error(
				`verify-corpus-pin: pi-mono HEAD ${headSha.slice(0, 7)}… !== .pi-mono-rev ${pinned.slice(0, 7)}… — git -C pi-mono checkout ${pinned} or update pin + CORPUS files`,
			);
			process.exit(1);
		}
		expected = pinned;
	}
}

const errors = [];
for (const name of readdirSync(PI_SKILLS_ROOT)) {
	if (!name.startsWith("pi-")) continue;
	const dir = join(PI_SKILLS_ROOT, name);
	if (!statSync(dir).isDirectory()) continue;
	const corpus = join(dir, "references", "CORPUS.md");
	if (!existsSync(corpus)) continue;
	const text = readFileSync(corpus, "utf8");
	const m = text.match(/commit `([a-f0-9]{40})`/);
	if (!m) {
		errors.push(`${name}: CORPUS.md missing 'commit \`<40-hex>\`' line`);
		continue;
	}
	if (m[1] !== expected) {
		errors.push(`${name}: CORPUS pins ${m[1].slice(0, 7)}… but pi-mono HEAD is ${expected.slice(0, 7)}… — run: git -C pi-mono rev-parse HEAD and update CORPUS.md`);
	}
}

if (errors.length) {
	console.error("verify-corpus-pin failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-corpus-pin: OK (HEAD, .pi-mono-rev if present, and CORPUS agree)");
