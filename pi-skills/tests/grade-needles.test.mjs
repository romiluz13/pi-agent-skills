import test from "node:test";
import assert from "node:assert/strict";
import { machineFromAssertions } from "../scripts/grade-needles.mjs";

test("extracts pi-mono path and strips trailing punctuation from assertion prose", () => {
	const got = machineFromAssertions([
		"Mentions pi-mono/packages/coding-agent/docs/rpc.md",
	]);
	assert.deepEqual(got, ["pi-mono/packages/coding-agent/docs/rpc.md"]);
});

test("dedupes paths and preserves U+ tokens", () => {
	const got = machineFromAssertions([
		"Mentions pi-mono/packages/coding-agent/docs/rpc.md",
		"U+2028",
		"U+2029",
	]);
	assert.deepEqual(got, [
		"pi-mono/packages/coding-agent/docs/rpc.md",
		"U+2028",
		"U+2029",
	]);
});

test("read tool and packages/ai special cases", () => {
	const got = machineFromAssertions([
		"Mentions pi-mono/AGENTS.md",
		"packages/ai",
	]);
	assert.deepEqual(got, ["pi-mono/AGENTS.md", "packages/ai"]);
});

test("agent-session.ts without pi-mono in same assertion line", () => {
	const got = machineFromAssertions(["agent-session.ts"]);
	assert.deepEqual(got, ["agent-session.ts"]);
});

test("extracts exact non-path tokens for strengthened graded needles", () => {
	const got = machineFromAssertions([
		"Mentions pi-mono/packages/tui/README.md",
		"Component interface",
		"render(width)",
		"matchesKey",
		"--vllm",
		"tensor-parallel-size",
		"no documented include directive",
	]);
	assert.deepEqual(got, [
		"pi-mono/packages/tui/README.md",
		"Component interface",
		"render(width)",
		"matchesKey",
		"--vllm",
		"tensor-parallel-size",
		"no documented include directive",
	]);
});
