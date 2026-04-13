#!/usr/bin/env node
/**
 * Root `skills/<name>/` must symlink to `pi-skills/<name>/` for `npx skills add owner/repo` discovery
 * (same convention as vercel-labs/agent-skills).
 */
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PI_SKILLS = join(__dirname, "..");
const REPO_ROOT = join(PI_SKILLS, "..");
const SKILLS_ROOT = join(REPO_ROOT, "skills");

const pkg = JSON.parse(readFileSync(join(PI_SKILLS, "package.json"), "utf8"));
const listed = (pkg.pi?.skills ?? []).map((s) => String(s).replace(/^\.\//, "").replace(/\/$/, ""));

const errors = [];
if (!existsSync(SKILLS_ROOT)) {
	errors.push(`missing repo root ${SKILLS_ROOT} (create skills/ symlinks per skills/README.md)`);
} else {
	const extra = [];
	for (const ent of readdirSync(SKILLS_ROOT)) {
		if (ent === "README.md" || ent.startsWith(".")) continue;
		const p = join(SKILLS_ROOT, ent);
		let st;
		try {
			st = statSync(p);
		} catch {
			extra.push(`${ent}: missing or broken path under skills/`);
			continue;
		}
		if (!st.isDirectory()) {
			extra.push(`${ent}: must be a directory (symlink to a skill dir is OK)`);
			continue;
		}
		if (!listed.includes(ent)) extra.push(`${ent}: present under skills/ but not in package.json pi.skills`);
	}
	if (extra.length) errors.push(...extra);

	for (const name of listed) {
		const viaSkills = join(SKILLS_ROOT, name);
		const canonical = join(PI_SKILLS, name);
		const mdSkills = join(viaSkills, "SKILL.md");
		const mdCanon = join(canonical, "SKILL.md");
		if (!existsSync(viaSkills)) {
			errors.push(`skills/${name}: missing (expected symlink to pi-skills/${name})`);
			continue;
		}
		if (!existsSync(mdSkills)) errors.push(`skills/${name}/SKILL.md missing`);
		if (!existsSync(mdCanon)) errors.push(`pi-skills/${name}/SKILL.md missing`);
		try {
			const rpSkills = realpathSync(viaSkills);
			const rpCanon = realpathSync(canonical);
			if (rpSkills !== rpCanon) {
				errors.push(`skills/${name} must resolve to pi-skills/${name} (got ${rpSkills} vs ${rpCanon})`);
			}
		} catch (e) {
			errors.push(`skills/${name}: realpath failed (${e.message})`);
		}
	}
}

if (errors.length) {
	console.error("verify-open-skills-layout failed:\n", errors.join("\n"));
	process.exit(1);
}
console.log("verify-open-skills-layout: OK");
