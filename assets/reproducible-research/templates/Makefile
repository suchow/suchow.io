# Research-project Makefile.
# `make all` regenerates every result from raw data; `make check` verifies
# the paper's numbers. Each rule: output, its inputs, the command.
# NOTE: recipe lines must be indented with a TAB, not spaces.

all: figures/fig1.pdf check

results/clean.csv: data/raw.csv analysis/01_clean.py
	uv run python analysis/01_clean.py

results/model.json: results/clean.csv analysis/02_model.py
	uv run python analysis/02_model.py

figures/fig1.pdf: results/model.json analysis/03_figures.py
	uv run python analysis/03_figures.py

# The paper's claims, as an executable test (see analysis/04_check.py).
check: results/model.json analysis/04_check.py
	uv run python analysis/04_check.py

clean:
	rm -rf results/* figures/*

.PHONY: all check clean
