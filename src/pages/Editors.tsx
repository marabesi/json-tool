import { Ref, useRef, useEffect } from 'react';
import { openSearchPanel } from '@codemirror/search';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import JsonEditor from '../components/ui/editor/JsonEditor';
import ResultMenu from '../components/ui/menu/ResultMenu';
import JsonMenu from '../components/ui/menu/JsonMenu';
import EditorContainer from '../components/ui/editor/EditorContainer';
import Loading from '../components/ui/Loading';
import { usePersistenceContext } from '../PersistenceContext';

export default function Editors() {
  const { error, inProgress, onChange, jsonState, resultState, isValidateEnabled, spacing } = usePersistenceContext();
  const jsonReferenceEditor = useRef<ReactCodeMirrorRef>(undefined);
  const resultReferenceEditor: any = useRef(undefined);
  const isSyncingScroll = useRef(false);

  useEffect(() => {
    const jsonEditor = jsonReferenceEditor.current;
    const resultEditor = resultReferenceEditor.current;

    if (!jsonEditor?.view || !resultEditor?.view) {
      return;
    }

    // Store views in local variables to satisfy TypeScript
    const jsonView = jsonEditor.view;
    const resultView = resultEditor.view;

    const syncScroll = (sourceView: EditorView, targetView: EditorView) => {
      if (isSyncingScroll.current) return;
      
      isSyncingScroll.current = true;
      
      const sourceScroll = sourceView.scrollDOM.scrollTop;
      const sourceHeight = sourceView.scrollDOM.scrollHeight - sourceView.scrollDOM.clientHeight;
      const targetHeight = targetView.scrollDOM.scrollHeight - targetView.scrollDOM.clientHeight;
      
      if (sourceHeight > 0 && targetHeight > 0) {
        const scrollRatio = sourceScroll / sourceHeight;
        targetView.scrollDOM.scrollTop = scrollRatio * targetHeight;
      } else {
        targetView.scrollDOM.scrollTop = sourceScroll;
      }
      
      requestAnimationFrame(() => {
        isSyncingScroll.current = false;
      });
    };

    const handleJsonScroll = () => {
      syncScroll(jsonView, resultView);
    };

    const handleResultScroll = () => {
      syncScroll(resultView, jsonView);
    };

    const jsonScrollDOM = jsonView.scrollDOM;
    const resultScrollDOM = resultView.scrollDOM;

    jsonScrollDOM.addEventListener('scroll', handleJsonScroll);
    resultScrollDOM.addEventListener('scroll', handleResultScroll);

    return () => {
      jsonScrollDOM.removeEventListener('scroll', handleJsonScroll);
      resultScrollDOM.removeEventListener('scroll', handleResultScroll);
    };
  }, [jsonState, resultState]);

  return <div className="p-1 pt-0 mb-8 pb-8 h-full" style={{ height: '80vh' }}>
    <div className="flex h-full justify-center p-1 pt-0" data-testid="editor-container">
      <EditorContainer>
        <JsonMenu
          onLoadedFile={(text: string) => onChange(text, spacing, true)}
          onSearch={() => openSearchPanel(jsonReferenceEditor.current?.view!!)}
        />
        <JsonEditor
          input={jsonState}
          onChange={event => onChange(event.value, spacing, true)}
          data-testid="json"
          contenteditable={true}
          ref={jsonReferenceEditor as Ref<ReactCodeMirrorRef> | undefined}
        />
      </EditorContainer>
      <div className="w-12 flex justify-center items-center">
        {inProgress ?
          <Loading className="animate-spin h-6 w-6 text-blue-900 dark:text-gray-400" data-testid="loading"/>
          : <div className="h-6 w-6"></div>}
      </div>
      <EditorContainer>
        <ResultMenu onSearch={() => openSearchPanel(resultReferenceEditor.current.view)} />
        <JsonEditor
          input={resultState}
          className="result"
          data-testid="result"
          contenteditable={true}
          ref={resultReferenceEditor}
        />
      </EditorContainer>
    </div>
    <div className="bg-red-600 m-1 mt-2 text-center text-white">
      {isValidateEnabled && error && <p data-testid="error">{error}</p>}
    </div>
  </div>;
}
