export function Docs() {
  return (
    <div className="p-10">
      <h1 className="text-2xl pb-10">JSON tool docs</h1>
      <ul className="pt-5">
        <li className="pb-5">
          <details open={true}>
            <summary className="cursor-pointer">
              <span className="text-xl mt-5">
                Using JSON tool
              </span>
            </summary>
            <div className="space-y-4 pt-2">
              <section>
                <h3 className="text-lg font-semibold">Editor (home)</h3>
                <ul className="list-disc pl-6 pt-1">
                  <li>Paste or type your JSON in the editor on the left. The editor on the right shows the formatted result as you type.</li>
                  <li>Use the <strong>validate json</strong> toggle in the header to be warned when the content is not valid JSON. The error is shown below the editors.</li>
                  <li>Left toolbar (hover an icon to see its name): search in the JSON, paste from clipboard, upload a JSON file and delete all.</li>
                  <li>Right toolbar: search in the result, set the indentation with space tabulation (2 spaces by default), clean spaces, clean new lines, clean new lines and spaces, and copy the result to the clipboard.</li>
                  <li>Resize the editors by dragging the divider between them, or by focusing it and pressing the left/right arrow keys. The divider position is kept while you switch between views.</li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Table view</h3>
                <p className="pt-1">The table view shows the JSON as a table:</p>
                <ul className="list-disc pl-6 pt-1">
                  <li>An array of objects becomes one row per element, with a column for every property found in the array.</li>
                  <li>An array of simple values (strings, numbers, booleans) becomes a single value column.</li>
                  <li>A single object becomes a list of key/value rows.</li>
                  <li>Nested objects and arrays are shown as smaller tables inside the cell.</li>
                </ul>
                <p className="pt-2 font-semibold">Searching in the table</p>
                <ul className="list-disc pl-6 pt-1">
                  <li>Type in the search box to filter the rows. The search is case-insensitive and checks every column, including nested values.</li>
                  <li>Search a specific column with <code>column:value</code>, for example <code>index:0</code> keeps only the rows where the <code>index</code> column matches <code>0</code>. The column name is matched case-insensitively and can also be abbreviated.</li>
                  <li>Matching is fuzzy by default: the characters of the term only need to appear in order, so <code>mse</code> matches <code>Mouse</code>. This works for both the column name and the value.</li>
                  <li>Turn on <strong>Exact match</strong> to require the value to be exactly the term (ignoring case) instead of fuzzy matching. For example, <code>index:0</code> with exact match keeps only the rows where the index is <code>0</code>, not <code>10</code>.</li>
                  <li>Only the rows that match stay visible. Rows without any match are hidden and <code>No matching data</code> is shown when nothing matches.</li>
                  <li>The counter next to the search box shows how many rows are currently displayed (for example <code>2 rows</code>) and updates while you type.</li>
                  <li>Use full screen to expand the table to the whole page, and exit full screen to go back.</li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Shape view</h3>
                <ul className="list-disc pl-6 pt-1">
                  <li>The shape view summarises the JSON structure: total objects, arrays, distinct properties, values, filled and empty values, the average number of properties per object, and a breakdown by type.</li>
                  <li>Every nested object and array gets the same statistics, scoped to that part of the JSON. Use expand all and collapse all to open or close every nested shape at once.</li>
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-semibold">Menus</h3>
                <p className="pt-1">The editor menus use icons only. Hover over an icon to see what it does.</p>
              </section>
            </div>
          </details>
        </li>
        <li className="pb-5">
          <details open={true}>
            <summary className="cursor-pointer">
              <span className="text-xl mt-5">
                Why JSON tool?
              </span>
            </summary>
            <div>
              JSON tool is a simple tool that does not track you, does not store your data and does not sell your data.
              It is a simple tool that helps you format, validate and beautify your JSON strings. It is a simple tool
              that helps you work with JSON strings.
              <a href="https://marabesi.com/tools/json-tool-a-companion-for-formatting-json-strings.html?utm_source=json-tool&utm_medium=direct&utm_campaign=jsontool&utm_id=json-tool-docs" target="_blank" rel="noreferrer">
                <div className="text-blue-500 hover:underline">Read more</div>
              </a>
            </div>
          </details>
        </li>
        <li className="pb-5">
          <details open={true}>
            <summary className="cursor-pointer">
              <span className="text-xl mt-5">The technology behind JSON tool</span>
            </summary>
            <ul className="pt-1">
              <li>
                JSON tool is built with React, TypeScript and Tailwind CSS, it uses WebWorkers to process the JSON
                strings and format them. The technology decision was made to ensure that the tool is fast and responsive
                at the same time provides a long term support and constant updates.
                <a href="https://marabesi.com/javascript/web-workers-to-the-rescue-how-to-work-with-json-strings-without-blocking-user-interactions.html?utm_source=json-tool&utm_medium=direct&utm_campaign=jsontool&utm_id=json-tool-docs" target="_blank" rel="noreferrer">
                  <div className="text-blue-500 hover:underline">Read more</div>
                </a></li>
            </ul>
          </details>
        </li>
        <li className="pb-5">
          <details open={true}>
            <summary className="cursor-pointer">
              <span className="text-xl mt-5">Five Years of Open Source json-tool and 3,000 Active Users Later</span>
            </summary>
            <ul className="pt-1">
              <li>
                Five years ago, I started working on json-tool out of necessity. I needed a JSON formatting tool I
                could trust with sensitive data: one that wouldn’t send my information to third-party servers filled with
                ads and tracking scripts. What began as a personal weekend project has quietly grown into something used
                by 3,000 active users. This milestone made me pause and reflect on what this journey has taught me about
                building and maintaining open source software.
                <a href="https://marabesi.com/thoughts/five-years-json-tool-3000-active-users.html?utm_source=json-tool&utm_medium=direct&utm_campaign=jsontool&utm_id=json-tool-docs" target="_blank" rel="noreferrer">
                  <div className="text-blue-500 hover:underline">Read more</div>
                </a></li>
            </ul>
          </details>
        </li>
        {/* <li>
          <details open={true}>
            <summary>
              <span className="text-xl mt-5">The features</span>
            </summary>
          
            <div>
              <ul>
                <li>JSON content validation, it shows an error message warning invalid json</li>
                <li>Buttons to allow easy interaction with the clipboard</li>
                <li>Upload json file</li>
                <li>Search through the editors to find matching cases (regex or simple text - provided by codemirror)</li>
                <li>Dark mode</li>
              </ul>
            </div>
          
          </details>
        </li> */}
      </ul>
    </div>
  );
}
