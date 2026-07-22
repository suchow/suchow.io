---
layout: tutorial
title: "A tutorial on computationally reproducible research"
description: "A hands-on tutorial on making research computationally reproducible: diagnosing the ways analyses fail to reproduce and matching each failure mode to a fix."
permalink: /reproducible-research/
category: hidden
body_class: tutorial-page donthyphenate
---

Science is an exercise in seeing further by standing on the shoulders of
giants. What happens when those shoulders give way? Even setting aside the
question of whether a finding holds up in new data, there is a humbler test
that a surprising fraction of published research fails: given the same data
and the same code, can anyone (including the original author, a year later)
get the same results?

The evidence says: often not. When 85 research teams were given the same
study to reproduce, those working with the original code matched the
published numbers exactly only [77% of the
time](https://royalsocietypublishing.org/doi/10.1098/rsos.241038); those
working without it, 48%. A large-scale investigation of the social and
behavioral sciences found that only about [54% of
claims](https://www.nature.com/articles/s41586-026-10203-5) could be
precisely reproduced even when data were available, and data were available
for only a quarter of the papers sampled. An audit of computational articles
in *Science*, a journal with a data-sharing policy, managed to reproduce
[26%](https://www.pnas.org/doi/10.1073/pnas.1708290115).

The encouraging news is that computational reproducibility, unlike so much
in research, is almost entirely under your control. The failures follow
recognizable patterns, and each pattern has both a cheap fix and a robust
one.

## How this tutorial works

This is a diagnostic tutorial. Instead of marching through a list of tools,
it teaches you to recognize the recurring failure modes of computational
research and to match each one to an appropriate intervention, from minimal
interventions like explicit seeding and dependency pinning to robust
solutions like containerization and workflow automation.

Many of the examples are live: they run real Python directly in your browser
(no installation required), so you can watch an analysis fail to reproduce,
poke at it, and fix it yourself.

<div class="tutorial-callout" markdown="1">
**Bring a project.** The tutorial ends with an audit you apply to a research
project of your own, in any language. If you have one in reach, keep it
handy; the final part turns what you've learned into two concrete
improvements you can make this week.
</div>

## The tutorial

<ul class="section-links">
  <li><strong><a href="/reproducible-research/foundations/">Part 1 · Foundations</a></strong>:
  What reproducibility is (and isn't), why the definitions are genuinely
  confusing, how close "the same result" has to be, and what large-scale
  reproduction efforts have found. <em>~30 minutes.</em></li>

  <li><strong><a href="/reproducible-research/failure-modes/">Part 2 · Failure modes</a></strong>:
  The heart of the tutorial: a taxonomy of the ways computational research
  fails to reproduce (hidden randomness, numerical instability, dependency
  drift, implicit state, fragile workflows, and stochastic-but-equivalent
  results), each demonstrated live, in runnable code. <em>~45 minutes.</em></li>

  <li><strong><a href="/reproducible-research/lab/">Part 2½ · Diagnostics lab</a></strong>:
  A small, realistic, broken analysis. Find the three reproducibility bugs
  and fix them until the result matches the "published" claim. <em>~20
  minutes.</em></li>

  <li><strong><a href="/reproducible-research/interventions/">Part 3 · Interventions</a></strong>:
  Matching fixes to failure modes: a decision framework, then working tours
  of the tools that implement it: version control, environment pinning,
  containers, workflow automation, and archiving. <em>~45 minutes.</em></li>

  <li><strong><a href="/reproducible-research/audit/">Part 4 · The audit</a></strong>:
  A reproducibility rubric to score any project (including the one you
  brought), and a personal upgrade plan: your two highest-leverage
  improvements. <em>~30 minutes.</em></li>
</ul>

## Materials

<ul class="section-links">
  <li><a href="/reproducible-research/templates/">Templates</a>: copy-paste
  starting points: environment files, lockfiles, a research Makefile, a
  one-command run script, a README skeleton, and a .gitignore for research
  projects.</li>
  <li><a href="/reproducible-research/resources/">Resources</a>: an
  annotated guide to going deeper: handbooks, courses, communities, the
  empirical literature, the tool ecosystem, and reproducibility in the age
  of AI.</li>
</ul>

## The one-table summary

The whole tutorial builds toward this one table:

| Failure mode | Minimal fix | Robust fix |
|---|---|---|
| Hidden randomness | Explicit seeds | Container + pinned stack |
| Numerical instability | Pin versions | Tolerance tests |
| Dependency drift | Lockfile (`uv.lock`, `renv.lock`) | Container (Docker/Apptainer) |
| Implicit state | Relative paths, no hidden globals | Workflow manager |
| Fragile workflows | A README that lists the steps | One-command automation (`make`) |

The deeper principle, from [Jon Claerbout, by way of Buckheit &
Donoho](https://doi.org/10.1007/978-1-4612-2544-7_5):

> An article about computational science in a scientific publication is not
> the scholarship itself, it is merely advertising of the scholarship. The
> actual scholarship is the complete software development environment and the
> complete set of instructions which generated the figures.
> <cite>Buckheit & Donoho (1995), paraphrasing Claerbout</cite>

## About these materials

This tutorial was created by [Jordan Suchow](/) at Stevens Institute of
Technology, where he studies the reproducibility of the behavioral and
social sciences ([Miske et al.,
2026](https://www.nature.com/articles/s41586-026-10203-5); [Breznau et al.,
2025](https://royalsocietypublishing.org/doi/10.1098/rsos.241038)) and
builds systems for automated reproducibility auditing. The text is released
under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and the code
under the [MIT license](https://opensource.org/license/mit/). The in-browser
Python runtime builds on [Pyodide](https://pyodide.org) and
[CodeMirror](https://codemirror.net).
