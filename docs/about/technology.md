# Technology

json-tool is built with [React](https://react.dev/),
[TypeScript](https://www.typescriptlang.org/),
[Tailwind CSS](https://tailwindcss.com/) and
[CodeMirror](https://codemirror.net/). It ships as a web app and as an
[Electron](https://www.electronjs.org/) desktop app.

## Web Workers

The JSON strings are processed in a **Web Worker**, so the interface stays fast
and responsive even while formatting large documents. This technology decision
was made to ensure that the tool is fast and responsive at the same time it
provides long term support and constant updates.

Read more:
[Web Workers to the Rescue — How to Work with JSON Strings without Blocking User Interactions](https://marabesi.com/javascript/web-workers-to-the-rescue-how-to-work-with-json-strings-without-blocking-user-interactions.html?utm_source=json-tool&utm_medium=direct&utm_campaign=jsontool&utm_id=json-tool-docs)

## Source code

The source code is available on GitHub at
[marabesi/json-tool](https://github.com/marabesi/json-tool).
