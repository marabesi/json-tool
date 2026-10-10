# Table view

The table view renders your JSON as a table. Switch to it using the **table**
tab in the header (route `/table`).

## How the JSON is rendered

- An **array of objects** becomes one row per element, with a column for every
  property found in the array.
- An **array of simple values** (strings, numbers, booleans) becomes a single
  `value` column.
- A **single object** becomes a list of key/value rows.
- **Nested objects and arrays** are shown as smaller tables inside the cell.

## Searching in the table

- Type in the search box to filter the rows. The search is case-insensitive and
  checks every column, including nested values.
- Search a specific column with `column:value`, for example `index:0` keeps only
  the rows where the `index` column matches `0`. The column name is matched
  case-insensitively and can also be abbreviated.
- Matching is fuzzy by default: the characters of the term only need to appear
  in order, so `mse` matches `Mouse`. This works for both the column name and
  the value.
- Turn on **Exact match** to require the value to be exactly the term (ignoring
  case) instead of fuzzy matching. For example, `index:0` with exact match keeps
  only the rows where the index is `0`, not `10`.
- Only the rows that match stay visible. Rows without any match are hidden and
  `No matching data` is shown when nothing matches.
- The counter next to the search box shows how many rows are currently
  displayed (for example `2 rows`) and updates while you type.
- Use **full screen** to expand the table to the whole page, and exit full
  screen to go back.
