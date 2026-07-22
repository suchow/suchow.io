"""Loaded once at boot into Pyodide. Exposes the operations the JS worker calls.

Adapted from the torchlette runner (MIT). Differences: no numpy, no wheel, no
grading/variants/extractors. Instead: notebook-style cell execution with
optional shared namespaces, plus a registry of "thin modules" — tiny fake
packages, defined per page, that stand in for real libraries so demos can
show version drift and nondeterminism without heavyweight dependencies.
"""
import importlib.abc
import importlib.util
import sys
import traceback
import types

# ── thin-module registry ──────────────────────────────────────────────────
# _THIN[name][version] = source string; _ACTIVE[name] = currently active
# version. Importing `name` executes the active version's source. Switching
# versions pops the module from sys.modules so the next import re-executes.

_THIN = {}
_ACTIVE = {}


class _ThinFinder(importlib.abc.MetaPathFinder, importlib.abc.Loader):
    def find_spec(self, name, path=None, target=None):
        if name in _ACTIVE:
            return importlib.util.spec_from_loader(name, self)
        return None

    def create_module(self, spec):
        return None  # default module creation

    def exec_module(self, module):
        source = _THIN[module.__name__][_ACTIVE[module.__name__]]
        exec(source, module.__dict__)


sys.meta_path.insert(0, _ThinFinder())


def register_thin_module(name, source, version='default'):
    _THIN.setdefault(name, {})[version] = source
    _ACTIVE.setdefault(name, version)
    sys.modules.pop(name, None)


def _activate(name, version):
    if name not in _THIN or version not in _THIN[name]:
        known = sorted(_THIN.get(name, {}))
        raise ValueError(
            f'no version {version!r} of {name!r}; available: {known}')
    _ACTIVE[name] = version
    sys.modules.pop(name, None)


# ── namespaces ────────────────────────────────────────────────────────────
# A cell without a group gets a fresh dict every run (script-like). Cells
# sharing a data-group get one persistent dict (notebook-like).

_GROUPS = {}


def _reset_group(group_id):
    _GROUPS.pop(group_id, None)


def _fresh_namespace():
    return {'__name__': '__main__', '__builtins__': __builtins__}


def run_cell(code, setup, group_id):
    if group_id:
        ns = _GROUPS.setdefault(group_id, _fresh_namespace())
    else:
        ns = _fresh_namespace()
    try:
        if setup:
            exec(compile(setup, '<setup>', 'exec'), ns)
        exec(compile(code, '<cell>', 'exec'), ns)
    except BaseException as exc:
        return ''.join(
            traceback.format_exception_only(type(exc), exc)).strip()
    return None


# ── tutorial_rt: the helper module student-visible code may import ────────
# Registered as a thin module itself so setup code uses ordinary imports.

register_thin_module('tutorial_rt', '''
"""Helpers for the reproducibility tutorial's in-browser runtime."""
from runner_hooks import activate, reset_group, versions
''')

# The thin module above needs access to the functions here; expose them via
# a real module object rather than string interpolation.
_hooks = types.ModuleType('runner_hooks')
_hooks.__dict__.update(
    activate=_activate,
    reset_group=_reset_group,
    versions=lambda name: sorted(_THIN.get(name, {})),
)
sys.modules['runner_hooks'] = _hooks
