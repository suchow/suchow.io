// One interactive Python cell. Builds the editor + run button + output panel
// inside a .pycell div authored in the page's Markdown (see tutorial.js for
// the authoring format), and wires them to the shared PyodideClient.

import { OutputPanel } from './output.js'

export class Cell {
  /**
   * @param root      the .pycell div
   * @param client    shared PyodideClient (null → offline mode)
   * @param cm        the CodeMirror bundle module (null → <pre> fallback)
   * @param theme     tomorrowNight extensions (ignored when cm is null)
   */
  constructor(root, client, cm, theme) {
    this.root = root
    this.client = client
    this.cm = cm
    this.theme = theme

    const read = (sel) => {
      const el = root.querySelector(sel)
      return el ? dedent(el.textContent) : null
    }
    this.code = read('script[type="text/x-python"][data-role="code"]') ??
      read('script[type="text/x-python"]:not([data-role])') ?? ''
    this.setup = read('script[type="text/x-python"][data-role="setup"]')
    this.expected = read('script[type="text/x-output"]')
    this.groupId = root.dataset.group || null
    this.readOnly = 'readonly' in root.dataset
    this.freshProcess = root.dataset.fresh === 'process'
    this.running = false

    this.build()
  }

  build() {
    const frame = document.createElement('div')
    frame.className = 'editor-frame'

    if (this.cm) {
      const host = document.createElement('div')
      host.className = 'cm-host'
      frame.appendChild(host)
      const {
        EditorState, EditorView, keymap, lineNumbers, highlightActiveLine,
        defaultKeymap, history, historyKeymap, indentWithTab, indentUnit,
        python,
      } = this.cm
      this.view = new EditorView({
        state: EditorState.create({
          doc: this.code,
          extensions: [
            lineNumbers(),
            highlightActiveLine(),
            history(),
            // Python convention is 4-space indents; CM6 defaults to 2.
            indentUnit.of('    '),
            EditorState.tabSize.of(4),
            python(),
            ...this.theme,
            keymap.of([
              ...defaultKeymap,
              ...historyKeymap,
              indentWithTab,
              { key: 'Mod-Enter', run: () => (this.run(), true) },
            ]),
            EditorView.editable.of(!this.readOnly),
          ],
        }),
        parent: host,
      })
    } else {
      // Editor bundle unavailable: render the code read-only. Runs still work
      // if the runtime is up.
      const pre = document.createElement('pre')
      pre.className = 'pycell-fallback-code'
      pre.textContent = this.code
      frame.appendChild(pre)
    }

    const actions = document.createElement('div')
    actions.className = 'pycell-actions'

    if (this.freshProcess) {
      const note = document.createElement('span')
      note.className = 'pycell-fresh-note'
      note.textContent = 'runs in a fresh interpreter'
      actions.appendChild(note)
    }

    this.stopBtn = document.createElement('button')
    this.stopBtn.type = 'button'
    this.stopBtn.className = 'btn btn-stop'
    this.stopBtn.textContent = '■ stop'
    this.stopBtn.hidden = true
    this.stopBtn.addEventListener('click', () => this.stop())
    actions.appendChild(this.stopBtn)

    this.runBtn = document.createElement('button')
    this.runBtn.type = 'button'
    this.runBtn.className = 'btn btn-run'
    this.runBtn.addEventListener('click', () => this.run())
    this.setButton('idle')
    actions.appendChild(this.runBtn)

    this.output = new OutputPanel()

    this.root.appendChild(frame)
    this.root.appendChild(actions)
    this.root.appendChild(this.output.el)

    if (this.expected) {
      const details = document.createElement('details')
      details.className = 'pycell-expected'
      const summary = document.createElement('summary')
      summary.textContent = 'expected output'
      const pre = document.createElement('pre')
      pre.textContent = this.expected
      details.appendChild(summary)
      details.appendChild(pre)
      this.root.appendChild(details)
    }
  }

  setButton(state) {
    const btn = this.runBtn
    btn.classList.toggle('btn-running', state === 'running' || state === 'restarting')
    btn.disabled = state === 'running' || state === 'restarting'
    if (state === 'idle') {
      btn.textContent = '▶ run'
    } else if (state === 'running' || state === 'restarting') {
      btn.innerHTML =
        '<span class="btn-running-dots" aria-hidden="true">' +
        '<span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
        '</span>'
      const label = state === 'restarting' ? 'starting a fresh interpreter' : 'running'
      btn.setAttribute('aria-label', label)
      btn.title = label + '…'
    } else if (state === 'offline') {
      btn.textContent = 'runtime offline'
      btn.disabled = false
    }
    if (state === 'idle') {
      btn.removeAttribute('aria-label')
      btn.title = this.freshProcess
        ? 'restarts the interpreter, then runs (Cmd/Ctrl-Enter)'
        : 'run this cell (Cmd/Ctrl-Enter)'
    }
    this.stopBtn.hidden = !(state === 'running')
  }

  currentCode() {
    return this.view ? this.view.state.doc.toString() : this.code
  }

  async run() {
    if (this.running) return
    if (!this.client || this.client.offline) {
      this.showOffline()
      return
    }
    this.running = true
    this.setButton(this.freshProcess ? 'restarting' : 'running')
    this.output.clear()
    try {
      const { error } = await this.client.run(
        {
          code: this.currentCode(),
          setup: this.setup,
          groupId: this.groupId,
          freshProcess: this.freshProcess,
        },
        (channel, text) => this.output.append(channel, text),
      )
      if (error) this.output.set('error', error)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg === 'runtime restarted') {
        this.output.set('note', '(stopped)')
      } else {
        this.output.set('error', msg)
      }
    } finally {
      this.running = false
      this.setButton(this.client.offline ? 'offline' : 'idle')
    }
  }

  async stop() {
    if (!this.client || !this.running) return
    this.stopBtn.disabled = true
    try {
      await this.client.stop()
    } finally {
      this.stopBtn.disabled = false
    }
  }

  showOffline() {
    this.output.set(
      'note',
      this.expected
        ? 'The Python runtime could not load (are you offline?). ' +
          'Expected output:\n\n' + this.expected
        : 'The Python runtime could not load (are you offline?). ' +
          'Reload the page to retry.',
    )
  }
}

// Shared indentation cleanup: the script tags in Markdown carry a leading
// newline and the page's base indentation; strip both so the editor shows
// clean code.
export function dedent(text) {
  const lines = text.replace(/^\n/, '').replace(/\s+$/, '').split('\n')
  let indent = Infinity
  for (const line of lines) {
    if (!line.trim()) continue
    indent = Math.min(indent, line.match(/^ */)[0].length)
  }
  if (!isFinite(indent) || indent === 0) return lines.join('\n')
  return lines.map((l) => l.slice(indent)).join('\n')
}
