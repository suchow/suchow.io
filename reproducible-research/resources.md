---
layout: tutorial
title: "Resources"
description: "An annotated guide to going deeper on computational reproducibility: canonical papers, handbooks, courses, communities, the empirical literature, the tool ecosystem, and the AI era."
permalink: /reproducible-research/resources/
category: hidden
body_class: tutorial-page donthyphenate
---

*Companion to [a tutorial on computationally reproducible
research](/reproducible-research/).*

---

## Start here

Five short pieces carry most of the field's wisdom:

- [Sandve, Nekrutenko, Taylor & Hovig (2013), "Ten Simple Rules for
  Reproducible Computational
  Research"](https://doi.org/10.1371/journal.pcbi.1003285): still the best
  single checklist; rules 3 (archive exact versions) and 6 (note the seeds)
  alone would fix half the failures in Part 2.
- [Wilson et al. (2017), "Good enough practices in scientific
  computing"](https://doi.org/10.1371/journal.pcbi.1005510): the minimal-fix
  philosophy, expanded into a full practice guide, explicitly designed for
  researchers without software engineering training.
- [Peng (2011), "Reproducible research in computational
  science"](https://doi.org/10.1126/science.1213847): the reproducibility
  spectrum in two pages.
- [Barba (2018), "Terminologies for reproducible
  research"](https://arxiv.org/abs/1802.03311): read before quoting anyone
  else's definitions.
- [Hinsen (2019), "Dealing with software
  collapse"](https://doi.org/10.1109/MCSE.2019.2900945): why working code
  stops working, and what "maintenance" actually means for research
  software.

## Handbooks and courses

- [The Turing Way](https://book.the-turing-way.org/): the community-written
  handbook of reproducible, ethical, collaborative research; the source of
  the 2×2 definitions matrix in Part 1 and a good next stop on nearly any
  topic here.
- [The Carpentries](https://carpentries.org/): workshops and open lessons on
  the underlying skills, including [the Unix
  shell](https://swcarpentry.github.io/shell-novice/),
  [Git](https://swcarpentry.github.io/git-novice/), [R for reproducible
  analysis](https://swcarpentry.github.io/r-novice-gapminder/), and
  [automation with Make](https://swcarpentry.github.io/make-novice/).
- [CodeRefinery](https://coderefinery.org/): free workshops one level up
  from Carpentries (testing, modular code, containers, reproducible
  workflows); materials all open.
- [The Practice of Reproducible
  Research](https://www.practicereproducibleresearch.org/) (Kitzes, Turek &
  Deniz, eds., 2018): 31 case studies of real projects, including the
  compromises.
- [Project TIER](https://www.projecttier.org/): a prescribed
  folder-and-script protocol for empirical social science; opinionated in a
  useful way for teaching.
- [Christensen, Freese & Miguel (2019), *Transparent and Reproducible Social
  Science Research*](https://www.ucpress.edu/book/9780520296954/transparent-and-reproducible-social-science-research):
  the textbook treatment, from the BITSS orbit.
- [Building Reproducible Analytical Pipelines with R](https://raps-with-r.dev/)
  (Rodrigues): renv, targets, Docker, and Nix for R users, end to end.

## Communities and events

- [ReproducibiliTea](https://reproducibilitea.org/): grassroots journal-club
  network (130+ institutions, 30+ countries); the lowest-cost way to build
  local culture.
- [ReproHack](https://www.reprohack.org/): hackathons where participants try
  to reproduce volunteered papers and send authors structured feedback; the
  event-shaped version of this tutorial's lab.
- [Society for the Improvement of Psychological Science
  (SIPS)](https://improvingpsych.org/) and [FORRT](https://forrt.org/):
  meta-science and open-scholarship training communities; FORRT's
  [glossary](https://forrt.org/glossary/) is the reference for terminology
  beyond Part 1.
- [CODECHECK](https://codecheck.org.uk/): independent executions of papers'
  code, certified with a time-stamped report; both a service to use and a
  model to imitate.

## The evidence: reproduction and robustness studies

The full citations behind the tutorial's numbers, for teaching or quoting:

- [Stodden, Seiler & Ma (2018)](https://doi.org/10.1073/pnas.1708290115),
  *PNAS*: 204 *Science* articles; artifacts for 44%, reproduced 26%.
- [Hardwicke et al. (2018)](https://doi.org/10.1098/rsos.180448) and
  [(2021)](https://doi.org/10.1098/rsos.201494), *Royal Society Open
  Science*: analytic reproducibility at *Cognition* and *Psychological
  Science*; author assistance required in most successful cases.
- [Obels et al. (2020)](https://doi.org/10.1177/2515245920918872), *AMPPS*:
  Registered Reports; 58% of shareable pipelines reproduced.
- [Crüwell et al. (2023)](https://doi.org/10.1177/09567976221140828),
  *Psychological Science*: 1 of 14 badged articles exactly reproducible.
- [Miske et al. (2026)](https://www.nature.com/articles/s41586-026-10203-5),
  *Nature*: the largest audit to date; 600 papers, 53.6% precise / 73.5%
  approximate among assessable claims; data availability 24%.
- [Aczel et al. (2026)](https://www.nature.com/articles/s41586-025-09844-9),
  *Nature*: analytic robustness with ≥5 reanalysts per paper; 34% matched
  within ±0.05 Cohen's *d*.
- [Breznau et al. (2025)](https://royalsocietypublishing.org/doi/10.1098/rsos.241038),
  *Royal Society Open Science*: the transparency experiment; code sharing
  roughly doubles exact reproduction (48% to 77%).
- Many analysts, one dataset:
  [Silberzahn et al. (2018)](https://doi.org/10.1177/2515245917747646)
  (soccer red cards);
  [Botvinik-Nezer et al. (2020)](https://doi.org/10.1038/s41586-020-2314-9)
  (70 fMRI teams, no two identical workflows);
  [Breznau et al. (2022)](https://doi.org/10.1073/pnas.2203150119)
  (1,253 models, >95% of variance unexplained);
  [Gould et al. (2025)](https://doi.org/10.1186/s12915-024-02101-x)
  (ecology).
- [Collberg & Proebsting (2016)](https://doi.org/10.1145/2812803), *CACM*:
  repeatability in computer systems; the "does it even build?" baseline.
- Domain-specific failure modes:
  [Bridges et al. (2020), the timing mega-study](https://doi.org/10.7717/peerj.9414)
  (experiment-software timing across platforms; measure your own rig);
  [Pham et al. (2020)](https://doi.org/10.1145/3324884.3416545)
  (variance across 2,304 identical deep-learning runs);
  [Vehtari et al. (2021)](https://doi.org/10.1214/20-BA1221)
  (modern MCMC convergence standards: R̂ < 1.01, bulk/tail ESS).

## Tools, by intervention

*Environments.* [uv](https://docs.astral.sh/uv/) (Python; the current
default), [pixi](https://pixi.sh) (conda ecosystem, lockfile-first),
[Miniforge/conda-forge](https://conda-forge.org/) (if conda, then this
flavor), [renv](https://rstudio.github.io/renv/) (R),
[rig](https://github.com/r-lib/rig) (pinning R itself).

*Containers.* [Docker](https://docs.docker.com/),
[Apptainer](https://apptainer.io/) (HPC; formerly Singularity),
[Podman](https://podman.io/) (rootless drop-in),
[Rocker](https://rocker-project.org/) (R images), [Ten simple rules for
Dockerfiles](https://doi.org/10.1371/journal.pcbi.1008316).

*Workflows.* [Make](https://swcarpentry.github.io/make-novice/),
[Snakemake](https://snakemake.github.io/),
[Nextflow](https://www.nextflow.io/),
[targets](https://docs.ropensci.org/targets/) (R; successor to drake).

*Literate/computational documents.* [Quarto](https://quarto.org/),
[Jupyter Book](https://jupyterbook.org/), [Binder](https://mybinder.org/)
(hosted executability: a bonus, never an archive).

*Archiving & identifiers.* [Zenodo](https://zenodo.org/) (DOIs; GitHub
release integration), [OSF](https://osf.io/), [Software
Heritage](https://www.softwareheritage.org/) and
[SWHIDs](https://www.swhid.org/) (ISO-standard intrinsic software
identifiers), [RO-Crate](https://www.researchobject.org/ro-crate/)
(machine-readable research bundles), [DataLad](https://www.datalad.org/)
(versioned data on Git).

Tool advice rots faster than principles, so note where things stood as of
2026: prefer uv over pip/pipenv/poetry for new Python work; renv replaced
packrat; targets replaced drake; Apptainer is Singularity's current name;
avoid the Anaconda `defaults` channel (licensing) in favor of conda-forge;
and Papers with Code shut down in 2025 (Hugging Face hosts a successor). If
you're reading this in 2030: audit this paragraph first.

## Reproducibility in the age of AI

Two fronts are moving fast, one hopeful and one cautionary.

*AI as reproducer.* Benchmarks now measure whether AI agents can reproduce
papers' results from their artifacts:
[CORE-Bench](https://arxiv.org/abs/2409.11363) (agents went from ~21% to
~78% on its hardest tier within a year);
[PaperBench](https://arxiv.org/abs/2504.01848) (from-scratch replication of
ML papers; expert humans still ahead);
[SUPER](https://arxiv.org/abs/2409.07440);
[ReplicatorBench](https://arxiv.org/abs/2602.11354) (agents for
social-and-behavioral-science replication). The near-term implication:
automated reproduction audits at scale are becoming feasible, which raises
the value of every practice in this tutorial, because machine auditors are
even less forgiving of missing lockfiles than graduate students.

*AI as reproducibility hazard.* Research that depends on hosted models
inherits failure modes no lockfile can pin.
[Chen, Zaharia & Zou (2024)](https://doi.org/10.1162/99608f92.5317da47)
documented GPT-4's behavior shifting substantially within months.
[Palmer, Smith & Spirling (2024)](https://doi.org/10.1038/s43588-023-00585-1)
argue proprietary-model research requires explicit justification.
[Sclar et al. (2024)](https://arxiv.org/abs/2310.11324) showed prompt
formatting alone can swing benchmark accuracy by dozens of points. And
temperature-0 sampling [is not deterministic in
practice](https://arxiv.org/abs/2408.04667); the root cause, batch-variant
inference kernels, was dissected by [Thinking Machines
(2025)](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/).
Reporting standards are emerging:
[REFORMS](https://doi.org/10.1126/sciadv.adk3452) for ML-based science and a
[reporting checklist for LLMs in behavioral
research](https://doi.org/10.1038/s41562-026-02492-7). Minimal practice
meanwhile: pin model snapshots, log every request and response, archive the
transcripts as data, and treat "the model" as a versioned dependency that
can be deprecated out from under you.

## Foundations and history

- [Claerbout & Karrenbach (1992)](https://doi.org/10.1190/1.1822162): where
  "reproducible research" (and the single-command standard) began.
- [Buckheit & Donoho (1995)](https://doi.org/10.1007/978-1-4612-2544-7_5):
  WaveLab and the "advertising" credo.
- [Schwab, Karrenbach & Claerbout (2000)](https://doi.org/10.1109/5992.881708):
  the Stanford system, matured.
- [Goodman, Fanelli & Ioannidis (2016)](https://doi.org/10.1126/scitranslmed.aaf5027):
  methods, results, and inferential reproducibility.
- [National Academies (2019), *Reproducibility and Replicability in
  Science*](https://doi.org/10.17226/25303): the consensus definitions and
  the policy landscape.
- [ACM artifact review and badging](https://www.acm.org/publications/policies/artifact-review-and-badging-current):
  the badge taxonomy (and, historically, the great definition swap of 2020).

---

*Back to [the tutorial](/reproducible-research/).*
