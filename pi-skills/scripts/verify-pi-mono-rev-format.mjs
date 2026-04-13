#!/usr/bin/env node
/**
 * When present, repo root `.pi-mono-rev` must pin a full 40-char hex SHA (first token).
 * Short SHAs and non-hex break reproducibility for CORPUS and CI.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pinFile = join(__dirname, "..", "..", ".pi-mono-rev");

if (existsSync(pinFile)) {
	const raw = readFileSync(pinFile, "utf8").trim();
	const first = raw.split(/\s+/)[0] ?? "";
	if (!/^[a-f0-9]{40}$/i.test(first)) {
		console.error(
			`verify-pi-mono-rev-format: .pi-mono-rev must start with a full 40-char hex git SHA (got "${first.slice(0, 12)}${first.length > 12 ? "…" : ""}")`,
		);
		process.exit(1);
	}
}
console.log("verify-pi-mono-rev-format: OK");
