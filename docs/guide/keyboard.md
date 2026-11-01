# Keyboard shortcuts

json-tool can be used without a mouse. Every control can be reached with
**Tab** and activated with **Enter** or **Space**, and each action also has a
dedicated shortcut so you do not have to tab through the page.

Press **?** (when you are not typing in an editor) to open the shortcut list
inside the app. The list only shows the shortcuts available on the current page.

## Navigation and views

| Shortcut | Action |
| --- | --- |
| Alt + 1 or Alt + Home | Go to the home view |
| Alt + 2 | Go to the table view |
| Alt + 3 | Go to the shape view |
| Alt + 4 | Go to the diff view |
| Alt + 5 or Alt + S | Go to the settings view |
| Alt + H | Open or close the history drawer (when JSON History is enabled) |
| Alt + D or Alt + Shift + D | Open the documentation in a new tab |

## Header

| Shortcut | Action |
| --- | --- |
| Alt + J | Toggle **validate json** |
| Alt + Y | Toggle **sync scroll** |
| Alt + M | Toggle dark mode |

## Editors

| Shortcut | Action |
| --- | --- |
| Alt + Shift + W | Focus the working editor (left) |
| Alt + Shift + R | Focus the result or compare editor (right) |
| Tab | Move to the next control, including out of the JSON editors |
| Shift + Tab | Move to the previous control |
| Ctrl/⌘ + F | Search in the working editor |
| Ctrl/⌘ + Shift + F | Search in the result editor |

The editors do not capture **Tab**, so you can always leave an editor and reach
its toolbar, the divider, the other editor, the header and the footer.

The **Alt + Shift + W** and **Alt + Shift + R** shortcuts jump directly into the
left and right editors, so you can start typing without using the mouse or
tabbing through the page.

## Working editor (left)

| Shortcut | Action |
| --- | --- |
| Ctrl/⌘ + F | Search in the working editor |
| Alt + V | Paste from the clipboard |
| Alt + O | Upload a JSON file |
| Alt + Delete | Delete all |

## Result editor (right, home view)

| Shortcut | Action |
| --- | --- |
| Ctrl/⌘ + Shift + F | Search in the result editor |
| Alt + Shift + T | Focus the space tabulation input |
| Alt + Shift + S | Clean spaces |
| Alt + Shift + N | Clean new lines |
| Alt + Shift + B | Clean new lines and spaces |
| Alt + Shift + C | Copy the result |

## Table view

| Shortcut | Action |
| --- | --- |
| Alt + G | Focus the table search |
| Alt + E | Toggle **Exact match** |
| Alt + Enter | Toggle full screen |

## Shape view

| Shortcut | Action |
| --- | --- |
| Alt + E | Expand all nested shapes |
| Alt + W | Collapse all nested shapes |

## Settings view

| Shortcut | Action |
| --- | --- |
| Alt + Enter | Save the settings |

## Diff view

The original editor uses the [working editor](#working-editor-left)
shortcuts. The compare editor uses:

| Shortcut | Action |
| --- | --- |
| Ctrl/⌘ + Shift + F | Search in the compare editor |
| Alt + Shift + V | Paste from the clipboard |
| Alt + Shift + O | Upload a JSON file |
| Alt + Shift + Delete | Delete all |

## Dialogs and full screen

| Shortcut | Action |
| --- | --- |
| ? | Open or close the shortcut list |
| Esc | Close the shortcut list or the history drawer, or exit the table full screen |

## Controls

| Shortcut | Action |
| --- | --- |
| Tab | Move to the next control, including out of the JSON editors |
| Shift + Tab | Move to the previous control |
| Enter or Space | Activate the focused button, link or checkbox |
| Left / Right arrow | Resize the editors when the divider between them is focused |
| Home / End | Use the minimum or maximum editor width when the divider is focused |

The editors do not capture **Tab**, so you can always leave an editor and reach
its toolbar, the divider, the other editor, the header and the footer.

The focused control is highlighted with a yellow outline. The history drawer
keeps the focus inside it while it is open, and returns the focus to the history
button when it is closed.

## Editors

The editors support the usual editing keys, including undo/redo and the
CodeMirror search panel. Press **Esc** to close the search panel.
