// Entry point for tutorial pages. Finds .pycell divs, boots one shared
// Pyodide worker for the page, registers page-scoped thin modules, and
// mounts a Cell on each div. No-ops on pages without cells so the layout can
// be shared by pages with no interactive content.
//
// Authoring format (raw HTML in the page's Markdown):
//
//   <div class="pycell" data-group="lab" data-readonly data-fresh="process">
//   <script type="text/x-python" data-role="setup">  …hidden, runs first…  </script>
//   <script type="text/x-python" data-role="code">   …visible starter…     </script>
//   <script type="text/x-output">                    …expected output…     </script>
//   </div>
//
// Page-scoped thin modules (fake packages importable from any cell):
//
//   <script type="text/x-python" data-pycell-module="statslib" data-version="1.2">
//   …module source…
//   </script>

import { PyodideClient } from './py-client.js'
import { Cell, dedent } from './cell.js'

const cells = document.querySelectorAll('.pycell')
if (cells.length > 0) init(cells)

async function init(cellRoots) {
  const base = new URL('.', import.meta.url)

  // Editor bundle: load dynamically so a (near-impossible same-origin)
  // failure degrades to <pre> rendering instead of killing the page.
  let cm = null
  let theme = null
  try {
    cm = await import('./vendor/codemirror.js')
    theme = (await import('./theme.js')).tomorrowNight
  } catch (err) {
    console.error('editor bundle failed to load:', err)
  }

  const client = new PyodideClient(new URL('py-worker.js', base))
  client.offline = false

  const indicator = bootIndicator()
  client.ready().then(
    () => indicator.done(),
    (err) => {
      // A worker restart (Stop, or a fresh-process run) rejects the boot
      // promise it interrupts; that is routine, and only a genuine load
      // failure should flip the page into offline mode.
      if (err instanceof Error && err.message === 'runtime restarted') {
        indicator.done()
        return
      }
      console.error('Pyodide failed to boot:', err)
      client.offline = true
      indicator.failed()
      for (const cell of mounted) cell.setButton('offline')
    },
  )

  // Register page-scoped thin modules before mounting cells so first runs
  // can import them. registerModule caches for replay after restarts.
  const moduleTags = document.querySelectorAll('script[data-pycell-module]')
  for (const tag of moduleTags) {
    client.registerModule(
      tag.dataset.pycellModule,
      dedent(tag.textContent),
      tag.dataset.version || 'default',
    )
  }

  const mounted = []
  for (const root of cellRoots) {
    mounted.push(new Cell(root, client, cm, theme))
  }

  // Debug/testing handle; not part of the authoring API.
  window.__pycells = mounted
  window.__pyclient = client
}

function bootIndicator() {
  const pill = document.createElement('div')
  pill.className = 'pycell-boot'
  pill.setAttribute('role', 'status')
  pill.textContent = 'loading the Python runtime…'
  document.body.appendChild(pill)
  return {
    done() {
      pill.textContent = 'Python ready'
      pill.classList.add('pycell-boot-done')
      setTimeout(() => pill.remove(), 1600)
    },
    failed() {
      pill.textContent = 'Python runtime unavailable — demos show expected output instead'
      pill.classList.add('pycell-boot-failed')
      setTimeout(() => pill.remove(), 6000)
    },
  }
}
