// Output panel: stdout/stderr/error spans inside a <pre>, plus a rAF
// glide-scroll that follows streaming output. Ported from torchlette's
// Output.tsx (MIT), de-Reactified. Browser-native smooth scrollIntoView
// restarts its animation on every call and stutters under rapid output; here
// a single rAF loop lerps toward a target that updates independently, so the
// motion reads as one continuous glide. Any user scroll cancels it.

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)')

export class OutputPanel {
  constructor() {
    this.el = document.createElement('pre')
    this.el.className = 'output-panel'
    this.el.setAttribute('aria-label', 'output')
    this.el.hidden = true

    this.spans = {}
    for (const kind of ['stdout', 'stderr', 'error', 'note']) {
      const span = document.createElement('span')
      span.className = `output-${kind}`
      this.spans[kind] = span
      this.el.appendChild(span)
    }
    this.sentinel = document.createElement('span')
    this.sentinel.className = 'output-end-sentinel'
    this.sentinel.setAttribute('aria-hidden', 'true')
    this.el.appendChild(this.sentinel)

    this.targetY = null
    this.raf = null
    this.interruptCleanup = null
  }

  clear() {
    for (const span of Object.values(this.spans)) span.textContent = ''
    this.el.hidden = true
  }

  append(kind, text) {
    if (!text) return
    this.el.hidden = false
    this.spans[kind].textContent += text
    this.glide()
  }

  set(kind, text) {
    this.el.hidden = false
    this.spans[kind].textContent = text
    this.glide()
  }

  // ── glide-scroll ────────────────────────────────────────────────────────

  glide() {
    if (REDUCED_MOTION.matches) return
    const rect = this.sentinel.getBoundingClientRect()
    // Park the latest line ~60% down the viewport so it has breathing room.
    const desiredFromTop = window.innerHeight * 0.6
    if (rect.top <= desiredFromTop) return // already visible; don't yank up
    const proposed = window.scrollY + rect.top - desiredFromTop
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    this.targetY = Math.max(0, Math.min(maxScroll, proposed))

    if (this.raf !== null) return // glide in progress; target updated above

    const cancel = () => {
      if (this.raf !== null) {
        cancelAnimationFrame(this.raf)
        this.raf = null
      }
      this.targetY = null
      if (this.interruptCleanup) {
        this.interruptCleanup()
        this.interruptCleanup = null
      }
    }

    const SCROLL_KEYS = new Set([
      'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End',
      ' ', 'Spacebar',
    ])
    const onWheel = () => cancel()
    const onTouchMove = () => cancel()
    const onKeyDown = (e) => {
      if (SCROLL_KEYS.has(e.key)) cancel()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    this.interruptCleanup = () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
    }

    const tick = () => {
      const target = this.targetY
      if (target === null) {
        this.raf = null
        return
      }
      const current = window.scrollY
      const delta = target - current
      if (Math.abs(delta) < 0.5) {
        window.scrollTo(window.scrollX, target)
        this.targetY = null
        this.raf = null
        if (this.interruptCleanup) {
          this.interruptCleanup()
          this.interruptCleanup = null
        }
        return
      }
      // Cover ~12% of the remaining gap per frame at 60 Hz: weighty but not
      // laggy. Lower = lazier, higher = snappier.
      window.scrollTo(window.scrollX, current + delta * 0.12)
      this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }
}
