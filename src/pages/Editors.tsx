import { Ref, useRef, useState } from 'react';
import { openSearchPanel } from '@codemirror/search';
import { EditorView } from '@codemirror/view';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import JsonEditor from '../components/ui/editor/JsonEditor';
import ResultMenu from '../components/ui/menu/ResultMenu';
import JsonMenu from '../components/ui/menu/JsonMenu';
import ResizableEditors from '../components/ui/editor/ResizableEditors';
import EditorPage from '../components/ui/layout/EditorPage';
import Loading from '../components/ui/Loading';
import { usePersistenceContext } from '../PersistenceContext';
import { useScrollSync } from '../hooks/useScrollSync';

export default function Editors() {
  const { error, inProgress, onChange, jsonState, resultState, isValidateEnabled, isScrollSyncEnabled, spacing } = usePersistenceContext();
  const jsonReferenceEditor = useRef<ReactCodeMirrorRef>(undefined);
  const resultReferenceEditor = useRef<ReactCodeMirrorRef>(undefined);
  const [jsonEditorView, setJsonEditorView] = useState<EditorView>();
  const [resultEditorView, setResultEditorView] = useState<EditorView>();

  useScrollSync(jsonEditorView, resultEditorView, isScrollSyncEnabled);

  return <EditorPage
    pageTestId="editors-page"
    footer={isValidateEnabled && error ? (
      <div className="bg-red-600 m-1 mt-2 text-center text-white">
        <p data-testid="error">{error}</p>
      </div>
    ) : undefined}
  >
    <ResizableEditors
      indicator={inProgress ?
        <Loading className="animate-spin h-6 w-6 text-blue-900 dark:text-gray-400" data-testid="loading"/>
        : undefined}
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
            onChange={event => onChange(event.value, spacing, true)}
            onCreateEditor={setJsonEditorView}
            data-testid="json"
            contenteditable={true}
            width="100%"
            ref={jsonReferenceEditor as Ref<ReactCodeMirrorRef> | undefined}
          />
        </>
      }
      right={
        <>
          <ResultMenu onSearch={() => openSearchPanel(resultReferenceEditor.current.view)} />
          <JsonEditor
            input={resultState}
            className="result"
            onCreateEditor={setResultEditorView}
            data-testid="result"
            contenteditable={true}
            width="100%"
            ref={resultReferenceEditor}
          />
        </>
      }
    />
  </EditorPage>;
}
