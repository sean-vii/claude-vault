#!/usr/bin/env node
// Refuses any agent's merge into, or push to, the code repository's main branch (CONVENTIONS §10.2).
// Merging into main is the person's act, signed off from the milestone's sheet, and GitHub
// cannot tell an agent from the person whose account it runs on — so the refusal lives here.
// The vault's own main is untouched: its edits are made and pushed by the session, by design.
// Which repository is the code repository is read from .claude/workflow.json, never written here.
// PreToolUse hook on Bash: exit 2 blocks the call and shows the reason to the agent.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

let input = "";
for await (const chunk of process.stdin) input += chunk;
const event = JSON.parse(input || "{}");
const command = event?.tool_input?.command ?? "";
const cwd = event?.cwd || process.cwd();

const refuse = (why) => {
  process.stderr.write(
    `Refused: ${why}. Merging into the code repository's main is the person's act (CONVENTIONS §10.2) — ` +
      `open the pull request with its sign-off sheet and stop.\n`,
  );
  process.exit(2);
};

// Nothing to guard until a merge or a push is in the command.
if (!/\bgh\s+pr\s+merge\b|\bgit\b[^;&|\n]*\bpush\b/.test(command)) process.exit(0);

let CODE_REPO;
try {
  CODE_REPO = JSON.parse(fs.readFileSync(path.join(VAULT, ".claude/workflow.json"), "utf8")).codeRepo;
} catch {
  refuse("could not read codeRepo from .claude/workflow.json, so this merge or push cannot be checked");
}
if (!CODE_REPO || /⟨/.test(CODE_REPO)) refuse("codeRepo in .claude/workflow.json is not filled in, so this merge or push cannot be checked");

const run = (cmd, args, dir = cwd) =>
  execFileSync(cmd, args, { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

// The directory a segment runs in: `cd <dir> && …` or `git -C <dir> …`, else the session's.
const dirOf = (segment, before) => {
  const c = segment.match(/\bgit\s+-C\s+("[^"]+"|\S+)/);
  if (c) return c[1].replace(/"/g, "");
  const cds = [...before.matchAll(/\bcd\s+("[^"]+"|\S+)/g)];
  return cds.length ? cds[cds.length - 1][1].replace(/"/g, "") : cwd;
};

const isCodeRepo = (dir) => {
  try {
    return run("git", ["remote", "get-url", "origin"], dir).replace(/\.git$/, "").endsWith(CODE_REPO);
  } catch {
    return false;
  }
};

// Every `gh pr merge`: refused when its pull request is the code repository's, into main.
for (const m of command.matchAll(/\bgh\s+pr\s+merge\b([^;&|\n]*)/g)) {
  const args = m[1].trim().split(/\s+/).filter(Boolean);
  const pr = args.find((a) => /^\d+$/.test(a) || /\/pull\/\d+/.test(a));
  const repoIdx = args.findIndex((a) => a === "-R" || a === "--repo");
  const repo = repoIdx >= 0 ? args[repoIdx + 1] : undefined;
  const dir = dirOf(m[0], command.slice(0, m.index));
  let base, url;
  try {
    [base, url] = run(
      "gh",
      ["pr", "view", ...(pr ? [pr] : []), ...(repo ? ["-R", repo] : []), "--json", "baseRefName,url", "-q", '.baseRefName + " " + .url'],
      dir,
    ).split(" ");
  } catch {
    refuse("could not tell which repository and branch this pull request merges into");
  }
  if (base === "main" && url.includes(`github.com/${CODE_REPO}/pull/`)) refuse("this pull request merges into main");
}

// A push to the code repository whose destination is main: `main`, `HEAD:main`, `x:refs/heads/main`.
for (const m of command.matchAll(/\bgit\s+(?:-C\s+(?:"[^"]+"|\S+)\s+)?push\b([^;&|\n]*)/g)) {
  const refspecs = m[1].trim().split(/\s+/).filter((a) => a && !a.startsWith("-")).slice(1);
  const dir = dirOf(m[0], command.slice(0, m.index));
  if (refspecs.some((r) => /(^|:)(refs\/heads\/)?main$/.test(r)) && isCodeRepo(dir)) refuse("this push writes to main");
}

process.exit(0);
