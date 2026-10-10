# Shape view

The shape view summarises the structure of your JSON. Switch to it using the
**shape** tab in the header (route `/schema`). Paste JSON into the working
editor and the right pane shows an aggregate analysis of the whole document
plus the same analysis for every nested object/array shape.

## Statistics

For the whole document and for every nested shape, json-tool reports:

| Statistic | Meaning |
| --- | --- |
| Objects | Total objects in the subtree |
| Arrays | Total arrays in the subtree |
| Properties | Distinct property names |
| Values | Total values (property values plus array elements) |
| Filled | Count of values that are not empty |
| Empty | Count of values that are empty |
| Average properties | Property values per object |
| Type breakdown | Count and percentage for each JSON type, sorted by count |

A value is considered **empty** when it is `null`, `""`, `[]` or `{}`.

## Nested shapes

- Array elements and property values are both counted as values.
- Repeated shapes are aggregated into a single node. For example, 32 objects
  with an `author` field produce one `author` node with an instance count of
  `32`.
- A nested shape appears only under its parent path; paths are never duplicated
  across levels.
- Fields inside an array are measured against the number of elements; nested
  objects inherit the enclosing population, so percentages never exceed 100%.

Use **expand all** and **collapse all** to open or close every nested shape at
once.
