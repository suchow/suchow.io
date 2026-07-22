// Pyodide host for the reproducibility tutorial. Lives in a classic Web
// Worker; the main thread talks via postMessage. Ported from the torchlette
// worker (MIT), simplified: no wheel, no packages beyond the stdlib, and
// stdout/stderr are streamed to the main thread per line instead of buffered
// so long-running cells print live.
//
// Boot sequence:
//   1. importScripts the Pyodide loader from the pinned CDN distribution.
//   2. loadPyodide (core only — the stdlib ships inside python_stdlib.zip;
//      no loadPackage, so cold boot stays as small as possible).
//   3. Fetch and exec runner.py (the cell runner + thin-module registry).

/* global loadPyodide, importScripts */

// Change PYODIDE_BASE to a same-origin path (e.g. RUNTIME_BASE + '/pyodide/')
// to self-host the Pyodide distribution; nothing else needs to change.
const PYODIDE_VERSION = 'v0.29.4'
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`

// The worker is served from .../assets/reproducible-research/js/py-worker.js;
// runner.py sits at .../assets/reproducible-research/py/runner.py. Deriving the
// path from location.href keeps the asset tree relocatable (no site-root
// assumption, works under any baseurl).
const RUNTIME_BASE = self.location.href.replace(/\/js\/[^/]*$/, '')

importScripts(`${PYODIDE_BASE}pyodide.js`)

let py = null
let bootError = null
let bootPromise = null
let queue = Promise.resolve()

async function boot() {
  py = await loadPyodide({ indexURL: PYODIDE_BASE })
  const resp = await fetch(`${RUNTIME_BASE}/py/runner.py`)
  if (!resp.ok) throw new Error(`failed to fetch runner.py: ${resp.status}`)
  await py.runPythonAsync(await resp.text())
}

self.addEventListener('message', (ev) => {
  const request = ev.data
  queue = queue.then(
    () => handleRequest(request),
    () => handleRequest(request),
  )
})

async function handleRequest({ type, id, payload }) {
  try {
    if (type === 'boot') {
      await ensureBoot()
      self.postMessage({ type: 'booted', id })
      return
    }

    await ensureReady()

    if (type === 'register-module') {
      registerModule(payload.name, payload.source, payload.version)
      self.postMessage({ type: 'result', id, payload: {} })
    } else if (type === 'run') {
      const out = await runCell(id, payload.code, payload.setup, payload.groupId)
      self.postMessage({ type: 'result', id, payload: out })
    } else {
      throw new Error(`unknown message type: ${type}`)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    self.postMessage({ type: 'error', id, payload: { message: msg } })
  }
}

async function ensureBoot() {
  if (bootError) throw new Error(`Pyodide failed to boot: ${bootError}`)
  if (!bootPromise) {
    bootPromise = boot().catch((err) => {
      bootError = err instanceof Error ? err.message : String(err)
      throw err
    })
  }
  await bootPromise
}

async function ensureReady() {
  if (bootError) throw new Error(`Pyodide failed to boot: ${bootError}`)
  if (!bootPromise) throw new Error('Pyodide boot has not started')
  await bootPromise
  if (!py) throw new Error('Pyodide not ready')
}

function registerModule(name, source, version) {
  py.globals.set('__mod_name__', name)
  py.globals.set('__mod_source__', source)
  py.globals.set('__mod_version__', version ?? 'default')
  try {
    py.runPython(
      'register_thin_module(__mod_name__, __mod_source__, __mod_version__)',
    )
  } finally {
    deletePyGlobals(['__mod_name__', '__mod_source__', '__mod_version__'])
  }
}

async function runCell(id, code, setup, groupId) {
  // Pyodide's `batched` callback receives complete lines with the trailing
  // newline stripped. Stream each line to the main thread as it lands — the
  // worker runs Python synchronously, but postMessage delivery is immediate,
  // so prints inside long loops render live.
  py.setStdout({ batched: (s) => self.postMessage({ type: 'stream', id, payload: { channel: 'stdout', text: s + '\n' } }) })
  py.setStderr({ batched: (s) => self.postMessage({ type: 'stream', id, payload: { channel: 'stderr', text: s + '\n' } }) })

  py.globals.set('__code__', code)
  py.globals.set('__setup__', setup ?? '')
  py.globals.set('__group_id__', groupId ?? '')

  try {
    const result = await py.runPythonAsync(
      'run_cell(__code__, __setup__, __group_id__)',
    )
    return { error: result ?? undefined }
  } finally {
    py.setStdout({})
    py.setStderr({})
    deletePyGlobals(['__code__', '__setup__', '__group_id__'])
  }
}

function deletePyGlobals(names) {
  for (const name of names) py.globals.delete(name)
}
