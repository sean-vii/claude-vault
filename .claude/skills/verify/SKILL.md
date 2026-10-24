---
name: verify
description: Verify one issue, or one milestone, against the vault rules that govern it — checks written from the rules before any code is read, then — on a final round, every test the change can reach; on a phase, the whole gate — and every performance ceiling run, every measured value recorded against its limit. Run by the verifier role, handed an issue or a milestone by the milestone manager. Use when the user types /verify, asks to check an issue, a branch or a milestone, or when /milestone reaches verification.
---

# /verify — check a build against the rules that govern it

This skill carries out [[CONVENTIONS]] §10.3. That section holds the standards — where checks come from, independence, assertions over reading, when an interface is driven, the whole gate, every performance number, the phase run, never explaining a failure away. **This file holds only the steps and never restates a standard**; where the two appear to disagree, §10.3 is right and this file is what changes.

**Three modes**: **before the build** — an issue's checks, written before any of it exists; an **issue** — on its issue branch; or a **phase** — on its milestone branch. Nothing else is verifiable.

**The gate's commands are the ones the milestone manager hands over**, read from `gate` in `.claude/workflow.json`: `gate.affected` for an issue's final round, `gate.phase` for a phase.

## Who runs this

**The verifier, and only the verifier.** If the session that invoked this skill is the milestone manager, or has built or read anything of the issue's change, **it does not run these steps**: it dispatches a fresh `verifier` agent with the issue or milestone, the branch, the vault commit, the governing sections quoted, §10.3 quoted and the gate's commands — and nothing else. The steps below are the verifier's.

**The verifier does not open the vault.** It works from what it was handed. Where what it was handed is not enough to write a check, it asks the milestone manager for the missing section and does not guess.

## Mode: before the build

1. **Read what you were handed**: the issue, its governing sections, §10.3, the two lists. You may read the existing code only to make a check concrete — the file it looks at, the command that runs it, the name a thing already has.
2. **Write the checks** as issue mode's step 2 does, each marked **cheap** (read, or the issue's own tests) or **heavy** (a full suite), cheap first.
3. **Write the traps** — each thing in the rules, the known-mistakes list or the known notes a builder of this issue is likely to meet, naming the rule and quoting its exact limit, count or value.
4. **Post both on the issue as a comment.** Run nothing, change nothing, and report the comment to the milestone manager — with any reading of the issue a person may want to rule on.

## Mode: an issue

1. **Read what you were handed**: the issue, its governing sections, §10.3. **Do not open the pull request's body, its commits or the diff.**

2. **Start from the checks on the issue** — written before the build — **and add any the rule requires that they miss, with no code open.** One row each:

   | Claim | Rule | How established | Silent? |
   |---|---|---|---|
   | what must be true, in the vault's words | the note and section it comes from | assertion · interface · none | would a failure leave a trace |

   Every row whose failure is silent is an assertion the build runs. If it does not exist, writing it on the issue branch is part of this verification.

3. **Post the checks on the pull request as a comment, now** — before step 4. On a later round, re-post only the checks you add; the rest stand.

4. **Check out the issue branch** in the code directory. Never make a branch. Your new assertions are committed on this branch, in one commit per round.

5. **Build it clean** before anything runs against it — remove build output left from before. On a later round, clean only what the fix touched.

6. **Run the cheap checks first** — the checks made by reading, and the issue's own tests (on a later round, the failed checks and the suites the fix touched). **If any fails, the round has failed — go to step 10, with no full suite run.** If all pass, this round is the final one, and its gate runs now: **on an issue, `gate.affected` with the parent branch as its last argument; on a phase, every command in `gate.phase`, in order.** Keep each command's output. A command that could not run is a gate that did not pass.

7. **On a final round or a phase, record every performance number against its limit** — every ceiling the governing sections set, read from the output, not from memory. On an earlier round, only a ceiling that failed or whose path the fix touched:

   | Ceiling | Limit | Measured | Where it is printed |
   |---|---|---|---|

   Where a check passes without printing its value, record *pass — value not printed* and report that gap once to the milestone manager; never invent the number. Report each held subject and whether it moved.

8. **Run your checks.** Assertion, interface or none, as recorded. An interface only against the clean build, at every size or mode the vault requires. **On the final round, run every test file the issue added or changed ten times in a row** — the file alone, never a whole suite — the branch's diff against its parent says which. One differing result fails the round; record it as a failed check naming the test and how many of the ten passed.

9. **Never kill a process by name or pattern.** Hold your own process ids; stop only those.

10. **Report to the milestone manager**, and nothing else:
    - **pass** or **fail**;
    - each check: its claim, its rule, how it ran, its result — for a failure, what happened;
    - every suite's passes, failures and skips, each skip named with its reason;
    - every number from step 7;
    - anything outside the issue you noticed, as one line each, **not fixed**.

    **You do not merge, close, set a status or open an issue.** Those are the milestone manager's.

## Mode: a phase

11. **Every issue of the milestone is *Done* or parked.** One in flight means the phase is not ready — say which.
12. **Check out the milestone branch** and build it clean.
13. **Re-run every issue's checks** — they are on each issue's pull request — **and add the cross-issue claims** the milestone exists for. Bound them by what this milestone set out to build ([[CONVENTIONS]] §10.3, standard 7); a rule a later phase owns is reported as out of scope, naming the issue that owns it.
14. **Read the milestone's description for what it says it leaves working.** That sentence is a check, and it is where the *Check by hand* steps come from: write at most seven, each a thing a person does and what they should see.
15. **Run the whole gate and record every number**, as steps 6 and 7. Add the vault guard — `node "_meta/check-vault.mjs"` in the vault — where the milestone touched the vault.
16. **Report to the milestone manager** in the sheet's own sections — verdict, check by hand, numbers, verification, and what needs a person — so the sheet is assembled rather than written. Each failure names the issue that owns it.

## Rules

- **Independence is the product.** Anything of the builder's that reaches you — a summary, a note, a conclusion — spends the only thing this buys.
- **Derive from the rule, never from the diff.**
- **A number, not a tick.** A ceiling that passed is reported with how close it came.
- **"No check is warranted" is a correct report where it is true.** A check invented to look thorough is read as evidence.
- **Report what is true, not what you did.**
