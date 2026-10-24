---
name: sync
description: Load the entire design vault into context, run the guard, then review the GitHub Project that tracks the build — and report current state, open conflicts and any drift. Run at the start of every session, design or build, so Claude advises and delegates with full, unadulterated context. Use when the user types /sync, asks Claude to "load context", "sync up", "read everything", or starts substantive design or build work from a cold session.
---

# /sync — load full vault context, then review the project

The purpose of this skill is to guarantee that, before giving any design guidance or starting any build work, you have read the **entire** design vault — not the auto-memory index, not a guess, the actual files — and then reviewed the project that tracks the build ([[CONVENTIONS]] §10.1). The vault is the single source of truth for what the system is; the project is the only record of what is being done about it; and the second is only readable once the first is loaded, which is why this is one command and not two. The user has explicitly opted into this exhaustive load for the sake of collaboration quality.

## Steps

1. **Load the subject and the map.** Read `Overview/Project Charter.md` first — it is the only note that says what this vault is for (name, capability, audience, domain). Then `_meta/manifest.md` and `CONVENTIONS.md` — the folder map, the reading order, and the authoring contract. Then `.claude/workflow.json` — which code repository and which board this vault's build lives on.

2. **Read every design note.** Read every `.md` file in the design folders, plus `Home.md`, **in the order `_meta/manifest.md` gives** — the manifest's *Reading order* section is the authority, because folder names carry subject, not sequence. Do not sample — read them in full. Skip only `.obsidian/`, `_templates/` (unfilled placeholders, not design — read it only if a template question arises), and binary files. ⚠ **Depth is never a judgment call:** read every design note in full, every session, however narrow the task looks. There are no canvases or drawings to skip — the vault holds **no visual design at all** ([[CONVENTIONS]] §7). Use Glob (`**/*.md`) to enumerate, then read each. Reading them in parallel is fine.

3. **Build the state picture.** As you read, track:
   - Accepted **ADRs** (from `Decisions/`) — the immutable decisions.
   - Each note's `status` (`draft` / `accepted` / `implemented` / `deprecated`) — how much to trust it. A `draft` ADR is a proposal awaiting the human's ruling, never a decision.
   - The `related:` graph — how notes connect.
   - ⚠ **Every `type: platform` note's `verified:` date.** These are the only claims in the vault that go false without anyone editing them. Note any that are stale.

4. **Run the mechanical guard FIRST — before scanning by eye.** `node "_meta/check-vault.mjs"`. It verifies, against the files, what a human keeps getting wrong by re-reading: **ADR numbering** contiguity, every ADR carrying a settled status, every accepted ADR holding an index row **and a link from at least one living note** · every **`[[wikilink]]`** resolving, frontmatter included · **frontmatter schema** on every note · **platform notes carrying `verified:` + `sources:`**, and warning when a verification goes stale · **folders flat (depth one) and present in the manifest map** · **no drawing, scene or image file — and no drawing plugin — anywhere** ([[CONVENTIONS]] §7) · **no transient documents** ([[CONVENTIONS]] §6) · **no maturity prose and no todo callouts** ([[CONVENTIONS]] §6.1) · **no claims about what is built** ([[CONVENTIONS]] §9) · **no note linking to an issue, a pull request or the project** ([[CONVENTIONS]] §10) · **`updated:` vs. mtime** (advisory — a sync client rewrites mtimes) · **every `⟨field⟩` in the Project Charter and in `.claude/workflow.json` filled in**.
   - **A FAIL is drift — report it, do not re-derive it by reading.**
   - **If you hand-fix a countable fact, add a check for it here in the same pass.** That is the standing rule ([[CONVENTIONS]] §8). A fact this script can verify must never again be verified by reading.
   - The guard cannot read prose for meaning. It proves the *numbers* agree; step 5 is still needed for a semantic contradiction.

5. **Run a conflict / drift scan** (the part no script can do). Actively look for:
   - Two notes that assert contradictory things (e.g. an `accepted` decision a `draft` note ignores).
   - **A living note that contradicts an accepted ADR.** Either the note is stale or a decision was made without an ADR — both are defects ([[CONVENTIONS]] §2). Surface it; do not pick a winner.
   - A note whose `related:` links are stale, missing, or point to renamed notes.
   - A decision the human has made that no ADR or living note records.
   - The manifest's folder map or reading order disagreeing with the files on disk.
   - **Anything written in the voice of a decision the human has not made.** A proposal formatted as settled record is the defect this standard exists to prevent.
   - **A rule with no Mechanism box under it, or a box that reports on the code rather than designing it** ([[CONVENTIONS]] §9).
   - **The project's name, scope or audience restated outside `Overview/Project Charter.md`** ([[CONVENTIONS]] §8). One subject, one site; a second copy is drift waiting to happen.
   - **Any note naming what is being built, what phase it is in, or what is deferred** ([[CONVENTIONS]] §10). That lives on the tracking project; a note that carries it is a handoff document in disguise.

5b. **Review the project — the same pass, after the vault, never instead of it** ([[CONVENTIONS]] §10.1). The build is tracked on one GitHub Project, titled `board` in `.claude/workflow.json`, spanning this repository (`vaultRepo`) and the code repository (`codeRepo`). Find it by title — `gh project list --owner <owner>` — and read its items with `gh project item-list <number> --owner <owner> --format json`.
   ⚠ **That listing names a custom field by its display name in lower case, spaces kept** — `"finished by"`, not `finishedBy`. A wrong spelling returns empty for every row, which reads exactly like a field nobody set. Dump one item and read its real keys before filtering on any custom field. If a listing looks empty or short, confirm from the issue side (an issue's `projectItems`) before concluding anything, and never re-add an item on the strength of an empty listing.
   Then answer these, in this order, because each decides what the session is for:
   - **What is the build stopped on?** Open `conflict` issues in this repository — `gh issue list -R <vaultRepo> --label conflict --state open` — each with the rules it names and what it blocks. These are questions the human has to answer, and the notes they cite are the ones you just read. Open `deferred` issues are listed beside them, as what has been deliberately left open.
   - **What is blocked behind those?** The build items each open conflict is *blocking* — read the relationship itself (`blockedBy` on each issue, through the GraphQL API), not only the *Blocked on design* status, which is derived from it — so the human sees what a ruling unblocks.
   - **What is free to take?** Build items that are unblocked and not done — the candidates for a subagent this session. **Say which of them `Finished by` marks as a person's**, because those are the ones that will stop for the human mid-phase ([[CONVENTIONS]] §10.3).
   - **Is a phase finished and unmerged?** Every item of a milestone *Done* with its branch not yet in the code repository's main branch. That phase is waiting on the human, and what it is waiting for is its sign-off sheet ([[CONVENTIONS]] §10.3).
   - **Is the timeline accurate?** Every open milestone of the code repository with its due date, in order. Report any whose date has passed while it is open — the timeline is stale, and the next milestone manager re-dates it ([[CONVENTIONS]] §10.2). Do not re-date from here.
   - **Is the board empty?** Then the next phase has to be planned, in conversation, against the vault; nothing is built until it becomes items the human has approved.
   **Then set right anything the board has wrong.** The board is derived from what you just read, and only two workflows on the project maintain it while no agent is running — an item closing becomes *Done*, and a new issue in the code repository is added to the board. Everything else is yours: an open `conflict` or `deferred` issue in this repository that is not on the board is added; an item still marked *Blocked on design* whose blockers have all closed goes back to *Not Started*; an item with an open blocker that is not marked blocked is marked; an item with no status is *Not Started*; an item whose `Finished by` is empty is read from its `Rule` — a person where the governing section requires one, the agent otherwise ([[CONVENTIONS]] §10.3). **Any item reading *Done* that was closed as not planned or as a duplicate is set *Canceled*** ([[CONVENTIONS]] §10.2). **Any other item reading *Done* whose change is already on its repository's main branch is set *Live*** — a vault issue once the edit that resolved it is on this repository's main, a milestone-less issue once its fix is on the code repository's ([[CONVENTIONS]] §10.2). **Reconcile *Live* against the branches, never against the board**: an item is *Live* when the phase branch it merged into has reached the code repository's main branch, and an item reading *Live* whose phase was abandoned is corrected ([[CONVENTIONS]] §10.2). **Never set *Done* on an item no verification passed, and never close one** — a close on a verified merge belongs to the session that merged it, and every other close is the human's. Report what you corrected.
   - **Check the code repository's branches against the two kinds** ([[CONVENTIONS]] §10.2): every remote branch is `main`, a `milestone/…` or an `issue/…`. Report any other by name — do not delete it; an unmerged branch is read before anything happens to it. **And check every issue reached its parent as one commit**: on each open milestone branch, and on `main` since the last milestone merge, every non-merge commit's subject begins `#<n> ` and no issue number appears twice. Report each that does not.
   - **Check every open item's `Rule` link resolves**, here rather than in the guard — the guard reads files and never the network, and that is worth keeping. A `Rule` link naming a note or a heading that no longer exists is drift of exactly the kind [[CONVENTIONS]] §10 rule 1 exists to prevent: the item still looks governed. Report each broken one with the item it belongs to; do not repair it by guessing which section was meant.
   If `gh` is unavailable, not signed in (it needs the `project` scope), or the project cannot be found, say exactly that in the report and continue — the vault loads without it, but **no build work starts without the project review having succeeded.**

6. **Report back** to the user, concisely:
   - ✅ Confirmation that the full vault is loaded (and roughly how many notes) — **and say honestly what you did NOT read.**
   - ✅ The **guard's verdict** (step 4) — pass, or the exact failures.
   - **Draft ADRs awaiting the human's review**, by name and what each decides. These are proposals, not decisions.
   - 🚧 **The project** (step 5b): open conflicts, each with the rules it names and what it blocks — or "none open"; what is blocked behind them; what is free to take, and which of those need the human; any phase finished and waiting to be merged; or that the board is empty and a phase needs planning. A conflict's resolution is a living-note edit or an ADR, and the human closes the issue once it is made.
   - ⚠️ **Conflicts / drift** found in step 5 — or "none found." Surface these; do not silently fix.

## Rules

- **Vault beats memory.** If anything in the files contradicts your assumptions or the auto-memory, the files win — say so.
- **Surface, don't silently fix.** Report conflicts and let the user decide. Only edit when asked.
- **Never write a decision the user has not made.** A proposal stays in **conversation** — never `Decisions/`, and never a parking-lot note ([[CONVENTIONS]] §3). This vault keeps no register of the undecided; the tracking project does ([[CONVENTIONS]] §10).
- **Keep the board; never populate it.** Step 5b's corrections — a status set right, a vault issue added to the board — are yours to make without asking, because they derive from what already exists. Creating anything new on it — an issue in either repository, or a draft item — never happens without the human's approval ([[CONVENTIONS]] §10 rule 5).
- **Never write build state into a note.** Phase, progress, what is blocked — the tracking project's, never the vault's ([[CONVENTIONS]] §10).
- Keep the final report tight and scannable — the reading is exhaustive, the summary should not be.
