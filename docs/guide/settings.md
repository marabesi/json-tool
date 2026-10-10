# Settings

Open the settings view using the **settings** tab in the header (route
`/settings`). Settings are stored locally in your browser; json-tool never
sends your data to a server.

## Editor

Configure the CodeMirror editor:

- **foldGutter** — show the fold gutter to collapse regions of the document.
- **syntaxHighlighting** — highlight the JSON syntax.
- **highlightActiveLine** — highlight the line that currently has the cursor.
- **historyKeymap** — enable the history key bindings (undo/redo).
- **history** — keep the undo/redo history.
- **autocompletion** — enable autocompletion.
- **closeBrackets** — automatically close brackets.

The font size input controls the size of the text in the editors (12px by
default). Click **Save** to persist the changes.

The indentation (the number of spaces used when formatting) is changed from the
right toolbar in the [editor](/guide/editor), not here.

## Features

- **JSON History** — when enabled, json-tool keeps a history of the JSON you
  have used and shows a history button in the header that opens a drawer with
  the previous entries.
