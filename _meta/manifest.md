---
title: Vault Manifest
type: meta
status: accepted
updated: 2026-10-24
tags: [meta, manifest, index]
related: ["[[Home]]", "[[Project Charter]]", "[[CONVENTIONS]]"]
---

# Vault Manifest

> **Purpose:** The map of the vault, and **the reading order**. Read this first to know what exists without crawling every folder. When the structure changes, update this file.

> [!important] **This file carries no history.** It is a map of what *is* — never a log of what happened. No session notes, no changelog, no dated "we did X" entries, no progress snapshots. ⚠ **Do not add them.** A changelog here is re-read by every `/sync`, at cost, and changes nothing an agent should do. If something that happened is still load-bearing, it belongs in the **rule** it produced ([[CONVENTIONS]]), the **decision** it produced (an ADR), or the **living note** it changed. History lives in the filesystem and in git, not here.

## Reading order

Folders are named, not numbered — **this section is the only thing that carries sequence.** Read in tiers; do not assume depth of your search based on task, always read everything.

**Tier 1 — the subject, the map and the contract. Never skip.**
1. [[Project Charter]] — **what this vault is for.** Name, capability, audience, domain. The only note that states them, and the one the human owns.
2. **This manifest** — what exists, and this order.
3. [[CONVENTIONS]] — the authoring contract: frontmatter, the two document kinds, Mermaid-only, decision discipline, the two standing bans (§6 nothing transient · §7 no visuals), rules written together with their mechanisms (§9), and how the build is run from here (§10).

**Tier 2 — the spine. Never give design guidance without these.**
4. [[_ADR Index]] — every accepted decision, one row each. **The decisions are binding; read this before proposing anything.** There is no companion list of the *un*decided — an open choice lives in conversation, never in a note ([[CONVENTIONS]] §3).

**Tier 3 — the design notes,** in the order this section lists them. Every folder in the map below appears here once it holds notes; the folder map says what exists, this section says what order to read it in.

**Tier 4 — `Decisions/`.** Read [[_ADR Index]], then **every ADR beneath it, in full.** The rows carry the decision; the bodies carry the *why* — and the *why* is what tells you whether a new proposal contradicts one. Never select a subset by what the task appears to touch.

## Folder map

Folders are **named, never numbered, and exactly one level deep** — no subdirectories anywhere ([[CONVENTIONS]] §5).

> [!important] **A folder is created when a note needs one — never in advance.** An empty folder is a claim about a taxonomy nobody has argued for: it decides where the next note lands before anyone has made the case, and it reads as coverage the vault does not have. When the first note of a new kind is written, choose its folder then, add a row here, and place it in the reading order above.

| Folder       | Contains                                                                            | Notes                                                                                |
| ------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `Overview`   | Scope and vocabulary — **the human's folder**                                       | **[[Project Charter]]** *(what this vault is for — read first)*                      |
| `Decisions`  | The decision log — ADRs, flat, never renumbered                                     | [[_ADR Index]] *(the decision log — read it, then every ADR beneath it)* |
| `_meta`      | Agent context + the mechanical drift guard. ⚠ **Nothing transient, and no history** | This manifest · **`check-vault.mjs`** *(run it via `/sync` before any scan by eye)*  |
| `_templates` | Note templates                                                                      | ADR · Living Note · Platform · Flow                                                  |

Root holds only [[Home]] *(the Map of Content)*, [[CONVENTIONS]], [[README]] *(the repo's front door — what this standard is, how it is set up and how it meets the code)* and `CLAUDE.md`. Repo tooling also sits there and is not a note: `.gitignore`; the `.github/` folder holding the two issue templates — *conflict* and *deferred* — through which the build raises a question against this vault ([[CONVENTIONS]] §10); and the `.claude/` folder holding the skills, the two agent roles, the hook that guards the code repository's main branch, and `workflow.json`, which names the code repository and the board. None of them carries frontmatter, and the guard skips `.github/` as it skips `.claude/`.

⚠ **[[README]] describes the scaffolding; [[Project Charter]] describes the subject.** The README is addressed to someone arriving at the repository, and states nothing about what any particular vault documents — that is the Charter's sole job ([[CONVENTIONS]] §8). It stays out of the reading order above for the same reason `CLAUDE.md` does: it teaches the system, it is not part of the design.

⚠ **`_templates/` is independent of the folder map.** A template is a tool, not a claim about structure — it may exist for a note kind that has no folder, and its presence never implies one should be created. `Platform.md` in particular carries the `verified:` / `sources:` contract ([[CONVENTIONS]] §1), which is the expensive part to re-derive.

## Project facts

**This vault's subject lives in the [[Project Charter]], and in no other note.** Name, capability, audience and domain are stated there once; what has been *decided* lives in [[_ADR Index]] and the ADRs beneath it. This manifest maps *what exists and in what order to read it*; it does not restate the subject, because a fact stated in two places is a fact that gets corrected in one ([[CONVENTIONS]] §8).

> [!important] Keep this file current: when a note is added, removed or renamed, fix the folder map and the reading order. Bump `updated:`. **Add no history, and no account of how far along the vault is** ([[CONVENTIONS]] §6.1).
