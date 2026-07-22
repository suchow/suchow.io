#!/usr/bin/env bash
# One-command entry point: bash run.sh
# The minimal alternative to a Makefile: steps in order, failing loudly.

set -euo pipefail   # exit on first error; no unset vars; no silent pipe failures

uv run python analysis/01_clean.py
uv run python analysis/02_model.py
uv run python analysis/03_figures.py
uv run python analysis/04_check.py   # asserts the paper's numbers

echo "done: outputs in results/ and figures/"
