---
title: Note Title
type: strategy | engine | architecture | data | operations | charter | glossary
status: draft
updated: YYYY-MM-DD
tags: []
related: ["[[Other Note]]"]
---

# Note Title

<!--
  A LIVING NOTE is edited in place, forever. It describes the system AS IT IS
  NOW, and is a source of truth as authoritative as any ADR (CONVENTIONS §2).

  - To change it: edit it and bump `updated:`. Never recreate it.
  - Most facts here have no ADR. Link one only where a load-bearing decision
    stands behind the fact (CONVENTIONS §3); otherwise write the reasoning
    here, beside the fact, where it matters.
  - Every rule is followed directly by its Mechanism box (CONVENTIONS §9): the
    software, the named job, table or module, and how it carries the rule out.
    The box is design, never a report on the code — no code, no column list, no
    file path, and nothing about whether it is built.
  - Say what the system is; never what it lacks. A gap worth keeping goes to the
    tracking project as a deferred item (CONVENTIONS §6.1, §10).
  - If it contradicts an accepted ADR, that is a defect: either this note is
    stale, or a decision was made without an ADR. Surface it; do not pick a
    winner silently.
-->

> **Purpose:** One sentence — what this note is for and what depends on it.

## Overview

What this is, in plain language, before any detail.

## The rules

**Each rule is one bold sentence in plain words.** Its reasoning sits beside it where the reasoning matters. Diagrams are Mermaid in fenced blocks ([[CONVENTIONS]] §4), never images.

> [!abstract] Mechanism
> How the rule above is carried out: the software, the named job, table or
> module, the steps in order, what is written together and what follows, and
> what happens on failure. Detail an agent would otherwise have to guess
> belongs here.

## Non-goals

What this deliberately does not do. As load-bearing as the goals.

## Decisions

The load-bearing ADRs this note depends on, if any. `[[ADR-NNNN - title]]`
