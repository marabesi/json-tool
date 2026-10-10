# Editor (home)

The home view is the place where you format and validate your JSON.

## Editing

- Paste or type your JSON in the editor on the left. The editor on the right
  shows the formatted result as you type.
- Use the **validate json** toggle in the header to be warned when the content
  is not valid JSON. The error is shown below the editors.
- Turn on **sync scroll** in the header to keep both editors on the same
  relative line while scrolling.
- Resize the editors by dragging the divider between them, or by focusing it
  and pressing the left/right arrow keys. The divider position is kept while
  you switch between views.

## Toolbars

The editor menus use icons only — hover over an icon to see what it does.

**Left toolbar**

| Action | Description |
| --- | --- |
| Search in JSON | Open the search panel inside the JSON editor |
| Paste from clipboard | Paste the clipboard content into the editor |
| Upload JSON file | Load a `.json` file from disk |
| Clean all | Delete all the content |

**Right toolbar**

| Action | Description |
| --- | --- |
| Search in result | Open the search panel inside the result editor |
| Space tabulation | Set the indentation (2 spaces by default) |
| Clean spaces | Remove the spaces |
| Clean new lines | Remove the line breaks |
| Clean new lines and spaces | Remove both the line breaks and the spaces |
| Copy JSON | Copy the formatted result to the clipboard |

## History

When history is enabled in the [settings](/guide/settings), the header shows a
history button that opens a drawer with the previously used JSON.
