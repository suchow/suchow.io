---
layout: tutorial
title: "Diagnostics lab"
kicker: "Part 2½"
description: "A small, realistic, broken analysis. Find the three reproducibility bugs and fix them until the results match the published claim."
permalink: /reproducible-research/lab/
category: hidden
body_class: tutorial-page donthyphenate
---

*Part 2½ of [a tutorial on computationally reproducible
research](/reproducible-research/). This lab assumes the [failure-mode
taxonomy](/reproducible-research/failure-modes/).*

---

## The scenario

A (fictional) paper reports an attention study:

> Participants high in trait anxiety responded more slowly than participants
> low in trait anxiety, mean difference = 65.9 ms, 95% bootstrap CI
> [48.0, 84.0].

You have the authors' data and their analysis scripts, reproduced below as
four steps sharing one workspace, exactly as they'd share a notebook. Your
job: run the pipeline, watch it fail to reproduce the paper, diagnose why,
and fix it until the final check passes. There are three distinct
reproducibility bugs, one per analysis step, each an instance of a failure
mode from [Part 2](/reproducible-research/failure-modes/).

Work top to bottom. After any edit, re-run the edited cell and everything
below it (you know why: [implicit
state](/reproducible-research/failure-modes/#4--implicit-state)). If a later
step reports a `NameError`, an earlier step hasn't run yet in this session;
go back and run the steps in order.

## Step 1 · Load the data

<div class="pycell" data-group="lab">
<script type="text/x-python" data-role="setup">
with open("rt_data.csv", "w") as f:
    f.write(
"""participant,group,rt
P01,high,585
P02,low,512
P03,high,601
P04,low,498
P05,high,560
P06,low,541
P07,high,623
P08,low,509
P09,high,577
P10,low,530
P11,high,549
P12,low,487
P13,high,610
P14,low,522
P15,high,568
P16,low,545
P17,high,594
P18,low,503
P19,high,557
P20,low,518
P21,high,640
P22,low,475
P23,high,538
P24,low,551
""")
</script>
<script type="text/x-python" data-role="code">
path = "/Users/ana/projects/anxiety-rt/data/rt_data.csv"

rows = []
with open(path) as f:
    next(f)  # header
    for line in f:
        pid, group, rt = line.strip().split(",")
        rows.append((pid, group, int(rt)))

print("loaded", len(rows), "rows")
</script>
</div>

<details>
<summary>Hint (step 1)</summary>
<p>You are not Ana. Where does the file actually live? The data file has
been placed in the working directory for you, the same place a
well-organized repository would keep it, relative to the project root.</p>
</details>

<details>
<summary>Answer (step 1)</summary>
<p><strong>Bug: implicit state, in the form of a hardcoded absolute
path.</strong> Change the path to the relative <code>"rt_data.csv"</code>
and re-run: 24 rows. In a real project: all paths relative to the project
root, and the README says where to put (or how to fetch) the data.</p>
</details>

## Step 2 · Apply inclusion criteria

The authors excluded two participants who failed attention checks (P23,
P24), then, per their preregistration, analyzed "the first 20 of the
remaining participants."

<div class="pycell" data-group="lab">
<script type="text/x-python" data-role="code">
passed = {"P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08",
          "P09", "P10", "P11", "P12", "P13", "P14", "P15", "P16",
          "P17", "P18", "P19", "P20", "P21", "P22"}

included = list(passed)[:20]
data = [r for r in rows if r[0] in included]

print("included", len(data), "participants:")
print(sorted(included))
</script>
</div>

Re-running the cell above gives the same 20 every time, which is exactly
what makes this bug treacherous: hash randomization is fixed per interpreter
process, so on <em>your</em> machine the selection looks stable. The
question is whether Ana's machine picked the same 20. The cell below runs
the same selection in a throwaway fresh interpreter each time, as if on a
different computer (your lab workspace above is untouched). Run it two or
three times and watch who gets excluded.

<div class="pycell" data-readonly data-fresh="process">
<script type="text/x-python" data-role="code">
passed = {"P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08",
          "P09", "P10", "P11", "P12", "P13", "P14", "P15", "P16",
          "P17", "P18", "P19", "P20", "P21", "P22"}

included = list(passed)[:20]
print("this machine excluded:", sorted(set(passed) - set(included)))
</script>
</div>

<details>
<summary>Hint (step 2)</summary>
<p>What determines the order of <code>list(passed)</code>? (You saw this in
<a
href="/reproducible-research/failure-modes/#1--hidden-randomness">failure
mode 1</a>.) Note that the lab cell's printout is sorted for display, which
is exactly how this bug hides in real logs.</p>
</details>

<details>
<summary>Answer (step 2)</summary>
<p><strong>Bug: hidden randomness, via "first 20" of a
<code>set</code>.</strong> A set's iteration order depends on per-process
hash randomization, so <code>list(passed)[:20]</code> selects a different
subsample on (almost) every machine. No error, plausible output, and a
different wrong answer everywhere. Fix: make the ordering explicit:
<code>included = sorted(passed)[:20]</code>, which selects P01–P20, matching
the paper. Then re-run steps 3 and 4.</p>
</details>

## Step 3 · Estimate the effect

<div class="pycell" data-group="lab">
<script type="text/x-python" data-role="code">
import random

high = [rt for pid, g, rt in data if g == "high"]
low  = [rt for pid, g, rt in data if g == "low"]

diff = sum(high) / len(high) - sum(low) / len(low)

def boot_ci(high, low, n=2000):
    diffs = []
    for _ in range(n):
        h = [random.choice(high) for _ in high]
        l = [random.choice(low) for _ in low]
        diffs.append(sum(h) / len(h) - sum(l) / len(l))
    diffs.sort()
    return diffs[int(0.025 * n)], diffs[int(0.975 * n)]

lo, hi = boot_ci(high, low)
print("mean difference:", round(diff, 1), "ms")
print("95% bootstrap CI: [", round(lo, 1), ",", round(hi, 1), "]")
</script>
</div>

<details>
<summary>Hint (step 3)</summary>
<p>Run this cell twice without changing anything. Does the CI hold still?
Should it?</p>
</details>

<details>
<summary>Answer (step 3)</summary>
<p><strong>Bug: hidden randomness, via an unseeded bootstrap.</strong> The
point estimate is deterministic, but the resampling isn't: every run gives
a slightly different CI, none of them the paper's. Fix: seed the generator
before resampling by adding <code>random.seed(2026)</code> on the line
before <code>lo, hi = boot_ci(high, low)</code> (the seed the authors
reported). The CI is now bit-stable run to run: bit-exact given the seed,
statistically stable across seeds, which is failure mode 6's two-layer
standard.</p>
</details>

## Step 4 · Check against the paper

This cell is the referee: it compares your pipeline's numbers against the
published claim.

<div class="pycell" data-group="lab">
<script type="text/x-python" data-role="code">
import math

PUBLISHED = {"diff": 65.9, "ci": (48.0, 84.0)}

ok_diff = math.isclose(round(diff, 1), PUBLISHED["diff"], abs_tol=0.05)
ok_ci = (math.isclose(round(lo, 1), PUBLISHED["ci"][0], abs_tol=0.05) and
         math.isclose(round(hi, 1), PUBLISHED["ci"][1], abs_tol=0.05))

print("mean difference reproduced:", "yes" if ok_diff else "NO")
print("confidence interval reproduced:", "yes" if ok_ci else "NO")
print()
print("REPRODUCED" if ok_diff and ok_ci else "not yet: keep diagnosing")
</script>
</div>

<details>
<summary>Full solution (all three bugs)</summary>
<ol>
<li><strong>Step 1</strong>, implicit state: hardcoded absolute path →
<code>path = "rt_data.csv"</code>.</li>
<li><strong>Step 2</strong>, hidden randomness: set-ordered inclusion →
<code>included = sorted(passed)[:20]</code>.</li>
<li><strong>Step 3</strong>, hidden randomness: unseeded bootstrap →
<code>random.seed(2026)</code> immediately before <code>boot_ci</code>.</li>
</ol>
<p>With all three fixes, re-run steps 1→4 in order: difference 65.9 ms, CI
[48.0, 84.0], and step 4 prints REPRODUCED.</p>
</details>

## What to take away

Each bug leaves behind a habit:

1. **Paths:** if an absolute path appears anywhere in analysis code, it is a
   reproduction failure waiting for its audience.
2. **Order:** any time your code depends on the order of a collection, ask
   who guarantees that order. If the answer is "nobody," sort.
3. **Seeds:** the moment randomness enters, the seed is part of the method.
   Report it like you'd report the sample size.

And one meta-lesson: notice how the pipeline never raised an error. Every
bug produced plausible numbers. The check in step 4, an executable statement
of what the paper claims, is what made the failures visible, and it's a
miniature of what continuous verification looks like in [Part
3](/reproducible-research/interventions/).

<div class="tutorial-discussion" markdown="1">
## Discussion questions

1. The three bugs raised no errors. What is your closest near-miss with a
   silently wrong number, and what caught it?
2. If your current project had a step-4-style check, what three lines would
   be in its `CLAIMS` table?
3. In your lab, whose job is it to catch bugs like these before
   publication? Is that assignment real or notional?
</div>

---

*Next: [Part 3 · Interventions](/reproducible-research/interventions/).*
