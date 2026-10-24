---
title: Home
type: meta
status: accepted
updated: 2026-10-24
tags: [moc, index]
related: ["[[Project Charter]]", "[[CONVENTIONS]]", "[[_meta/manifest|manifest]]"]
---

# System Design — Map of Content

> [!info] Entry point
> This is the **Map of Content (MOC)** for the whole design vault. Every major area links from here. If you are Claude reading this vault for the first time, read in this order: [[Project Charter]] → [[_meta/manifest|manifest]] → [[CONVENTIONS]] → [[_ADR Index]].

## At a glance

- **What this vault documents** — the project's name, its capability, its audience and its domain — lives in the **[[Project Charter]]**, and in no other note. One site means nothing here can contradict anything else about the subject.
- **Where the build stands is not a vault document** — it lives on the GitHub Project that spans this repository and the code repository ([[CONVENTIONS]] §10), and in the code itself. Verify any build claim against the repo, never against a note.
- **Every agent starts here, and `/sync` is its first act** — the vault, the guard and the project in one pass. The code repository carries no instructions of its own; it is built from a session started in this vault ([[CONVENTIONS]] §10.1).

## Navigation

> Sections mirror the folders exactly, so there is only ever one taxonomy. **For the order to read them in, see [[_meta/manifest|the manifest]]** — folder names carry subject, not sequence.

### Overview
- **[[Project Charter]]** — **what this vault is for.** The single source of truth for the subject, and the note the human owns.

### Decisions
- **[[_ADR Index]]** — every accepted decision, one row each. **Read this before proposing anything.**

### _meta
- [[_meta/manifest|manifest]] — what exists, and the reading order
- `check-vault.mjs` — the mechanical drift guard. Run it before scanning by eye.

## How to work in this vault

1. New idea? It stays in conversation until you decide it. **Nothing undecided is written to this vault** ([[CONVENTIONS]] §3) — there is no parking lot. A deliberate deferral gets an ADR if it is load-bearing, and a deferred item on the tracking project if it is not ([[CONVENTIONS]] §10).
2. Made a choice? Write it into the living note that owns it — that note is as authoritative as any ADR. Only a **load-bearing** choice — one whose later change would make data wrong or break other parts of the design — also gets an [[_ADR Index|ADR]]. **An ADR records a decision the human made** — Claude proposes, the human decides, then it is written ([[CONVENTIONS]] §3).
3. New note? Copy the matching template from `_templates/` so the frontmatter is correct.
4. Diagrams are **always Mermaid** in fenced ` ```mermaid ` blocks — never pasted images.
5. **Nothing transient lives here** — no handoffs, plans, roadmaps, checklists or session notes, **of any kind** ([[CONVENTIONS]] §6). A document that survives here is one that is **true indefinitely**. The build — its items, its phases, its blocks, its deferrals — is tracked on the GitHub Project and nowhere in the vault; a note never links to an item there ([[CONVENTIONS]] §10).
6. **No visuals** — no mockups, comps, screenshots or rendered output ([[CONVENTIONS]] §7). The contract belongs here; the artifact does not.
7. **No note describes its own maturity** ([[CONVENTIONS]] §6.1) — no "currently empty", "not yet written", "as the vault grows", no initialization dates, no status snapshots. Write what is, not what is missing. A line guaranteed to need overwriting is drift by construction, and if it is *not* overwritten the drift shipped silently. The sole exception is a count the guard verifies.
8. **The subject is stated once** — in the [[Project Charter]]. Never restate the project's name, scope or audience in another note; link there instead.
9. **A rule and its mechanism are written together** ([[CONVENTIONS]] §9) — the rule in plain words, and directly under it a **Mechanism** box naming the software and how it carries the rule out. The box is design, never a report on the code. One note per subject; never a conceptual note and a technical one.
