// Entry file for the frozen CodeMirror 6 bundle used by the reproducibility
// tutorial. See BUILD (same directory) for the exact command that produced
// codemirror.js from this file. The bundle is committed so the tutorial has
// no build step and no third-party module CDN at runtime.
export { EditorState } from '@codemirror/state'
export { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
export { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
export { indentUnit, HighlightStyle, syntaxHighlighting } from '@codemirror/language'
export { python } from '@codemirror/lang-python'
export { tags } from '@lezer/highlight'
