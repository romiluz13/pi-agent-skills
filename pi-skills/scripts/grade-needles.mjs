/**
 * Shared: human eval assertions → machine substring needles for grade-assertions.mjs
 */
const PATH_RE = /pi-mono\/[a-zA-Z0-9_.\/-]+/g;
const EXACT_TOKENS = new Set([
	"Component interface",
	"render(width)",
	"matchesKey",
	"showOverlay",
	"anchor",
	"pi start",
	"hermes",
	"qwen3_coder",
	"--vllm",
	"tensor-parallel-size",
	"periodic",
	"schedule",
	"timezone",
	"no documented include directive",
]);

export function machineFromAssertions(assertions) {
	const out = [];
	const seen = new Set();
	const add = (s) => {
		if (!seen.has(s)) {
			seen.add(s);
			out.push(s);
		}
	};
	for (const a of assertions) {
		const s = String(a);
		let m;
		PATH_RE.lastIndex = 0;
		while ((m = PATH_RE.exec(s)) !== null) {
			add(m[0].replace(/[.,;:!?)]+$/, ""));
		}
		if (/^U\+[0-9A-Fa-f]{4}$/i.test(s.trim())) add(s.trim());
		if (/^\d+$/.test(s.trim()) && s.trim().length <= 3) add(s.trim());
		if (EXACT_TOKENS.has(s.trim())) add(s.trim());
		if (s.includes("read tool") || s.toLowerCase().includes("read tool")) add("read tool");
		if (s.includes("packages/ai") && !s.includes("pi-mono")) add("packages/ai");
		if (s.includes("agent-session.ts") && !s.includes("pi-mono")) add("agent-session.ts");
	}
	return out;
}
