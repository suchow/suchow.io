---
layout: tutorial
title: "The audit"
kicker: "Part 4"
description: "A reproducibility rubric for scoring any research project across six stages, and a personal upgrade plan: your two highest-leverage improvements."
permalink: /reproducible-research/audit/
category: hidden
body_class: tutorial-page donthyphenate
---

*Part 4 of [a tutorial on computationally reproducible
research](/reproducible-research/). Bring a project, in any language.*

---

Everything so far becomes practical here. You'll score a real project,
ideally one of yours, against a six-stage rubric, then convert the score
into a plan: the two improvements with the best ratio of leverage to effort.

The rubric's six stages follow the life of an actual reproduction attempt,
because that is the test your project will eventually face. A stranger must,
in order: obtain your materials, reconstruct your workflow, recreate your
environment, execute the analysis, compare the outputs to the paper, and
assess what the comparison means. A project is only as reproducible as its
weakest stage. A perfect environment does not matter if the data cannot be
obtained, and obtainable data does not matter if nobody can tell which
script produces Table 2.

## The rubric

Score each stage 0, 1, or 2, and be strict with yourself. It takes about
fifteen minutes; the audit is a diagnostic, and nobody is grading it. (If you didn't bring a project, audit
the last paper you read whose materials you can access. That is instructive
in a different way.)

### Stage 1 · Materials: can they get what the analysis consumes?

The materials are every input a rerun consumes: data, code, stimuli,
trained models, and documentation of any manual steps.

- **0**: Materials live only on personal machines, or "available upon
  request."
- **1**: Materials are in a repository or archive, but incomplete (data
  without code, code without stimuli), undocumented, or without stable
  identifiers.
- **2**: Every input a rerun needs is deposited in a persistent archive
  with an identifier (DOI/SWHID) and checksums; anything that cannot be
  shared (restricted data) has a documented access protocol and a synthetic
  or subset stand-in.

### Stage 2 · Workflow: can they tell what to run, in what order?

- **0**: The order of operations lives in your memory; manual steps are
  undocumented.
- **1**: A README lists the steps and commands in order, including every
  manual step.
- **2**: One command runs everything (`make all`, `run.sh`, a workflow
  manager), and the claimed outputs regenerate from a clean checkout.

### Stage 3 · Environment: can they recreate the software it ran on?

- **0**: No record of package versions.
- **1**: Dependencies named with versions (a lockfile: `uv.lock`,
  `renv.lock`, `pixi.lock`), interpreter and OS versions recorded.
- **2**: A container image (or equivalent frozen environment) is built,
  tested from scratch, and archived with the project.

### Stage 4 · Execution: does it actually run, elsewhere?

- **0**: Never tested outside the machine and session that wrote it.
- **1**: Runs end-to-end after Restart & Run All / a fresh clone on your
  machine.
- **2**: Verified on a second machine or a fresh environment (a colleague,
  a clean container, CI), with run time and resource needs documented.

### Stage 5 · Comparison: do the outputs match the paper, verifiably?

- **0**: Matching is eyeballed, or nobody has rerun since the figures were
  exported.
- **1**: Key results are checked by hand against the manuscript after
  reruns; seeds are recorded; stochastic results state a tolerance.
- **2**: An executable check (the lab's step 4, [scaled
  up](/reproducible-research/interventions/#verification-make-reproduction-checkable))
  asserts every headline number within an explicit tolerance, and runs
  automatically.

### Stage 6 · Assessment: is the reproducibility status itself stated?

- **0**: The paper says nothing about how (or whether) its results
  reproduce.
- **1**: The paper or repository states what was verified, on what
  platform, at what tolerance, and what wasn't.
- **2**: Reproduction has been independently confirmed (a co-author working
  from the repo alone, a review service, an artifact badge), and the claim's
  scope is precise.

<div class="tutorial-callout" markdown="1">
**A note on interpreting your score.** Formal reproduction audits treat a
failed attempt as a timestamped observation rather than proof that a result
is intrinsically irreproducible: materials get found, environments get
rebuilt, blockers get cleared. Extend your own project the same charity, in
both directions. Today's score is a snapshot of the project as a stranger
would find it today, and the entire point is that this number is under your
control.
</div>

## Scoring

| Total | Reading |
|---|---|
| 0–3 | Reconstruction territory: a reproduction attempt would mostly be archaeology. Start with Stage 1 or 2, the cheapest points on the board. |
| 4–6 | Typical of well-intentioned published work (this is where audited literatures actually sit). One or two interventions move you dramatically. |
| 7–9 | Materials and intent are there; the gaps are mechanical (lockfile, runner, second-machine test). |
| 10–12 | You clear the bar most published computational work misses. Remaining points are robustness: containers, executable checks, independent verification. |

Two structural observations from the reproduction literature help calibrate
your score. Availability failures (Stage 1) are the modal failure; in the largest audit,
[data were obtainable for only ~24% of
papers](https://www.nature.com/articles/s41586-026-10203-5), so Stage 1
points protect against the most common fate. And code sharing roughly
[doubled exact
reproduction](https://royalsocietypublishing.org/doi/10.1098/rsos.241038) in
the one study that measured it experimentally, so Stage 1's code half is the
single highest-leverage artifact you control.

## The upgrade plan

Now turn the scores into commitments. Look at the six numbers and plan
three phases: a quick win, a structural fix, and a re-audit. Use these
rules:

1. **Fix the lowest stage first.** The reproduction chain breaks at its
   weakest link; a 0 anywhere caps everything downstream.
2. **Prefer the cheap point.** Moving 0→1 nearly always beats moving 1→2
   somewhere else. A README beats a workflow manager you won't set up; a
   lockfile beats a container you won't build.
3. **Anchor each phase to an artifact.** "Improve reproducibility" is a
   wish; "commit `uv.lock` and a `run.sh`" is a plan.

Write it in this shape (and put it somewhere you'll see it):

> **Project:** anxiety-rt
>
> **Audit:** M2 W1 E0 X1 C1 A0 → 5/12
>
> **Phase 1, the quick win:** Environment 0→1. Run `uv lock`; commit
> `pyproject.toml` and `uv.lock`; record OS and Python versions in the
> README.
>
> **Phase 2, the structural fix:** Workflow 1→2. Fold the README steps into
> a `Makefile` with a final `check` target asserting Table 2's values.
>
> **Phase 3, the re-audit:** re-score all six stages at the next natural
> checkpoint (submission, revision, or release), and pick the next two.

Typical phase-1-and-2 pairs, by profile: no version control → Git plus a
push to a repository, then a step-ordered README. Git with nothing pinned →
lockfile, then one-command runner. Solid pipeline, never verified →
executable check of headline numbers, then a clean-machine (or container)
run. Finished project, moving on → archive deposit with DOI (repo, lock,
data), then a stated reproducibility note in the README.

## The audit, kept

Re-run the audit at natural checkpoints (submission, revision,
camera-ready, and once after publication) because scores decay:
dependencies drift, registries purge, links rot. The [templates
page](/reproducible-research/templates/) has this rubric as a copyable
checklist (`AUDIT.md`) you can keep in the repository itself, so the project
carries its own reproducibility ledger.

<div class="tutorial-discussion" markdown="1">
## Discussion questions

1. Which stage scored lowest, and did that surprise you? What is the story
   behind it?
2. Trade phase-1 plans with a partner and commit out loud: what is your
   artifact, and what is theirs?
3. What is the highest-leverage change your lab (not you individually)
   could make this year?
4. For those with data that can't be shared: what can you share, and what
   does a good stand-in look like in your area?
</div>

---

*That's the tutorial. From here:
[templates](/reproducible-research/templates/) for the files to copy,
[resources](/reproducible-research/resources/) for going deeper, or [back to
the start](/reproducible-research/).*
