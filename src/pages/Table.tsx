import { Ref, useMemo, useRef, useState } from 'react';
import { openSearchPanel } from '@codemirror/search';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import Button from '../components/ui/io/Button';
import JsonEditor from '../components/ui/editor/JsonEditor';
import ResizableEditors from '../components/ui/editor/ResizableEditors';
import EditorPage from '../components/ui/layout/EditorPage';
import JsonMenu from '../components/ui/menu/JsonMenu';
import JsonTable from '../components/ui/table/JsonTable';
import { JsonValue, countTableRows } from '../core/jsonToTable';
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
  const rowCount = useMemo(() => (data === undefined ? 0 : countTableRows(data, search)), [data, search]);

  return (
    <EditorPage pageTestId="table-page">
      <ResizableEditors
        left={
          <>
            <JsonMenu
              onLoadedFile={(text) => onChange(text, spacing, true)}
              onSearch={() => {
                const target = jsonReferenceEditor?.current?.view;
                if (target !== undefined) {
                  openSearchPanel(target);
                }
              }}
            />
            <JsonEditor
              input={jsonState}
              onChange={(event) => onChange(event.value, spacing, false)}
              data-testid="table-json"
              contenteditable={true}
              width="100%"
              ref={jsonReferenceEditor as Ref<ReactCodeMirrorRef> | undefined}
            />
          </>
        }
        right={
          <>
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
              <span data-testid="table-row-count" className="text-sm">
                {rowCount} {rowCount === 1 ? 'row' : 'rows'}
              </span>
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
          </>
        }
        rightTestId="table-pane"
        rightFullscreen={isFullscreen}
        rightClassName={isFullscreen ? 'fixed inset-0 z-50 bg-blue-400 p-2 dark:bg-gray-600 !m-0' : ''}
      />
    </EditorPage>
  );
}
