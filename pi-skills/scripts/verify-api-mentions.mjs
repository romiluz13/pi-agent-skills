#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const allowlist = JSON.parse(readFileSync(join(__dirname, "api-allowlist.json"), "utf8"));

const errors = [];
for (const { symbol, file } of allowlist) {
	const abs = join(REPO_ROOT, "pi-mono", file);
	if (!existsSync(abs)) {
		errors.push(`allowlist file missing: pi-mono/${file}`);
		continue;
	}
	const text = readFileSync(abs, "utf8");
	if (!text.includes(symbol)) {
		errors.push(`symbol "${symbol}" not found in pi-mono/${file}`);
	}
}

if (errors.length) {
	console.error("verify-api-mentions failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-api-mentions: OK");
