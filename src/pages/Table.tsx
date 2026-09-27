import { Ref, useMemo, useRef, useState } from 'react';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import Button from '../components/ui/io/Button';
import EditorContainer from '../components/ui/editor/EditorContainer';
import JsonEditor from '../components/ui/editor/JsonEditor';
import JsonTable from '../components/ui/table/JsonTable';
import { JsonValue } from '../core/jsonToTable';
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

export default function Table() {
  const { jsonState, onChange, spacing } = usePersistenceContext();
  const [search, setSearch] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const jsonReferenceEditor = useRef<ReactCodeMirrorRef>(undefined);

  const { data, error } = useMemo(() => parseJson(jsonState), [jsonState]);

  return (
    <div className="p-1 pt-0 mb-8 pb-8 flex flex-col h-full" style={{ height: '80vh' }}>
      <h1 className="text-xl m-2 ml-0" data-testid="table-title">JSON as a table</h1>
      <div className="flex flex-1 min-h-0 p-1 pt-0" data-testid="table-page">
        <div className="shrink-0">
          <EditorContainer>
            <JsonEditor
              input={jsonState}
              onChange={(event) => onChange(event.value, spacing, false)}
              data-testid="table-json"
              contenteditable={true}
              ref={jsonReferenceEditor as Ref<ReactCodeMirrorRef> | undefined}
            />
          </EditorContainer>
        </div>
        <div
          data-testid="table-pane"
          data-fullscreen={isFullscreen}
          className={isFullscreen ? 'fixed inset-0 z-50 bg-blue-400 p-2 dark:bg-gray-600' : 'flex-1 min-w-0'}
        >
          <EditorContainer>
            <div className="m-1 flex flex-wrap items-center gap-1">
              <input
                data-testid="table-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                className="p-1 text-sm bg-blue-300 dark:bg-gray-500"
              />
              <Button data-testid="toggle-fullscreen" onClick={() => setIsFullscreen((value) => !value)}>
                {isFullscreen ? 'Exit full screen' : 'Full screen'}
              </Button>
            </div>
            <div
              data-testid="table-container"
              className="m-1 flex-1 min-h-0 overflow-auto rounded bg-blue-300/40 p-2 dark:bg-gray-800/60"
            >
              {error !== '' && <p data-testid="table-error" className="m-1 text-center text-white bg-red-600">{error}</p>}
              {error === '' && data === undefined && (
                <p data-testid="table-empty" className="p-2">Paste JSON to see it as a table.</p>
              )}
              {data !== undefined && <JsonTable data={data} search={search} />}
            </div>
          </EditorContainer>
        </div>
      </div>
    </div>
  );
}
