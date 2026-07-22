// Tomorrow Night CodeMirror 6 theme — Chris Kempson's palette.
// Ported from torchlette (MIT); source palette:
// https://github.com/chriskempson/tomorrow-theme
// Caret color swapped to the suchow.io accent (#eebb66).

import {
  EditorView,
  HighlightStyle,
  syntaxHighlighting,
  tags as t,
} from './vendor/codemirror.js'

const C = {
  bg: '#1d1f21',
  currentLine: '#282a2e',
  selection: '#373b41',
  fg: '#c5c8c6',
  comment: '#969896',
  red: '#cc6666',
  orange: '#de935f',
  yellow: '#f0c674',
  green: '#b5bd68',
  aqua: '#8abeb7',
  blue: '#81a2be',
  purple: '#b294bb',
  cursor: '#eebb66', // site accent — matches $highlight in _sass/_variables.scss
}

const themeBase = EditorView.theme(
  {
    '&': { backgroundColor: C.bg, color: C.fg, height: '100%' },
    '.cm-content': { caretColor: C.cursor },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: C.cursor,
      borderLeftWidth: '2.5px',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: C.selection,
    },
    '.cm-gutters': {
      backgroundColor: C.bg,
      color: C.comment,
      border: 'none',
    },
    '.cm-activeLine': { backgroundColor: C.currentLine },
    '.cm-activeLineGutter': { backgroundColor: C.currentLine, color: C.fg },
    '.cm-lineNumbers .cm-gutterElement': {
      paddingLeft: '0.6rem',
      paddingRight: '0.4rem',
      fontSize: '0.825em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    '.cm-scroller': {
      fontFamily: 'Monaco, ui-monospace, "JetBrains Mono", monospace',
      lineHeight: '1.55',
    },
  },
  { dark: true },
)

const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.moduleKeyword], color: C.purple },
  { tag: [t.string, t.special(t.string)], color: C.green },
  { tag: [t.number, t.bool, t.null, t.atom], color: C.orange },
  { tag: t.comment, color: C.comment, fontStyle: 'italic' },
  { tag: t.operator, color: C.aqua },
  { tag: t.function(t.variableName), color: C.blue },
  { tag: t.definition(t.variableName), color: C.red },
  { tag: t.className, color: C.yellow },
  { tag: t.typeName, color: C.yellow },
  { tag: t.propertyName, color: C.blue },
  { tag: t.variableName, color: C.fg },
  { tag: t.punctuation, color: C.fg },
  { tag: [t.bracket, t.brace, t.paren], color: C.fg },
  { tag: t.meta, color: C.comment },
  { tag: t.invalid, color: C.red },
])

export const tomorrowNight = [themeBase, syntaxHighlighting(highlight)]
