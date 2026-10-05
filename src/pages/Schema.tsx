import { Ref, useMemo, useRef } from 'react';
import { openSearchPanel } from '@codemirror/search';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import JsonEditor from '../components/ui/editor/JsonEditor';
import ResizableEditors from '../components/ui/editor/ResizableEditors';
import EditorPage from '../components/ui/layout/EditorPage';
import JsonMenu from '../components/ui/menu/JsonMenu';
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
  const schemaReferenceEditor = useRef<ReactCodeMirrorRef>(undefined);

  const { data, error } = useMemo(() => parseJson(jsonState), [jsonState]);
  const report = useMemo(() => (data === undefined ? undefined : analyzeShapeReport(data)), [data]);

  return (
    <EditorPage pageTestId="schema-page">
      <ResizableEditors
        left={
          <>
            <JsonMenu
              onLoadedFile={(text) => onChange(text, spacing, true)}
              onSearch={() => {
                const target = schemaReferenceEditor?.current?.view;
                if (target !== undefined) {
                  openSearchPanel(target);
                }
              }}
            />
            <JsonEditor
              input={jsonState}
              onChange={(event) => onChange(event.value, spacing, false)}
              data-testid="schema-json"
              contenteditable={true}
              width="100%"
              ref={schemaReferenceEditor as Ref<ReactCodeMirrorRef> | undefined}
            />
          </>
        }
        right={
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
        }
        rightTestId="schema-pane"
      />
    </EditorPage>
  );
}
