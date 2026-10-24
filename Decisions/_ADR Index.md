---
title: ADR Index
type: adr
status: accepted
updated: 2026-10-24
tags: [adr, decisions, index]
related: ["[[CONVENTIONS]]", "[[Project Charter]]", "[[Home]]"]
---

# _ADR Index

> **Purpose:** Architecture Decision Records — the durable log of the **load-bearing** decisions the system as a whole depends on ([[CONVENTIONS]] §3). Everything else is decided in the living notes, which are just as authoritative. An ADR is **immutable once accepted**; to change a decision, write a new ADR that supersedes it.

> [!important] **Reading a superseded or amended ADR.** An accepted ADR's **body is never rewritten** — so an older ADR can still assert a decision a later one has replaced. To make that safe to read, an affected ADR carries a **forward-pointer banner** immediately under its frontmatter, naming what changed and, just as importantly, **what still stands**. The `Status` column below carries the same information. **If an ADR has a banner, read the banner first.**

> [!note] **This index lists accepted and superseded decisions only.** A draft ADR — one Claude has written and the human has not ruled on — gets **no row here** ([[CONVENTIONS]] §3); the guard lists drafts on every run instead, so they stay visible without posing as decisions. An open *question*, with no drafted answer, is not written to the vault at all: it lives in conversation until the human decides it. A choice the human has deliberately *deferred* is itself a decision — if it is load-bearing it gets its own ADR, naming what is deferred and what would end the deferral; if not, it is a deferred item on the tracking project ([[CONVENTIONS]] §10).

## The log

| # | Decision | Status | Date |
|---|---|---|---|

A row states the decision in one line — what was chosen, in the present tense — so the index answers most questions without opening the ADR. The body carries the *why*.

## Adding a decision

1. Copy `_templates/ADR.md` to `Decisions/ADR-NNNN - short title.md` — next number, zero-padded, never reused. It starts at `status: draft`.
2. Fill Context → Decision → Consequences → Alternatives considered.
3. **Tell the human the draft is ready and say what it decides. Stop there.** The status stays `draft`, and no row is added, until the human rules on it ([[CONVENTIONS]] §3).
4. **Once the human accepts it:** set `status: accepted`, add a row below, bump `updated:`. **Do not write a count anywhere** — `/sync` reads every ADR, and the guard checks numbering and status against the files ([[CONVENTIONS]] §6.1).
5. Link the ADR from the living note that uses it.
