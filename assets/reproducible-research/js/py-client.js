// Main-thread RPC client for the Pyodide worker. Ported from the torchlette
// client (MIT). Differences: classic same-origin worker (no bundler inline
// trick needed), streamed stdout/stderr routed to a per-run callback, a
// shared run queue so cells execute one at a time, and restart() — terminate
// the worker, boot a fresh one, and replay every registered thin module —
// which doubles as both the Stop button and the "true fresh process" mode.

export class PyodideClient {
  constructor(workerUrl) {
    this.workerUrl = workerUrl
    this.pending = new Map()
    this.streams = new Map()
    this.modules = [] // replayed after restart
    this.runChain = Promise.resolve()
    this.spawn()
  }

  spawn() {
    this.worker = new Worker(this.workerUrl)
    this.worker.addEventListener('message', this.handle)
    this.readyPromise = this.send('boot')
  }

  handle = (ev) => {
    const { type, id, payload } = ev.data
    if (type === 'stream') {
      const cb = this.streams.get(id)
      if (cb) cb(payload.channel, payload.text)
      return
    }
    const p = this.pending.get(id)
    if (!p) return
    this.pending.delete(id)
    this.streams.delete(id)
    if (type === 'error') p.reject(new Error(payload.message))
    else p.resolve(payload)
  }

  send(type, payload, onStream) {
    const id = Math.random().toString(36).slice(2)
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      if (onStream) this.streams.set(id, onStream)
      this.worker.postMessage({ type, id, payload })
    })
  }

  async ready() {
    await this.readyPromise
  }

  /** Register a thin module (cached so restarts replay it). */
  async registerModule(name, source, version) {
    this.modules.push({ name, source, version })
    await this.send('register-module', { name, source, version })
  }

  /**
   * Run one cell. Runs are chained so concurrent clicks execute in order.
   * Returns { error? }; stdout/stderr arrive via onStream(channel, text).
   * freshProcess runs go to their own throwaway worker (runEphemeral), so
   * they demonstrate true per-process behavior without destroying the main
   * worker's group namespaces.
   */
  run({ code, setup, groupId, freshProcess }, onStream) {
    if (freshProcess) return this.runEphemeral({ code, setup }, onStream)
    const task = async () => {
      await this.readyPromise
      return this.send('run', { code, setup, groupId }, onStream)
    }
    const result = this.runChain.then(task, task)
    // Keep the chain alive after failures; callers still see the rejection.
    this.runChain = result.then(() => {}, () => {})
    return result
  }

  /**
   * Boot a brand-new interpreter, run one cell in it, tear it down. Slow
   * (a full Pyodide boot), and it is a genuinely fresh process every time.
   */
  async runEphemeral({ code, setup }, onStream) {
    const pending = new Map()
    const streams = new Map()
    const worker = new Worker(this.workerUrl)
    const handle = (ev) => {
      const { type, id, payload } = ev.data
      if (type === 'stream') {
        const cb = streams.get(id)
        if (cb) cb(payload.channel, payload.text)
        return
      }
      const p = pending.get(id)
      if (!p) return
      pending.delete(id)
      streams.delete(id)
      if (type === 'error') p.reject(new Error(payload.message))
      else p.resolve(payload)
    }
    worker.addEventListener('message', handle)
    const send = (type, payload, onS) => {
      const id = Math.random().toString(36).slice(2)
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject })
        if (onS) streams.set(id, onS)
        worker.postMessage({ type, id, payload })
      })
    }
    this.ephemeral = {
      abort: () => {
        for (const { reject } of pending.values()) {
          reject(new Error('runtime restarted'))
        }
        pending.clear()
        worker.terminate()
      },
    }
    try {
      await send('boot')
      for (const m of this.modules) {
        await send('register-module', m)
      }
      return await send('run', { code, setup, groupId: null }, onStream)
    } finally {
      worker.terminate()
      this.ephemeral = null
    }
  }

  /** Kill the worker (even mid-run) and boot a fresh one. */
  async restart() {
    const task = () => this.restartInner()
    const result = this.runChain.then(task, task)
    this.runChain = result.then(() => {}, () => {})
    return result
  }

  /** Immediate teardown + reboot; rejects everything in flight. */
  async restartInner() {
    this.worker.removeEventListener('message', this.handle)
    this.worker.terminate()
    for (const { reject } of this.pending.values()) {
      reject(new Error('runtime restarted'))
    }
    this.pending.clear()
    this.streams.clear()
    const replay = this.modules
    this.modules = []
    this.spawn()
    await this.readyPromise
    for (const m of replay) {
      await this.registerModule(m.name, m.source, m.version)
    }
    // A successful reboot means the runtime is alive regardless of any
    // earlier boot rejection the page may have witnessed.
    this.offline = false
  }

  /** Stop a runaway cell. An ephemeral (fresh-process) run is simply
   * killed; a main-worker run requires a hard restart, which costs the
   * page's group namespaces — the price of no interrupt support. */
  async stop() {
    if (this.ephemeral) {
      this.ephemeral.abort()
      return
    }
    await this.restartInner()
  }
}
