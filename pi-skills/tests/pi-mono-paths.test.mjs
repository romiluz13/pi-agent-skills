import test from "node:test";
import assert from "node:assert/strict";
import { extractPiMonoPaths } from "../scripts/pi-mono-paths.mjs";

test("backticks, links, and bare paths", () => {
	const md = `
See \`pi-mono/packages/agent/README.md\` and [agent](pi-mono/packages/agent/README.md).
Also pi-mono/packages/ai/README.md inline.
`;
	const got = extractPiMonoPaths(md);
	assert.ok(got.includes("pi-mono/packages/agent/README.md"));
	assert.ok(got.includes("pi-mono/packages/ai/README.md"));
});

test("ignores ellipsis placeholders", () => {
	const md = "Use `pi-mono/...` or pi-mono/packages/... in docs.";
	const got = extractPiMonoPaths(md);
	assert.equal(got.length, 0);
});
