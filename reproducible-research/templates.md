---
layout: tutorial
title: "Templates"
description: "Copy-paste starting points for reproducible research: environment files, lockfile setups, a research Makefile, a one-command run script, an executable results check, a README skeleton, a research .gitignore, and the audit checklist."
permalink: /reproducible-research/templates/
category: hidden
body_class: tutorial-page donthyphenate
---

*Companion to [a tutorial on computationally reproducible
research](/reproducible-research/). Each template is shown inline and
downloadable; together they implement the
[interventions](/reproducible-research/interventions/) for a typical
analysis project. Or grab [all of them as one zip
file](/assets/reproducible-research/reproducible-research-templates.zip).*

<!-- Regenerate the zip after editing any template:
     cd assets/reproducible-research && rm -f reproducible-research-templates.zip \
     && cp -R templates /tmp/reproducible-research-templates \
     && (cd /tmp && zip -X -r reproducible-research-templates.zip reproducible-research-templates) \
     && mv /tmp/reproducible-research-templates.zip . && rm -rf /tmp/reproducible-research-templates -->

---

The templates below fill the slots of this reproducible project skeleton:

```
rt-study/
├── README.md            ← README-template.md
├── .gitignore           ← gitignore-research.txt
├── pyproject.toml       ← pyproject.toml   (+ uv.lock, generated)
├── Makefile             ← Makefile         (or run.sh)
├── Dockerfile           ← Dockerfile       (when you need the robust tier)
├── AUDIT.md             ← AUDIT.md
├── analysis/
│   ├── 01_clean.py  02_model.py  03_figures.py
│   └── 04_check.py      ← check.py
├── data/                (raw inputs, or fetch instructions + checksums)
├── results/             (regenerated; never committed)
└── figures/             (regenerated; never committed)
```

## Environment

**[pyproject.toml](/assets/reproducible-research/templates/pyproject.toml)**
is a uv-managed Python project. `uv lock` turns it into `uv.lock`; commit
both.

```toml
[project]
name = "rt-study"
version = "1.0.0"
requires-python = "==3.12.*"        # pin the interpreter line too
dependencies = [
    "numpy==2.3.*",
    "pandas==2.3.*",
    "matplotlib==3.10.*",
]
```

**[environment.yml](/assets/reproducible-research/templates/environment.yml)**
is the conda-ecosystem equivalent (conda-forge only; prefer pixi for a true
lockfile).

**[renv-lock-excerpt.json](/assets/reproducible-research/templates/renv-lock-excerpt.json)**
shows what an R `renv.lock` records, annotated. `renv::init()` and
`renv::snapshot()` write the real one; remember it pins packages without
pinning R itself.

**[Dockerfile](/assets/reproducible-research/templates/Dockerfile)** is the
robust tier: everything pinned, build once, archive the image tarball with
the release.

## Workflow

**[Makefile](/assets/reproducible-research/templates/Makefile)** encodes the
dependency graph as executable documentation; `make all` regenerates
everything, `make check` verifies the paper. (Recipe lines are tab-indented,
the classic gotcha.)

**[run.sh](/assets/reproducible-research/templates/run.sh)** is the minimal
alternative: steps in order under `set -euo pipefail`, so nothing fails
silently.

## Verification

**[check.py](/assets/reproducible-research/templates/check.py)** states the
paper's claims as an executable test, one line per headline number, each
with an explicit tolerance:

```python
CLAIMS = [
    ("mean RT difference (ms)", results["rt_diff_ms"], 65.9, 0.05),
    ("bootstrap CI lower",      results["ci_low"],     48.0, 0.05),
    ("bootstrap CI upper",      results["ci_high"],    84.0, 0.05),
]
```

## Documentation

**[README-template.md](/assets/reproducible-research/templates/README-template.md)**
is the reader-facing contract: what's here, the one command that reproduces
everything, expected runtime, data access and checksums, seeds and
tolerances, license and citation.

**[gitignore-research.txt](/assets/reproducible-research/templates/gitignore-research.txt)**
follows one principle: commit inputs and code; regenerate the rest. Rename
it to `.gitignore`.

**[AUDIT.md](/assets/reproducible-research/templates/AUDIT.md)** is the
[Part 4 rubric](/reproducible-research/audit/) as a checklist that lives in
the repository, so the project keeps its own reproducibility ledger.

---

*Back to the [tutorial](/reproducible-research/) · onward to
[resources](/reproducible-research/resources/).*
