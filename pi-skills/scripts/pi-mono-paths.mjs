/**
 * Extract cited pi-mono/... paths from markdown (skills, docs, graded responses).
 * Keep rules in sync everywhere: backticks, markdown links, bare tokens.
 */
function isPlaceholderPath(p) {
	return p.includes("...") || /\/\.{2,}\//.test(p) || p.endsWith("/..");
}

export function extractPiMonoPaths(content) {
	const paths = new Set();
	for (const m of content.matchAll(/`pi-mono\/[^`\s]+`/g)) {
		const p = m[0].slice(1, -1);
		if (!isPlaceholderPath(p)) paths.add(p);
	}
	for (const m of content.matchAll(/\]\((pi-mono\/[^)\s]+)\)/g)) {
		const p = m[1];
		if (!isPlaceholderPath(p)) paths.add(p);
	}
	for (const m of content.matchAll(/\bpi-mono\/[a-zA-Z0-9_./-]+/g)) {
		const p = m[0];
		if (!isPlaceholderPath(p)) paths.add(p);
	}
	return [...paths];
}
