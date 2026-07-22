# analysis/04_check.py: the paper's claims, as an executable test.
# Run as the final pipeline step (`make check`). Every headline number in
# the manuscript appears here with an explicit tolerance, so "the results
# reproduce" is a command, not a vibe.

import json
import math
import sys

results = json.load(open("results/model.json"))

CLAIMS = [
    # (name, computed value,            published value, absolute tolerance)
    ("mean RT difference (ms)", results["rt_diff_ms"], 65.9, 0.05),
    ("bootstrap CI lower",      results["ci_low"],     48.0, 0.05),
    ("bootstrap CI upper",      results["ci_high"],    84.0, 0.05),
]

failed = False
for name, got, published, tol in CLAIMS:
    ok = math.isclose(got, published, abs_tol=tol)
    print(f"{'ok' if ok else 'FAIL'} {name}: got {got}, published {published} (+/- {tol})")
    failed = failed or not ok

if failed:
    sys.exit("some published values did NOT reproduce")
print("all published values reproduced")
