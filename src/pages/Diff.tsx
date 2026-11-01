import { Ref, useMemo, useRef, useState } from 'react';
import { openSearchPanel } from '@codemirror/search';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import JsonDiff from '../components/ui/diff/JsonDiff';
import JsonEditor from '../components/ui/editor/JsonEditor';
import ResizableEditors from '../components/ui/editor/ResizableEditors';
import EditorPage from '../components/ui/layout/EditorPage';
import JsonMenu from '../components/ui/menu/JsonMenu';
import { diffJson } from '../core/jsonDiff';
import { parseJson } from '../core/parseJson';
import { usePersistenceContext } from '../PersistenceContext';

export default function Diff() {
  const { jsonState, onChange, spacing } = usePersistenceContext();
  const [comparedState, setComparedState] = useState<string>('');
  const jsonReferenceEditor = useRef<ReactCodeMirrorRef>(undefined);
  const comparedReferenceEditor = useRef<ReactCodeMirrorRef>(undefined);

  const { data: original, error: originalError } = useMemo(() => parseJson(jsonState), [jsonState]);
  const { data: compared, error: comparedError } = useMemo(() => parseJson(comparedState), [comparedState]);
  const report = useMemo(
    () => (original === undefined || compared === undefined ? undefined : diffJson(original, compared)),
    [original, compared],
  );

  const error = originalError !== '' ? originalError : comparedError;

  return (
    <EditorPage
      pageTestId="diff-page"
      footer={
        <div
          data-testid="diff-container"
          className="m-1 mt-2 flex h-64 flex-col overflow-hidden rounded bg-blue-300/40 p-2 dark:bg-gray-800/60"
        >
          {error !== '' && <p data-testid="diff-error" className="m-1 text-center text-white bg-red-600">{error}</p>}
          {error === '' && report === undefined && (
            <p data-testid="diff-empty" className="p-2">Paste JSON in both editors to see the differences.</p>
          )}
          {report !== undefined && (
            <div className="min-h-0 overflow-auto">
              <JsonDiff report={report} />
            </div>
          )}
        </div>
      }
    >
      <ResizableEditors
        left={
          <>
            <JsonMenu
              label="Original"
              onLoadedFile={(text) => onChange(text as string, spacing, false)}
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
              data-testid="diff-json"
              contenteditable={true}
              width="100%"
              ref={jsonReferenceEditor as Ref<ReactCodeMirrorRef> | undefined}
            />
          </>
        }
        right={
          <>
            <JsonMenu
              label="Compare with"
              testIdPrefix="diff-compare"
              shortcutPrefix="Alt+Shift"
              searchShortcuts={['Mod+Shift+F']}
              onLoadedFile={(text) => setComparedState(text as string)}
              onPaste={(content) => setComparedState(content)}
              onDelete={() => setComparedState('')}
              onSearch={() => {
                const target = comparedReferenceEditor?.current?.view;
                if (target !== undefined) {
                  openSearchPanel(target);
                }
              }}
            />
            <JsonEditor
              input={comparedState}
              onChange={(event) => setComparedState(event.value)}
              data-testid="diff-compare-json"
              contenteditable={true}
              width="100%"
              ref={comparedReferenceEditor as Ref<ReactCodeMirrorRef> | undefined}
            />
          </>
        }
        rightTestId="diff-pane"
      />
    </EditorPage>
  );
}
