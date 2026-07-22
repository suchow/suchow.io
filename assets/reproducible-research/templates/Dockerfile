# Container for a Python research project. Build once, archive the image.
#   docker build -t rt-study:v1 .
#   docker run --rm -v "$PWD/results:/app/results" rt-study:v1
#   docker save rt-study:v1 | gzip > rt-study-v1-image.tar.gz   # archive this
#
# Discipline: every FROM/install is pinned; nothing says "latest".

FROM python:3.12.3-slim

WORKDIR /app

# Environment first (cache-friendly), code second.
COPY pyproject.toml uv.lock ./
RUN pip install --no-cache-dir uv==0.7.13 && uv sync --frozen

COPY analysis/ analysis/
COPY data/ data/

CMD ["uv", "run", "python", "analysis/main.py"]
