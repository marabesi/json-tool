# Getting started

json-tool allows you to quickly format JSON content with a click of a button,
and much more:

- **JSON validation** — shows an error message warning about invalid JSON.
- **Clipboard** — buttons to paste and copy JSON easily.
- **Search** — search through the JSON and the result (provided by CodeMirror).
- **File upload** — upload a JSON file.
- **Table view** — inspect your JSON as a table.
- **Shape view** — inspect the JSON shape and statistics.
- **Dark mode** and a **history drawer**.

The tool is available as a web app and as an Electron desktop app.

## Open the app

You can use the hosted version at
[marabesi.github.io/json-tool](https://marabesi.github.io/json-tool), or run
it locally.

## Basic usage

1. Open the app and paste or type JSON into the working editor on the left.
2. The editor on the right shows the formatted result as you type.
3. Use the tabs in the header to switch between the views:

   | Tab | Route | What it shows |
   | --- | --- | --- |
   | home | `/` | Format and validate editors |
   | table | `/table` | The JSON as a table |
   | shape | `/schema` | JSON shape and statistics |
   | settings | `/settings` | Application settings |

4. Toggle **validate json** and **sync scroll**, and switch **dark mode** from
   the header.

## Run it locally

Install the dependencies and start the development server:

```sh
pnpm install
pnpm start
```

The app runs at `http://localhost:3000`. To run the Electron desktop app
together with the dev server use `pnpm dev`.

## Next steps

- [Editor (home)](/guide/editor)
- [Table view](/guide/table)
- [Shape view](/guide/shape)
- [Settings](/guide/settings)
