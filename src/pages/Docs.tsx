export function Docs() {
  return (
    <div className="p-10">
      <h1 className="text-2xl pb-10">JSON tool docs</h1>
      <ul className="pt-5">
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
