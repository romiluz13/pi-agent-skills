#!/usr/bin/env node
/**
 * No duplicate (symbol, file) rows in api-allowlist.json.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const list = JSON.parse(readFileSync(join(__dirname, "api-allowlist.json"), "utf8"));

const errors = [];
if (!Array.isArray(list)) {
	console.error("verify-api-allowlist-unique: api-allowlist.json must be a JSON array");
	process.exit(1);
}

const seen = new Set();
for (let i = 0; i < list.length; i++) {
	const row = list[i];
	if (!row || typeof row.symbol !== "string" || typeof row.file !== "string") {
		errors.push(`row ${i}: each entry needs string symbol and file`);
		continue;
	}
	const key = `${row.symbol}\0${row.file}`;
	if (seen.has(key)) errors.push(`duplicate allowlist entry: ${row.symbol} @ ${row.file}`);
	seen.add(key);
}

if (errors.length) {
	console.error("verify-api-allowlist-unique failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-api-allowlist-unique: OK");
