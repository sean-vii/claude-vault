---
name: write-test
description: Write one test in the code repository — of any kind — by its kind's recipe, prove it gives one answer by running it ten times in a row, and record it on the pull request. Run by the issue manager and the verifier for every test they add or change, and by nobody writing a test any other way. Use when a build or a verification needs a test written or changed, or when the user types /write-test.
---

# /write-test — write a test that gives one answer

This skill carries out [[CONVENTIONS]] §10.3, standard 9 — *no flaky test is ever added*. The rule is there; **this file holds only the recipes and never restates a rule.** Where a recipe names a ceiling, the number is the vault's and is read from the code, never written here.

**Every test is written through this skill** — a builder's, a verifier's, a pure function's, an interface's. It is the one way a test is written, so every test is written the same way and leaves the same record. Where the code repository has a lint rule refusing the known flaky patterns, it is the backstop; the skill is what keeps a test from reaching it.

**Where each kind lives is the code repository's convention**, stated in its own `README`. A recipe below says what a test of that kind must do, never which folder it goes in.

## Steps

1. **Name the kind.** Exactly one of the recipes below. A test that seems to be two kinds is two tests.
2. **Write it to that recipe**, where the code repository keeps that kind.
3. **Check it against *Never*** below, line by line.
4. **Run it ten times in a row** — the one test, or its file where the test cannot run alone, never a whole suite — on an otherwise idle machine, and keep the output. A single differing result is a flaky test: fix it, and run ten again from one. A test that cannot be made to give one answer is not added.
5. **Record it** — one line on the pull request, under a heading *Tests*, per test added or changed:

   `<kind> · <file>:<test name> · asserts <what, in one clause> · 10/10 on <commit>`

   The verifier reads these lines, and the milestone's sign-off sheet counts them.

## The recipes

| Kind | For | The recipe |
|---|---|---|
| **Pure function** | anything that touches no store and reads no clock — a calculation, a parser, a rule applied to data | hand it inputs, compare the output. No database, no queue, no time. A clock it needs is passed in, never read |
| **Integration** | anything that goes through the program's own interface, a queue or a store | **start before you call** — the server is listening, the queue is running, before any request is made. **Own what you start**: every job the test queues is finished or removed before the test ends; every process or connection it opens is closed. Assert on the response and on the record, never on a log line |
| **Concurrency** | two acts racing on one record — a lock order, two writes landing together | **real overlap**: start every act before awaiting any. Where the race window is too narrow to hit by repetition, **force the interleaving** — hold one act at a named point until the other has committed — rather than repeating and hoping. Wait on a condition, never on a time. State the full set of answers the rule allows, and fail on any other |
| **Count** | a ceiling stated as a count — queries per read, rows scanned, calls made | count, never time. Count only what the measured call did. Measure at every size the ceiling names and compare them |
| **Timing** | a performance ceiling the vault sets, and nothing else | measure the span the ceiling names, the way the vault says (median where it says median), alone on the machine. The ceiling is a constant in the code. **This is the only kind that may assert on a duration** |
| **Interface** | what a person uses — a screen, a command line, a public endpoint as a caller sees it — and nothing else | one run on the machine at a time, on its own ports and data. Sign in, where it needs one, as a test identity created for the purpose. Wait for the thing to appear — a role, a text, a state — never for a number of milliseconds. Check at every size or mode the vault requires |
| **Fixture** | data a test reads | in the one fixtures place of the program it belongs to — never beside a single test. Real captured data where somebody else's shape matters. A fixture is shared, so changing one is changing every test that reads it — run them all |

## Never

These are the known causes of a test that passes and fails on the same code.

- **A fixed wait** — a sleep, a timer, a promise that resolves after *n* ms — in place of waiting on the thing awaited.
- **Concurrent requests to something that is not yet listening.**
- **A tight wall-clock tolerance** on anything but a performance ceiling. Two moments that the code should make equal are compared by value.
- **Background work left running** into the next test — a job, a timer, an open connection, a process not stopped.
- **Shared state between tests** — a row, a key, a port or a database another test can see and change. Each test makes what it reads, or reads a fixture nobody writes.
- **An order dependency** — a test that passes only after another one ran.
- **An assertion on what is incidental** — a log line, an exact error string from somebody else's library, the order of an unordered set.
- **A retry** that turns a failure into a pass. Retrying is a behaviour the code may have; it is never a test's way of getting the answer it wants.
