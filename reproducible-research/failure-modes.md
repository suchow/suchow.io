---
layout: tutorial
title: "Failure modes"
kicker: "Part 2"
description: "The six recurring ways computational research fails to reproduce: hidden randomness, numerical instability, dependency drift, implicit state, fragile workflows, and stochastic-but-equivalent results, each demonstrated in live, runnable code."
permalink: /reproducible-research/failure-modes/
category: hidden
body_class: tutorial-page donthyphenate
---

*Part 2 of [a tutorial on computationally reproducible
research](/reproducible-research/). The code on this page is live: edit
anything, run everything. When you're done, try the [diagnostics
lab](/reproducible-research/lab/).*

---

Nearly every computational reproducibility failure in the wild is an instance
of a small number of recurring mechanisms. This page walks through six. For
each: what it is, a live demonstration, how to spot it in your own work, and
the fix, both minimal and robust. (The fixes get a fuller treatment in [Part
3](/reproducible-research/interventions/).)

A note on the demonstrations: they run in a real Python interpreter embedded
in this page. Some of them are supposed to give different answers on
different runs. That's the point, so when a demo tells you to run it twice,
believe it.

<!-- ── thin modules used by the demos on this page ─────────────────────── -->

<script type="text/x-python" data-pycell-module="randlib" data-version="0.9">
# A tiny random library, "version 0.9". Same generator as 1.0; the
# *selection algorithm* differs — 0.9 uses the old floor method.
_state = 42

def seed(n):
    global _state
    _state = n

def _next():
    global _state
    _state = (1103515245 * _state + 12345) % (2**31)
    return _state / (2**31)

def sample(population, k):
    """Floor method: scale a uniform draw by n and truncate (v0.9)."""
    pop = list(population)
    out = []
    for _ in range(k):
        idx = int(_next() * len(pop))
        out.append(pop.pop(idx))
    return out

__version__ = "0.9"
</script>

<script type="text/x-python" data-pycell-module="randlib" data-version="1.0">
# The same tiny random library, "version 1.0". The generator is unchanged,
# but sampling switched to rejection sampling to fix a subtle bias in the
# old floor method, so the same seed now yields different draws.
_state = 42

def seed(n):
    global _state
    _state = n

def _next():
    global _state
    _state = (1103515245 * _state + 12345) % (2**31)
    return _state / (2**31)

def sample(population, k):
    """Rejection method: draw whole 31-bit integers, reject out-of-range (v1.0)."""
    pop = list(population)
    out = []
    for _ in range(k):
        n = len(pop)
        span = (2**31 // n) * n
        while True:
            r = int(_next() * (2**31))
            if r < span:
                break
        out.append(pop.pop(r % n))
    return out

__version__ = "1.0"
</script>

<script type="text/x-python" data-pycell-module="statslib" data-version="1.2">
def mean(xs, trim=0.0):
    """Arithmetic mean. `trim` trims a fraction from each tail (default: none)."""
    xs = sorted(xs)
    k = int(len(xs) * trim)
    kept = xs[k:len(xs) - k] if k else xs
    return sum(kept) / len(kept)

__version__ = "1.2"
</script>

<script type="text/x-python" data-pycell-module="statslib" data-version="2.0">
def mean(xs, trim=0.2):
    """Arithmetic mean. As of 2.0, trims 20% from each tail BY DEFAULT
    ("more robust for most users" — the changelog)."""
    xs = sorted(xs)
    k = int(len(xs) * trim)
    kept = xs[k:len(xs) - k] if k else xs
    return sum(kept) / len(kept)

__version__ = "2.0"
</script>

<script type="text/x-python" data-pycell-module="parallel">
# A stand-in for multi-threaded summation. A real parallel reduction
# combines partial results in whatever order the scheduler happens to
# finish them; here that order comes from the operating system's entropy
# pool, so it is genuinely nondeterministic — a seed cannot fix it, just
# like a real thread scheduler.
import random as _random

_sys = _random.SystemRandom()

def parallel_sum(xs):
    xs = list(xs)
    _sys.shuffle(xs)             # scheduler decides combination order
    total = 0.0
    for x in xs:
        total += x
    return total
</script>

<script type="text/x-python" data-pycell-module="mcmc">
# A miniature Metropolis sampler for a normal target — enough machinery to
# show what "reproducible" means for stochastic estimation.
import math as _math
import random as _random

def sample_posterior(mu=2.5, sigma=1.0, n=4000, seed=None):
    rng = _random.Random(seed)
    x = 0.0
    draws = []
    for _ in range(n):
        proposal = x + rng.gauss(0, 0.8)
        log_ratio = ((x - mu) ** 2 - (proposal - mu) ** 2) / (2 * sigma ** 2)
        if _math.log(rng.random()) < log_ratio:
            x = proposal
        draws.append(x)
    return draws[500:]  # discard burn-in

def mean(xs):
    return sum(xs) / len(xs)
</script>

## 1 · Hidden randomness

Randomness is everywhere in modern analysis: sampling, shuffling,
initialization, bootstrapping, train/test splits. By default it is unseeded,
meaning the generator is initialized from the clock or the OS entropy pool,
so every run draws a different stream. The code below selects participants
for a follow-up. Run it twice.

<div class="pycell">
<script type="text/x-python" data-role="code">
import random

participants = list(range(1, 101))
followup = random.sample(participants, 5)
print("selected for follow-up:", followup)
</script>
</div>

You get different participants every time, which means the paper's Table 1
can never be regenerated. The minimal fix is one line. Add `random.seed(2026)` above
the sampling call and run it twice more: now the draw is frozen, and anyone
with the code gets your sample.

**A seed pins less than you think.** A seed guarantees the same stream from
the same generator and the same selection algorithm. If the library changes
its algorithm, the same seed silently yields different results. This has
happened at scale: in 2019, R 3.6.0 [changed the default
algorithm](https://blog.revolutionanalytics.com/2019/05/whats-new-in-r-360.html)
behind `sample()` because the old method was measurably non-uniform on large
populations, and seeded R code produced different samples after upgrading.
The two read-only cells below share one seed and one generator; the library
version differs (hidden here, exactly as it would be on two lab machines).

<div class="pycell" data-readonly>
<script type="text/x-python" data-role="setup">
import tutorial_rt
tutorial_rt.activate("randlib", "0.9")
</script>
<script type="text/x-python" data-role="code">
import randlib
randlib.seed(2026)
print("randlib", randlib.__version__, "->", randlib.sample(range(100), 5))
</script>
</div>

<div class="pycell" data-readonly>
<script type="text/x-python" data-role="setup">
import tutorial_rt
tutorial_rt.activate("randlib", "1.0")
</script>
<script type="text/x-python" data-role="code">
import randlib
randlib.seed(2026)
print("randlib", randlib.__version__, "->", randlib.sample(range(100), 5))
</script>
</div>

The same seed produced a different sample. The lesson is that a seed alone
is never enough: reproducibility of seeded randomness also requires pinning
the software that consumes the seed, which is the next failure mode.

**Randomness can also hide where you'd never look.** Python randomizes its
string-hashing per process (a security measure), and the iteration order of
a `set` depends on it. The cell below runs in a genuinely fresh interpreter
each time. Run it twice and watch the order change, with no `random` call in
sight.

<div class="pycell" data-fresh="process">
<script type="text/x-python" data-role="code">
conditions = {"control", "treatment-a", "treatment-b", "placebo"}
print(list(conditions))
</script>
</div>

If a set's iteration order ever feeds something downstream (assignment of
participants to conditions, column order, "take the first *k*"), your
results differ across machines and runs. Fix: `sorted(conditions)`, or pin
`PYTHONHASHSEED`, or avoid ordering-sensitive uses of sets and dicts
entirely.

- **Spot it:** grep for `random`, `sample`, `shuffle`, `seed`, and for
  `set(`/`.keys()` feeding anything order-sensitive. Ask: if I ran this
  twice, what could differ?
- **Minimal fix:** explicit seeds, set once, at the top of the entry point.
- **Robust fix:** seeds plus a pinned environment ([Part
  3](/reproducible-research/interventions/)), because the seed's meaning
  depends on the library version.

## 2 · Numerical instability

Floating-point arithmetic differs from the arithmetic you learned in school.
In particular, addition is not associative: `(a + b) + c` and `a + (b + c)`
can differ, so the same numbers added in a different order give a different
sum.

<div class="pycell">
<script type="text/x-python" data-role="code">
a, b, c = 0.1, 0.2, 0.3
print((a + b) + c)
print(a + (b + c))
print((a + b) + c == a + (b + c))
</script>
<script type="text/x-output">
0.6000000000000001
0.6
False
</script>
</div>

On its own this is a curiosity. It becomes a reproducibility problem the
moment summation order is out of your control, which is precisely what
parallel computation does. A multi-threaded or GPU reduction adds partial
sums in whatever order the scheduler completes them. The `parallel_sum`
below reproduces that mechanism (its ordering comes from the OS entropy pool,
which no seed can pin, just like a real scheduler). Run it a few times.

<div class="pycell">
<script type="text/x-python" data-role="code">
from parallel import parallel_sum

# Mixed magnitudes, like a loss over a badly scaled batch: two enormous
# terms that should cancel, plus five thousand small ones.
values = [1e16, -1e16] + [1.0] * 5000

print(parallel_sum(values))
print(parallel_sum(values))
print(parallel_sum(values))
</script>
</div>

The same numbers produce different totals from run to run, within one
interpreter and with one seed. This is why deep-learning results can differ across identical runs on
identical hardware (atomic GPU additions commit in nondeterministic order),
and why PyTorch's own documentation warns that "completely reproducible
results are not guaranteed across PyTorch releases, individual commits, or
different platforms." In one systematic study, [identical training code run
2,304 times](https://doi.org/10.1145/3324884.3416545) produced accuracies
ranging across tens of percentage points on an unlucky architecture.

The fixes come in two complementary forms. Where determinism is available,
opt in: for example, `torch.use_deterministic_algorithms(True)`, ordered
reductions, or `math.fsum`, which is correctly rounded regardless of order.

<div class="pycell">
<script type="text/x-python" data-role="code">
import math

values = [1e16, -1e16] + [1.0] * 5000
print(math.fsum(values))
print(math.fsum(reversed(values)))
</script>
<script type="text/x-output">
5000.0
5000.0
</script>
</div>

Where determinism isn't available, or costs too much performance, stop
asserting bit-equality and write tolerance tests (`math.isclose`,
`numpy.allclose`, or a stated tolerance in the paper), so that "reproduced"
has a stated, checkable meaning.

- **Spot it:** results that differ in late decimals across machines or
  runs; any parallel/GPU computation; comparisons with `==` on floats.
- **Minimal fix:** pin versions and platforms; prefer order-stable
  reductions.
- **Robust fix:** deterministic modes where offered, tolerance tests
  everywhere else.

## 3 · Dependency drift

Your analysis does not run on "Python"; it runs on a particular constellation
of library versions, each of which is quietly evolving. Upgrades change
defaults, fix "bugs" your results depended on, and reorder internals. The
two read-only cells below run identical analysis code, the same call on the
same data. The only difference is which version of the fictional but
entirely typical `statslib` is installed.

<div class="pycell" data-readonly>
<script type="text/x-python" data-role="setup">
import tutorial_rt
tutorial_rt.activate("statslib", "1.2")
</script>
<script type="text/x-python" data-role="code">
import statslib

reaction_times = [1, 2, 3, 4, 100]   # one participant fell asleep
print("statslib", statslib.__version__, "->", statslib.mean(reaction_times))
</script>
</div>

<div class="pycell" data-readonly>
<script type="text/x-python" data-role="setup">
import tutorial_rt
tutorial_rt.activate("statslib", "2.0")
</script>
<script type="text/x-python" data-role="code">
import statslib

reaction_times = [1, 2, 3, 4, 100]   # one participant fell asleep
print("statslib", statslib.__version__, "->", statslib.mean(reaction_times))
</script>
</div>

22.0 became 3.0 and no code changed: version 2.0 made trimming the default
(check the changelog framing in the module source: "more robust for most
users"). Real examples of exactly this shape: R 3.6's `sample()` change
(seen above), R 4.0 flipping `stringsAsFactors`, generations of scipy and
pandas default changes. [Hinsen
(2019)](https://doi.org/10.1109/MCSE.2019.2900945) names the phenomenon
software collapse: "Software does not disintegrate with time. It stops
working because the foundations on which it was built start to move."

The fix has a cheap tier and a sturdy tier. The cheap tier is to declare
and lock versions: a lockfile (`uv.lock`, `renv.lock`, `pixi.lock`) records
the exact version of every package (and every package's package), so anyone
can recreate the same stack. The sturdy tier is to freeze the whole
foundation: a container image carries the OS, the interpreter, and the
libraries as one archived, runnable artifact. Both are demonstrated in [Part
3](/reproducible-research/interventions/). Either way, the discipline is the
same: an analysis isn't "in Python"; it's in `python 3.12.3 + numpy 1.26.4 +
…`, and that sentence belongs in your repository, machine-readably.

- **Spot it:** no lockfile in the repo; `import` statements with no
  recorded versions; "works on my machine"; results that changed after a
  `pip install --upgrade`.
- **Minimal fix:** a lockfile, committed.
- **Robust fix:** a container image, archived alongside the data.

## 4 · Implicit state

An analysis has implicit state when its behavior depends on anything that is
neither visible in the code nor shipped with it: your directory layout, your
locale, your clock, the order in which you happened to execute notebook
cells. The classic is the hardcoded path. This exact line is in thousands of
published supplementary scripts:

<div class="pycell">
<script type="text/x-python" data-role="setup">
with open("results.csv", "w") as f:
    f.write("participant,rt\n1,514\n2,559\n3,488\n")
</script>
<script type="text/x-python" data-role="code">
path = "/Users/ana/projects/rt-study/data/results.csv"

with open(path) as f:
    print(f.read())
</script>
</div>

The cell fails with `FileNotFoundError`, because you are not Ana and your
laptop is not hers. The file actually exists right here, one directory over: change the path to
just `"results.csv"` and rerun. The general form of the fix is to make
every path relative to the project root, to let the code discover that root
rather than have anyone type it, and to have the code fetch its inputs
rather than assume they are already in place.

Time is implicit state too. This cell's answer is different every day it is
run, and it silently disagrees with what the authors saw:

<div class="pycell">
<script type="text/x-python" data-role="code">
from datetime import date

collected = date(2026, 3, 1)
followup_window = 90  # days

days_elapsed = (date.today() - collected).days
print("days since collection:", days_elapsed)
print("still in follow-up window:", days_elapsed <= followup_window)
</script>
</div>

Anything that reads the clock, the timezone, the locale (decimal commas!),
or an environment variable is a hidden input. Make it explicit: pin the
analysis date as data, set the timezone and locale in code, record the
environment.

The third classic is stale notebook state, the one every notebook user has
been burned by. The two cells below share one namespace, like cells in a
notebook. Run the first, then the second. Now edit the first cell's
threshold to `200`, and re-run only the second.

<div class="pycell" data-group="stale">
<script type="text/x-python" data-role="code">
exclusion_threshold = 400  # ms
</script>
</div>

<div class="pycell" data-group="stale">
<script type="text/x-python" data-role="code">
rts = [180, 220, 350, 460, 510]
kept = [rt for rt in rts if rt <= exclusion_threshold]
print("analyzed", len(kept), "of", len(rts), "trials")
</script>
</div>

The output still reflects the old threshold: what you see in the editor is
different from what ran. In real notebooks this manifests as results that
can't be regenerated by "Restart & Run All," which is also the diagnostic:
if Restart & Run All changes your numbers, your notebook contains implicit
state.

- **Spot it:** absolute paths; `today()`/`now()` in analysis code; results
  that survive only in a long-lived notebook session; locale- or
  env-dependent parsing.
- **Minimal fix:** relative paths, pinned dates, Restart & Run All before
  every commit.
- **Robust fix:** a workflow manager that executes the pipeline from a
  clean slate every time ([Part 3](/reproducible-research/interventions/)).

## 5 · Fragile workflows

Most analyses are a sequence (clean, then model, then summarize), and the
sequence usually lives nowhere but in the author's memory. The three cells
below are a pipeline sharing one workspace. First run them in order (1, 2,
3) and note the answer. Then simulate what a reader does six months later
with no instructions: re-run cell 1, skip cell 2 ("probably optional"), and
run cell 3.

<div class="pycell" data-group="pipeline">
<script type="text/x-python" data-role="code">
# 1 · load. The scanner logs missing responses as -999.
rts = [514, -999, 559, 488, -999, 531, 502]
print("loaded", len(rts), "trials")
</script>
</div>

<div class="pycell" data-group="pipeline">
<script type="text/x-python" data-role="code">
# 2 · clean: drop missing-response codes.
rts = [rt for rt in rts if rt != -999]
print("kept", len(rts), "trials")
</script>
</div>

<div class="pycell" data-group="pipeline">
<script type="text/x-python" data-role="code">
# 3 · analyze.
print("mean RT:", round(sum(rts) / len(rts), 1), "ms")
</script>
</div>

Run in order, the pipeline gives a sensible mean of about 519 ms. With the
cleaning step skipped, it gives about 85 ms, wildly wrong, and no error was
raised. That silence is the signature
of a fragile workflow: every step runs happily on the wrong input.
Undocumented manual steps ("then I opened it in Excel and deleted the bad
rows") are the same failure in human form, and they are endemic; recall from
[Part 1](/reproducible-research/foundations/) that most audited articles
required author assistance or worse to reproduce.

- **Spot it:** a directory of numbered-ish scripts with no runner; any
  step whose instructions live in email, memory, or "the usual way";
  intermediate files of uncertain vintage.
- **Minimal fix:** a README that lists the exact commands, in order.
- **Robust fix:** one command that runs everything: `make`, a `run.sh`, or
  a workflow manager that knows the dependency graph and re-executes only
  what changed. (Claerbout's 1992 standard, [a dissertation that
  regenerates from a single command](https://doi.org/10.1190/1.1822162),
  remains the gold standard three decades on.)

## 6 · Stochastic but equivalent

The last failure mode is a category error rather than a bug: demanding
bit-equality from computations that are supposed to vary, or accepting vague
similarity from ones that aren't. Bayesian estimation via MCMC, bootstrap
intervals, stochastic optimization: all produce draws from a distribution.
Run the sampler below with two different seeds:

<div class="pycell">
<script type="text/x-python" data-role="code">
import math
import mcmc

est1 = mcmc.mean(mcmc.sample_posterior(seed=1))
est2 = mcmc.mean(mcmc.sample_posterior(seed=2))

print("seed 1:", round(est1, 4))
print("seed 2:", round(est2, 4))
print("bit-identical: ", est1 == est2)
print("equivalent (±0.05):", math.isclose(est1, est2, abs_tol=0.05))
</script>
</div>

The digits differ; the answer does not. Both estimates are correct draws
from the same posterior; the difference is Monte Carlo error, and the right
test is a tolerance. Note what should be bit-identical, though: the same
seed, twice.

<div class="pycell">
<script type="text/x-python" data-role="code">
import mcmc

print(mcmc.mean(mcmc.sample_posterior(seed=1)))
print(mcmc.mean(mcmc.sample_posterior(seed=1)))
</script>
</div>

This two-layer standard is the mature position: bit-exact given the seed,
statistically stable across seeds, and each reported number states which of
the two it meets. (For real MCMC, "statistically stable" has teeth: modern
practice requires split-chain R̂ < 1.01 and adequate effective sample sizes
(see [Vehtari et al., 2021](https://doi.org/10.1214/20-BA1221)), because a
non-converged chain is a run-to-run reproducibility failure wearing a lab
coat.) Large reproduction efforts formalize the same idea as precise versus
approximate reproduction, with tolerances declared in advance ([Miske et
al., 2026](https://www.nature.com/articles/s41586-026-10203-5)).

- **Spot it:** stochastic estimates reported with no seed and no
  tolerance; "matches the paper" claims with no definition of matches.
- **Minimal fix:** seed everything; report seeds; state tolerances.
- **Robust fix:** convergence diagnostics and tolerance tests in code, run
  in CI.

---

## The taxonomy, on one screen

| Failure mode | Signature | Minimal fix | Robust fix |
|---|---|---|---|
| Hidden randomness | Different answer each run | Explicit seeds | Seeds + pinned stack |
| Numerical instability | Late decimals differ across runs/machines | Pin versions, stable reductions | Deterministic modes, tolerance tests |
| Dependency drift | Results changed after an upgrade | Committed lockfile | Container image |
| Implicit state | Works only on your machine / today / this session | Relative paths, pinned dates, Restart & Run All | Clean-slate workflow runs |
| Fragile workflows | Wrong order → silently wrong result | Ordered README | One-command automation |
| Stochastic ≠ irreproducible | "Close" with no standard | Seeds + stated tolerances | Convergence + tolerance tests in CI |

<div class="tutorial-discussion" markdown="1">
## Discussion questions

1. Which of the six failure modes has bitten you, or someone whose story
   you know? What did it cost?
2. What is the seventh failure mode: the one specific to your subfield's
   toolchain that this taxonomy misses?
3. Have you ever been unable to regenerate a number you yourself computed?
   What had happened?
4. Where does nondeterminism hide in the stack you use daily? Do you
   actually know, or are you guessing?
</div>

*Practice the diagnosis in the [lab](/reproducible-research/lab/), or go
straight to the fixes in [Part 3 ·
Interventions](/reproducible-research/interventions/).*
