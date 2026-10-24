---
name: milestone
description: Run one milestone end to end as its milestone manager — order its issues, hand each to an issue manager, have each verified, squash-merge the ones that pass into the milestone branch, verify the phase whole, and open the pull request into main carrying the sign-off sheet. Also runs a single issue that belongs to no milestone, as a milestone of one. Use when the user types /milestone, or asks to run, build, work or finish a milestone, a phase, or a milestone-less issue.
---

# /milestone — manage one milestone, end to end

This skill carries out [[CONVENTIONS]] §10.1–§10.5. Those sections are the contract — the three roles, the two kinds of branch, the squash, the verification standards, the five rounds, an issue manager's scope, and the sign-off sheet. **This file holds only the steps and never restates a rule**; where the two appear to disagree, CONVENTIONS is right and this file is what changes.

**The argument is a milestone** (its number or title in the code repository), **or `#<n>`** — an issue that belongs to no milestone, run as a milestone of one whose parent branch is `main`.

**The code repository, the board, the handoff folder and the gate's commands are read from `.claude/workflow.json`**, written below as `codeRepo`, `board`, `handoffDir` and `gate`. The code checkout is this session's second working directory, from the local settings.

## Before anything

1. **`/sync` has run this session**, and its board review succeeded. If not, run it. Nothing starts without both.
2. **Read the milestone**: its description, and every open issue in it with its `Rule`, `Finished by`, priority and body. An issue with no `Rule` is not buildable — it is a design question ([[CONVENTIONS]] §10 rule 6); leave it out and put it under *Needs you*. **Read every closed issue an open issue names as its predecessor, and their pull requests** ([[CONVENTIONS]] §10.1).
3. **Read every section each `Rule` names, in full, on this repository's `main`** — the whole section, its Mechanism box included. You will quote these; you cannot quote what you have not read.

## Set the milestone up

4. **Open with the setup issue.** Read the board for open test-harness issues — flaky setup, leaking background jobs, a shared test database. One this milestone's issues cannot be verified reliably without belongs to this milestone ([[CONVENTIONS]] §10.2): add it to this milestone, complete in every field ([[CONVENTIONS]] §10), order it first, and list it under *Needs you*. Once `deployedToProduction` is true, propose it on the sheet instead.
5. **Order the issues** cheapest to check first, unless one depends on another ([[CONVENTIONS]] §10.2). **Check each issue carries everything its system's work needs** — its interfaces, its observability, what a person sees ([[CONVENTIONS]] §10.2); where one is missing, it is a gap in the issue, and goes under *Needs you* before the issue is handed out. Give each a budget — about 80 tool calls unless the issue is plainly larger. Plan what runs at once: issues may run in parallel only where they touch different files. Assign anything numbered in sequence — a migration, say — up front. Allow one full test run on the machine at a time; a timing pass always runs alone.
6. **Make the milestone branch** from `main` in the code repository: `milestone/<milestone-number>-<short-slug>`. For a milestone of one, make none — the parent is `main`.
7. **Note this repository's current commit** — `git -C <vault> rev-parse --short HEAD`. Every handoff and every merge names it.

## For each issue, in order

**Count the issues this session has taken to a merge or a park. At ten, start no new issue** ([[CONVENTIONS]] §10.1): finish or stop the one in hand, write the handoff to `<handoffDir>/milestone-<milestone-number>.md` — the milestone and its branch, the vault commit, each issue's state and round, what is in flight, and every fork, finding, re-date and issue opened that the sheet will need — tell the person a context refresh is due, and stop. **At the start of a run, read that file if it exists**, resume from it, and delete it.

8. **Move it to *In Progress* and assign it** to the account the agents run on. **Then have its checks written first** ([[CONVENTIONS]] §10.3, standard 1): hand a fresh `verifier` the issue, its governing sections quoted, **[[CONVENTIONS]] §10.3 quoted**, and the two lists from step 9. It runs `/verify` in *before the build* mode, posts its checks and traps on the issue, and runs nothing.
9. **Hand it to an issue manager** — the `issue-manager` agent — with exactly this, and nothing you concluded about how to build it:
   - that it is **issue #n of the `<board>` board, sent by the milestone manager of a session started in the vault** — the sentence the code repository's tripwire file asks for;
   - the code directory, the **parent branch** it must branch from and open its pull request into, and the issue branch name `issue/<n>-<short-slug>`;
   - the issue's title, body and number, and **the vault commit**;
   - where the issue names closed issues it follows on from, **what they built, where it lives and why**, from their issues and pull requests — and never to the verifier;
   - **the governing sections, quoted in their own words**, and **[[CONVENTIONS]] §10.1's paragraphs on subagents, §10.4 and §10.5, quoted**;
   - **the method**, where the evidence takes a shape — a number of runs, a reproduction before a fix, a measurement. Diagnose locally; never push a commit only to run it in CI, and never start a CI run on an issue branch. A builder proves a fix once; repeat counts under load, and CI, are the verifier's. Never poll CI;
   - that **every test it adds or changes is written through the `/write-test` skill**, and recorded on the pull request as that skill says;
   - the **known-mistakes list** — `known-mistakes.md` beside this skill, whole — failure classes to check before reporting; quote any vault section a line points to where the issue touches it;
   - the **known-notes list** — `known-notes.md` beside this skill, plus the titles of the open issues in the code repository that belong to no milestone, read now (`gh issue list -R <codeRepo> --state open --search "no:milestone"`) — open notes not to re-report;
   - **the checks and traps written in step 8, whole** — what the build will be held to; it builds to them and says in its report how it meets each;
   - its budget, and which round this is (1 to 5).
10. **When it reports done**, hand the issue to a fresh **verifier** — the `verifier` agent — with: the issue number and its pull request, the issue branch, the vault commit, the governing sections quoted, **[[CONVENTIONS]] §10.3 quoted**, the gate's commands from the workflow file, the method for any repeat count or load run, and the two lists from step 9. **Hand it nothing the issue manager said.** Every assertion it adds is written through `/write-test`, and it reads the pull request's *Tests* lines only once its own checks are posted. It starts from the checks on the issue, and runs `/verify` in item mode.
11. **Before handing over, check the rule did not move under the issue**: `git -C <vault> diff <vault commit>..main -- <each governing file>`. A governing section changed since the issue was built is a finding — give the issue manager the new text as the next round.
12. **Resolve the round:**

    | The verifier reports | You |
    |---|---|
    | **pass** | squash-merge: `gh pr merge <pr> --squash --delete-branch --subject "#<n> <issue title>" --body "Vault: <commit>"`. Close the issue; set *Done*. **Where the milestone changes CI or the test setup**, run the whole gate locally on the milestone branch and read it before the next issue starts; red, it goes back as step 16 says. **Never start a CI run by hand.** |
    | **fail** | **run `/weigh` first** ([[CONVENTIONS]] §10.4). On *the next round*: send the failed checks, as the verifier wrote them — the claim, its rule, what happened — to the **same** issue manager by message, not a fresh one, as the next round. Not the verifier's reasoning; the checks are rules, the reasoning is not |
    | **the issue manager stops short** — its budget reached, or a cause it cannot establish | run `/weigh`, then act on its outcome as for a failure |
    | **fail, round 5** | park it: leave the branch unmerged, set *Not Started*, unassign, put it under *Needs you*, and carry on |
    | **a conflict** | open it from the `conflict` template, add it to the board, mark the issue blocked by it and set *Blocked on design*; carry on with the next issue. Once `deployedToProduction` is true, stop and ask the person first ([[CONVENTIONS]] §10 rule 5) |

13. **When an issue manager reports something outside its issue** ([[CONVENTIONS]] §10.5):
    - **it cannot finish without it** → open an issue in this milestone, complete in every field ([[CONVENTIONS]] §10), and order it next; the blocked issue resumes after it merges;
    - **otherwise** → open an issue with no milestone, complete in every field, and list it under *Needs you*.
    Once `deployedToProduction` is true, propose each on the sheet instead of opening it.
14. **Never run two issue managers on branches that will touch the same files at once.** Otherwise issues may run in parallel.

## Finish the milestone

15. **Every issue is *Done* or parked.** Then hand a fresh verifier the milestone branch, every issue's governing sections, **§10.3 quoted**, the milestone's description, the gate's commands, and the two lists from step 9. It runs `/verify` in phase mode on the milestone branch.
16. **A phase failure belongs to an issue.** Re-open that issue's branch from the milestone branch, give its issue manager the failed checks as a new round, squash it in again, and re-run phase verification. A failure no issue owns is §10.5's second bullet.
17. **Write the sign-off sheet** from the verifier's report, in exactly this shape ([[CONVENTIONS]] §10.3 holds its rules):

    ```markdown
    ## Sign-off — <milestone title>

    **Verdict:** Ready to merge | Not ready — <one clause> (any parked issue makes it Not ready)
    Vault `<commit>` · `milestone/<…>` · <n> issues, <p> parked

    ### Check by hand
    1. <step a person walks, and what they should see>   (at most 7)

    ### Numbers
    | Check | Measured | Limit | |
    |---|---|---|---|
    | <suite> | <pass> pass · <fail> fail · <skip> skip | 0 fail | ✅/❌ |
    | <each performance ceiling> | <value> | <limit> | ✅/❌ |
    | Held subjects | <n>, <moved or none moved> | — | |
    | Lint · build · vault guard | pass/fail | — | ✅/❌ |
    | Re-dated | <old date> → <new date>, <why>, every later milestone moved by the same — or none | — | |

    Skipped: <each skip and its reason> — or None

    ### Verification
    | Issue | Checks | How | Rounds | Result |
    |---|---|---|---|---|
    | #<n> <title> | <k> | <a> assertion · <b> interface · <c> none | <r> | ✅ / parked |

    ### Needs you
    | What | Where |
    |---|---|
    | <conflict · parked issue · fork: chose X over Y · draft ADR · issue opened> | #<n> |

    None.   (when empty)
    ```

18. **Open the pull request** from the milestone branch into `main`, titled with the milestone, its body the sheet. **Open it only now — never as an early draft.** **Then read its CI run** (`gh run watch`) — the milestone's first CI. Red: an environmental failure is opened as an issue of this milestone ([[CONVENTIONS]] §10.5), and a code failure goes back to the issue that owns it as in step 16; every fix pushed runs CI again, and the sheet is updated to match. The sheet is final only when that run is green. For a milestone of one, the issue's own pull request into `main` carries the sheet.
19. **Keep the timeline** ([[CONVENTIONS]] §10.2): move this milestone's due date to today, and every later open milestone's by the same amount, earlier or later — never changing their order. Do the same whenever the milestone runs past its due date while it is still being worked, and once the issues are written where the milestone was planned before them. Record each re-date for the sheet's *Numbers*.
20. **Stop.** You do not merge into `main` and you do not close the milestone; both are the person's ([[CONVENTIONS]] §10.2). Tell them it is ready and link the pull request.

## Rules

- **You manage; you do not build and you do not verify.** If you have written code for an issue, you can no longer hand it to a verifier as someone who has not.
- **Quote, never paraphrase.** A rule you summarised is a rule you may have changed, and neither subagent can open the vault to catch it.
- **Wake nobody mid-phase** except for the acts in [[CONVENTIONS]] §10.4's third row and an issue whose `/weigh` ends with the person. Everything else waits for the sheet.
- **The board is yours to keep in step as you go** — every status move above is made at the moment it happens.
- **Grow the two lists.** A failure class two issues hit belongs in `known-mistakes.md`; a known, open oddity every agent keeps re-reporting belongs in `known-notes.md` until its issue closes. Both are tooling, not notes, and carry nothing about any one phase.
