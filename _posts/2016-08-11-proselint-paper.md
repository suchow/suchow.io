---
layout: post-no-feature
title: "Linting science prose and the science of prose linting"
description:
category: papers
type: Paper
journal: SciPy 2016
pdf: pacer2016proselint.pdf
tags: [linters, writing, prose, editing]
---

The craft of writing is hard despite the abundance of thoughtful
advice available in usage guides and other sources. This is partly a problem of
medium: amassing advice is not enough to improve writing. Writing would thus
benefit if our collective knowledge about best practices in writing were extracted and transformed into a medium that makes the knowledge more accessible to authors.

We built Proselint, a Python-based linter for English prose that identifies
violations of style and usage guidelines. Proselint is open-source software
released under the BSD license and is compatible with Pythons 2 and 3. It
runs as a command-line utility or as a text-editor plugin. Proselint’s modules
address redundancy, jargon, illogic, clichés, unidiomatic vocabulary, sexism,
inconsistency, misuse of symbols, malapropisms, oxymorons, security gaffes,
hedging, apologizing, and pretension. Furthermore, Proselint is extensible,
enabling creation of domain-specific modules and implementation of house style
guides.

Proselint can be seen as both a language tool for scientists and a tool for
language science. On the one hand, Proselint can help scientists communicate
their ideas to each other and to the public by improving their writing. On the
other hand, scientists can use Proselint to measure language usage, to provide
style- and usage-based features for tasks such as authorship identification, and to explore the factors that make a linter useful (e.g., a low false discovery rate).
