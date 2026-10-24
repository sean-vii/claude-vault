---
name: weigh
description: Weigh one unfinished issue — is finishing it worth what it will cost? — and end in one of three ways: the next round, a cheaper exit, or a brief to the person. Run by the milestone manager every time an issue comes back unfinished (a failed verification, or an issue manager stopping short of done), before anything goes back. Use when /milestone reaches a failed round or a short report, or when the user types /weigh.
---

# /weigh — is finishing this issue worth what it will cost?

This skill carries out the weighing in [[CONVENTIONS]] §10.4. The rule is stated there: when the weighing happens, its three outcomes, and the two things no exit may do. **This file holds only the steps and never restates the rule.** Where the two appear to disagree, §10.4 is right and this file is what changes. The steps are written so a person can sharpen them as experience shows where the weighing goes wrong.

## Who runs this

**The milestone manager runs it, itself**, every time an issue comes back unfinished. It is never handed to a subagent, because an issue manager deep in a fault is the one least able to judge whether the fault is worth it.

## The steps

Work from what the verifier and the issue manager reported, and from the issue. Write each answer down in a line; the brief in step 6 is built from them.

1. **Say what is wrong in words a person would recognise.** Describe what someone sees, not the mechanism. For example: "on a search page, a filter click sometimes does nothing". Do not write "a state update is dropped".

2. **Weigh the harm.** Who meets the fault (a visitor, an operator, the record itself, a developer, only the test run), how often, and what it costs them when it happens. Grade it:

   | Grade | What it looks like |
   |---|---|
   | **Serious** | a record wrong, lost or wrongly changed · a fault that leaves no trace · a page or request that errors · a long process that dies and has to be redone · a permission or privacy failure · a gate or check that lies |
   | **Moderate** | a person has to repeat an action, or sees something stale or wrong that corrects itself · a developer's setup or a test that fails often enough to waste a run |
   | **Minor** | a rare annoyance that one more click or a reload clears · a test that fails rarely, testing something real by other means |

   ⚠ Grade by the fault, not by the test that found it. A flaky check can expose a serious fault, and a fault that leaves data wrong without a trace is never minor.

3. **Say what is established.** Is the cause known, a hypothesis, or unknown? Does it reproduce reliably, rarely, or not at all? Does a fix already exist that only needs proving?

4. **Estimate the cost of going on.** Is the next round a clear step (cause known, fix in hand, proof cheap), or another search? Give a rough figure in rounds and hours. When it cannot be estimated, say so. "Cannot estimate" is an answer, and it usually means another search.

5. **Look for every cheaper exit.** Consider each of these, and name each one that applies, with its rough cost:
   - **A dependency upgrade or a known fix upstream,** where the fault sits in a library.
   - **A remedy that meets the rule more simply** than the one being chased.
   - **Removing a flaky test that is not the issue's subject,** with the fault it exposed opened as an issue (§10.3 standard 9, §10.5).
   - **Splitting the hard part into an issue of its own,** where the issue's checks pass without it (§10.5).
   - **Parking the issue** now rather than at round five.

6. **Decide.**

   | Harm | Next round a clear step | Next round another search |
   |---|---|---|
   | **Serious** | the next round | **the person** |
   | **Moderate** | the next round | an exit if one is cheap, otherwise **the person** |
   | **Minor** | the next round if it is cheap, otherwise an exit | an exit |

   A minor fault never comes to the person merely because its cost cannot be estimated: that is the cost of a search, and a minor fault does not earn one.

   Effort already spent counts for nothing on either side. Ask only what the next step costs and what it buys.

## Each outcome

- **The next round:** carry on as `/milestone` says. Nothing is recorded beyond the round.
- **An exit:** carry it out:
  - A remedy becomes the next round's direction, sent with the failed checks.
  - A removed test and a split are opened as issues.
  - A park follows `/milestone`'s park row.
  - Record it on the sheet as a fork: what was chosen, what was not.
- **The person:** leave the issue's branch as it is, and send the brief below in the conversation, with a notification. Carry on with the rest of the milestone. When the person answers, apply the answer and record it on the sheet as a fork.

The brief is short and written for someone who has not been following the issue:

```markdown
## #<n> <title> — worth finishing?

**What's wrong:** <step 1, one sentence>
**Who meets it:** <who, how often, what it costs them> — <grade>
**Spent:** <rounds>, about <hours> · **Known:** <cause / reproduction> · **Unknown:** <what is not>

| Option | Rough cost | Leaves behind |
|---|---|---|
| Keep going: <the next step> | <rounds, hours, or "cannot estimate"> | <what is fixed if it works> |
| <each exit from step 5> | <cost> | <what stays broken, and where it is recorded> |

**I'd pick:** <option>, because <one clause>
```

## Rules

- **Weigh value against cost, never effort against a limit.** A long, hard round on a serious fault is fine. A short one on a trivial fault may not be.
- **An exit never loosens a check, and never merges a failure** (§10.3 standard 8). An exit changes what is built or what is tested, openly. It never changes what counts as passing.
- **Run it every time an issue comes back unfinished, not only when it feels long.** A weighing nobody is made to do is one nobody does.
