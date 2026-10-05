import { useMemo } from 'react';
import EditorContainer from '../components/ui/editor/EditorContainer';
import JsonEditor from '../components/ui/editor/JsonEditor';
import JsonShapeStatistics from '../components/ui/schema/JsonShapeStatistics';
import { JsonValue } from '../core/jsonToTable';
import { analyzeShapeReport } from '../core/jsonToSchema';
import { usePersistenceContext } from '../PersistenceContext';

interface ParseResult {
  data?: JsonValue;
  error: string;
}

function parseJson(value: string): ParseResult {
  if (value.trim() === '') {
    return { error: '' };
  }

  try {
    return { data: JSON.parse(value) as JsonValue, error: '' };
  } catch {
    return { error: 'invalid json' };
  }
}

export default function Schema() {
  const { jsonState, onChange, spacing } = usePersistenceContext();

  const { data, error } = useMemo(() => parseJson(jsonState), [jsonState]);
  const report = useMemo(() => (data === undefined ? undefined : analyzeShapeReport(data)), [data]);

  return (
    <div className="p-1 pt-0 mb-8 pb-8 flex flex-col h-full" style={{ height: '80vh' }}>
      <h1 className="text-xl m-2 ml-0" data-testid="schema-title">JSON shape</h1>
      <div className="flex flex-1 min-h-0 p-1 pt-0" data-testid="schema-page">
        <div className="shrink-0">
          <EditorContainer>
            <JsonEditor
              input={jsonState}
              onChange={(event) => onChange(event.value, spacing, false)}
              data-testid="schema-json"
              contenteditable={true}
            />
          </EditorContainer>
        </div>
        <div data-testid="schema-pane" className="flex-1 min-w-0">
          <EditorContainer>
            <div
              data-testid="schema-container"
              className="m-1 flex-1 min-h-0 overflow-auto rounded bg-blue-300/40 p-2 dark:bg-gray-800/60"
            >
              {error !== '' && <p data-testid="schema-error" className="m-1 text-center text-white bg-red-600">{error}</p>}
              {error === '' && report === undefined && (
                <p data-testid="schema-empty" className="p-2">Paste JSON to see its shape.</p>
              )}
              {report !== undefined && <JsonShapeStatistics report={report} />}
            </div>
          </EditorContainer>
        </div>
      </div>
    </div>
  );
}