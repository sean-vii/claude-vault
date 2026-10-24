# Known mistakes

Failure classes to check before reporting. The milestone manager hands this file whole to every issue manager and verifier. A line that names a vault section points to the rule; it does not restate it — the section is quoted in the handoff where the issue touches it.

The lines below hold for any codebase. Add the ones your own codebase teaches you — a port two runs fight over, a cache two worktrees share, a command that behaves differently on one operating system — one line each, as they are found.

- A repeating job may overlap itself; make a second run harmless.
- A test that can pass and fail on the same code is never added ([[CONVENTIONS]] §10.3, standard 9). The usual causes: waiting a fixed time instead of on the thing awaited; a tight wall-clock tolerance; background work left running into the next test; concurrent requests to a server that is not yet listening; shared state between tests. Wait on a condition, own and stop what the test starts, and assert on outcomes rather than on timing — a performance ceiling the vault sets is the one timing assertion.
- A check that asserts something is absent passes on nothing when its locator matches nothing. Assert first that the place it searches exists and has the expected entries.
- A change to anything the setup or start commands run is proven on every operating system the project supports, by running those commands, not by reading the code.
- A wait loop built on matching a process by its command line can match its own command line and never end. Wait on the process id you started, or on a file the script writes.
- Scratch files go in a folder of your own. Sibling agents overwrite each other's files in a shared scratch folder.
- A build cache shared between worktrees can replay another branch's result. A gate run forces a fresh build.
- A verifier pushes nothing to a milestone branch. An assertion it adds goes on the issue branch it verifies, or in phase mode it is reported and left on an unpushed local branch.
