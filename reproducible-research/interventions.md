---
layout: tutorial
title: "Interventions"
kicker: "Part 3"
description: "Matching fixes to failure modes: version control, environment pinning, containers, workflow automation, archiving, and verification, with current (2026) tool advice."
permalink: /reproducible-research/interventions/
category: hidden
body_class: tutorial-page donthyphenate
---

*Part 3 of [a tutorial on computationally reproducible
research](/reproducible-research/). Ready-to-copy files for everything here
are on the [templates page](/reproducible-research/templates/).*

---

Tools matter here only as interventions on failure modes. This part works
through the decision table from the end of [Part
2](/reproducible-research/failure-modes/), column by column: for each
intervention, what it protects against, the minimal version, the robust
version, and current advice on the tooling (which has changed meaningfully
in the last few years; some famous advice is now stale).

| Failure mode | Minimal fix | Robust fix |
|---|---|---|
| Hidden randomness | Explicit seeds | Seeds + pinned stack |
| Numerical instability | Pin versions, stable reductions | Deterministic modes, tolerance tests |
| Dependency drift | Committed lockfile | Container image |
| Implicit state | Relative paths, pinned dates | Clean-slate workflow runs |
| Fragile workflows | Ordered README | One-command automation |
| Stochastic estimation | Seeds + stated tolerances | Convergence + tolerance tests in CI |

One principle before the tools: make the repository the whole truth. Every
intervention below is a way of moving something (versions, steps,
environments, tolerances) out of your head and into the project, where a
stranger, or you in three years, can find it.

## Version control: the substrate

Git is the precondition for everything else: it gives every state of the
project an identifier, which is what makes "the code that produced Figure 3"
a meaningful phrase. If you adopt exactly one practice from this tutorial,
adopt this one.

```sh
git init
git add analysis/ data/README.md environment/ Makefile README.md
git commit -m "Analysis as of first submission"
git tag v1-submission
```

The reproducibility-specific habits, beyond the basics:

- Commit the environment files and the workflow (lockfile, Makefile,
  scripts), along with the analysis code itself.
- Tag the states that correspond to claims: submission, revision,
  publication. A tag turns "which version did the paper use?" into a
  one-word answer.
- Never commit what the pipeline can regenerate (intermediate files,
  figures). If outputs live in the repo, nobody can tell whether they're
  stale. Commit inputs and code; regenerate the rest. (The [templates
  page](/reproducible-research/templates/) has a research `.gitignore`.)
- Data that is large or sensitive stays out of Git; it goes in an archive or
  restricted store, and the repo holds the pointer and the checksum (see
  [archiving](#archiving-give-every-artifact-a-permanent-address)).

If you're new to Git, the Carpentries' [Version Control with
Git](https://swcarpentry.github.io/git-novice/) is the standard on-ramp; the
tutorial's [resources page](/reproducible-research/resources/) has more.

## Environments: pin the foundation

The fix for [dependency
drift](/reproducible-research/failure-modes/#3--dependency-drift) comes in
two strengths. The minimal fix is a lockfile: a machine-readable record of
the exact version of every package, including transitive dependencies, with
checksums. The robust fix is a container: the lockfile's guarantee extended
down through the interpreter and the operating system.

**Python (2026 advice).** Use [uv](https://docs.astral.sh/uv/). It replaced
the pip/virtualenv/pyenv/poetry stack for most new work (one fast tool, one
`pyproject.toml`, one cross-platform `uv.lock`) and has become the de facto
default for new projects.

```sh
uv init rt-study && cd rt-study
uv add "numpy==2.3.*" pandas matplotlib
uv lock                  # writes uv.lock — commit this file
uv run python analysis/main.py   # anyone, anywhere: same versions
```

If your project needs conda-ecosystem binaries (compiled scientific stacks,
R and Python together), use [pixi](https://pixi.sh), which brings the same
lockfile discipline to conda packages. Two cautions worth knowing: install
from conda-forge (via Miniforge or pixi) rather than the Anaconda `defaults`
channel, which now requires a paid license for organizations over 200
people; and a plain `environment.yml` without pins is documentation rather
than reproducibility, since it names wishes rather than versions.

**R.** Use [renv](https://rstudio.github.io/renv/): `renv::init()`, then
`renv::snapshot()` produces `renv.lock`; a collaborator runs
`renv::restore()`. Two caveats: `renv.lock` pins packages without pinning R
itself (record the R version, and pair with a container when it matters),
and if you encounter older advice recommending packrat, it's deprecated;
renv replaced it.

**Containers.** A container image freezes OS, interpreter, and libraries
into one runnable, archivable artifact: the strongest practical answer to
software collapse. [Docker](https://www.docker.com/) is standard on laptops;
on HPC clusters the standard is [Apptainer](https://apptainer.io/), the tool
formerly named Singularity (update your bookmarks and your methods
sections). A research Dockerfile is short; the discipline is pinning:

```dockerfile
FROM python:3.12.3-slim        # exact tag, never :latest
COPY pyproject.toml uv.lock ./
RUN pip install uv==0.7.13 && uv sync --frozen
COPY analysis/ analysis/
CMD ["uv", "run", "python", "analysis/main.py"]
```

(Practices: [Nüst et al.'s ten simple rules for
Dockerfiles](https://doi.org/10.1371/journal.pcbi.1008316); the
[Rocker](https://rocker-project.org/) images for R.) Two operational notes
from recent years: Docker Hub now rate-limits anonymous pulls, so academic
CI should mirror images (GitHub Container Registry works well); and when you
publish, push the image to a registry and also archive a `.tar` of it with
the paper's artifacts, because registries retire images.

**Which strength do you need?** A lockfile costs minutes and covers the
large majority of drift. Reach for a container when your stack includes
system libraries (BLAS, GDAL, CUDA), when you're on someone else's cluster,
or when the project is finished and being archived, the moment "runs today"
must become "runs in 2036."

## Automation: one command, clean slate

The fix for [fragile
workflows](/reproducible-research/failure-modes/#5--fragile-workflows) and
most of [implicit
state](/reproducible-research/failure-modes/#4--implicit-state) is the
oldest idea in this tutorial, Claerbout's 1992 standard: the entire analysis
regenerates from a single command.

The minimal version is a `run.sh` that lists the steps in order, failing
loudly:

```sh
#!/usr/bin/env bash
set -euo pipefail            # stop on first error, no silent skips
uv run python analysis/01_clean.py
uv run python analysis/02_model.py
uv run python analysis/03_figures.py
echo "done — outputs in results/"
```

The classic robust version is `make`, which adds the dependency graph: each
output declares its inputs, so `make` runs steps in the right order, skips
what's current, and rebuilds exactly what an edit invalidates:

```makefile
results/clean.csv: data/raw.csv analysis/01_clean.py
	uv run python analysis/01_clean.py

results/model.json: results/clean.csv analysis/02_model.py
	uv run python analysis/02_model.py

figures/fig3.pdf: results/model.json analysis/03_figures.py
	uv run python analysis/03_figures.py

all: figures/fig3.pdf
.PHONY: all
```

`make all` is now the project's entry point, and it doubles as executable
documentation of the pipeline's structure. When pipelines outgrow Make
(many configurations, cluster execution, resumable long runs), graduate to a
workflow manager: [Snakemake](https://snakemake.github.io/)
(Python-flavored), [Nextflow](https://www.nextflow.io/) (common in
bioinformatics), or [targets](https://docs.ropensci.org/targets/) for R (the
successor to drake). For notebook-centric projects, the minimal discipline
is the one from Part 2 (Restart & Run All before every commit), and
[Quarto](https://quarto.org/) or [Jupyter Book](https://jupyterbook.org/)
can render the whole manuscript from code as the robust version.

A notebook-adjacent warning: services that promise "click to run this
notebook in the cloud" are wonderful for teaching (this tutorial runs on one
philosophically) and are also unreliable as archives.
[mybinder.org](https://mybinder.org), the community's beloved instance, has
nearly shut down more than once for lack of funding. Treat hosted
executability as a bonus on top of an archived, locally runnable artifact,
never as the artifact.

## Verification: make reproduction checkable

The lab's step 4 (an executable check against the claimed numbers) scales up
into real practice. State each headline result as an assertion with an
explicit tolerance (the standard you chose in [Part
1](/reproducible-research/foundations/#how-close-is-the-same)):

```python
# analysis/04_check.py — the paper's claims, as code
import json, math

results = json.load(open("results/model.json"))
assert math.isclose(results["rt_diff_ms"], 65.9, abs_tol=0.05)
assert math.isclose(results["ci_low"],  48.0, abs_tol=0.05)
print("all published values reproduced")
```

Add that as the final Makefile target and your project self-verifies: one
command runs the pipeline and confirms the paper's numbers fell out. Run it
in CI (GitHub Actions, on every push) and drift becomes visible the day it
happens instead of the day a reader emails you. This is the same shape
(materials → execution → comparison → assessment) that formal
reproducibility audits use, and it's what services like
[CODECHECK](https://codecheck.org.uk/) certify independently.

## Archiving: give every artifact a permanent address

Reproducibility has a time-horizon problem: repositories move, registries
purge, lab servers die. Recall from [Part
1](/reproducible-research/foundations/#what-the-evidence-shows) that
availability, ahead of correctness, is the first wall, with data obtainable
for only about a quarter of papers. The fixes:

- **Archive the release.** Deposit the tagged repository, the lockfile, the
  container image tarball, and the data (or its access protocol) with
  [Zenodo](https://zenodo.org/) or [OSF](https://osf.io/), both free and
  DOI-granting. Zenodo's GitHub integration archives a release in one click.
- **Cite software by identifier rather than URL.** Software Heritage
  archives source code at planetary scale and issues
  [SWHIDs](https://www.swhid.org/), now an ISO standard, that identify exact
  code states independent of any hosting platform.
- **Checksum everything.** A SHA-256 in the README next to each data file
  turns "is this the same file?" from a vibe into a computation.
- **Package with metadata when sharing formally.**
  [RO-Crate](https://www.researchobject.org/ro-crate/) is the emerging
  standard for bundling data, code, and provenance with machine-readable
  structure; FAIR-minded repositories increasingly speak it.

The order of operations at publication time: tag → lock → build image → run
the self-check → deposit (repo + lock + image + data + README) → put the DOI
in the paper. The whole ritual takes half an afternoon, once per paper, and
your work outlives every laptop involved.

## Choosing your two

The point of the decision table is that you do not need everything at once.
In [Part 4](/reproducible-research/audit/) you'll audit a real project and
pick the two interventions with the best leverage-to-effort ratio for that
project. Empirically informed defaults: if you have no version control,
that's #1 by a mile; if you have Git without a lockfile, a lockfile is an
hour's work that removes the most common failure in the reproduction
literature; if you have both, a one-command runner plus a self-check
delivers the Claerbout standard, and you'll be ahead of the overwhelming
majority of published computational research.

<div class="tutorial-discussion" markdown="1">
## Discussion questions

1. Score your current habits against the decision table. Where is the
   biggest gap between what you know and what you do, and what actually
   explains it?
2. Who pays the cost of irreproducibility in your field, and who would pay
   for the fixes? If those are different people, what would realign them?
3. Steelman the case against adopting these practices in your lab. Then
   answer it.
4. What would it take for one-command runs to become the default for new
   projects in your group? Who has to move first: PI, students, or
   journals?
</div>

---

*Next: [Part 4 · The audit](/reproducible-research/audit/). Copyable
versions of every file above:
[templates](/reproducible-research/templates/).*
