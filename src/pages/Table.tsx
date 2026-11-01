import { Ref, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { openSearchPanel } from '@codemirror/search';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import Button from '../components/ui/io/Button';
import JsonEditor from '../components/ui/editor/JsonEditor';
import ResizableEditors from '../components/ui/editor/ResizableEditors';
import EditorPage from '../components/ui/layout/EditorPage';
import JsonMenu from '../components/ui/menu/JsonMenu';
import JsonTable from '../components/ui/table/JsonTable';
import { countTableRows } from '../core/jsonToTable';
import { parseJson } from '../core/parseJson';
import { usePersistenceContext } from '../PersistenceContext';
import { useShortcut } from '../ShortcutsContext';

export default function Table() {
  const { jsonState, onChange, spacing } = usePersistenceContext();
  const [search, setSearch] = useState('');
  const [exactMatch, setExactMatch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const jsonReferenceEditor = useRef<ReactCodeMirrorRef>(undefined);
  const tableSearchReference = useRef<HTMLInputElement>(null);

  const deferredSearch = useDeferredValue(search);
  const deferredExactMatch = useDeferredValue(exactMatch);
  const { data, error } = useMemo(() => parseJson(jsonState), [jsonState]);
  const rowCount = useMemo(
    () => (data === undefined ? 0 : countTableRows(data, deferredSearch, deferredExactMatch)),
    [data, deferredSearch, deferredExactMatch],
  );

  const handleEditorChange = useCallback((event: { value: string }) => {
    onChange(event.value, spacing, false);
  }, [onChange, spacing]);

  useEffect(() => {
    if (!isFullscreen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useShortcut({
    id: 'table-search',
    keys: ['Alt+G'],
    description: 'Focus the table search',
    section: 'Table view',
    handler: () => {
      tableSearchReference.current?.focus();
      tableSearchReference.current?.select();
    },
  });

  useShortcut({
    id: 'table-fullscreen',
    keys: ['Alt+Enter'],
    description: 'Toggle the table full screen',
    section: 'Table view',
    handler: () => setIsFullscreen((value) => !value),
  });

  useShortcut({
    id: 'table-exact-match',
    keys: ['Alt+E'],
    description: 'Toggle exact match',
    section: 'Table view',
    handler: () => setExactMatch((value) => !value),
  });

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
              onChange={handleEditorChange}
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
                ref={tableSearchReference}
                data-testid="table-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search or column:value"
                aria-label="Search in the table"
                className="p-1 text-sm bg-blue-300 dark:bg-gray-500"
              />
              <Button
                data-testid="toggle-fullscreen"
                onClick={() => setIsFullscreen((value) => !value)}
                title={isFullscreen ? 'Exit full screen (Esc)' : 'Show the table in full screen'}
                aria-pressed={isFullscreen}
              >
                {isFullscreen ? 'Exit full screen' : 'Full screen'}
              </Button>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  data-testid="table-exact-match"
                  checked={exactMatch}
                  onChange={(event) => setExactMatch(event.target.checked)}
                />
                Exact match
              </label>
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
              {data !== undefined && <JsonTable data={data} search={deferredSearch} exact={deferredExactMatch} />}
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
