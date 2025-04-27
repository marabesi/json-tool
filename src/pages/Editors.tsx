import { Ref, useEffect, useRef, useState } from 'react';
import { openSearchPanel } from '@codemirror/search';
import JsonEditor from '../components/ui/editor/JsonEditor';
import CleanUp from '../core/cleanUp';
import ResultMenu from '../components/ui/menu/ResultMenu';
import JsonMenu from '../components/ui/menu/JsonMenu';
import EditorContainer from '../components/ui/editor/EditorContainer';
import Loading from '../components/ui/Loading';
import toast from 'react-hot-toast';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { usePersistenceContext } from '../PersistenceContext';
import { useJsonHistoryContext } from '../JsonHistoryContext';

const cleanUp = new CleanUp();
const defaultSpacing = '2';

const code = `
      importScripts('https://unpkg.com/format-to-json@2.1.2/fmt2json.min.js');

      if('function' === typeof importScripts) {
        addEventListener('message', async (event) => {
           if (!event) {
             return;
           }

           const value = event.data.jsonAsString;
           const spacing = event.data.spacing;
           const isValidateEnabled = event.data.isValidateEnabled;

           if (value) {
             // eslint-disable-next-line no-undef
             const format = await fmt2json(value, {
               expand: true,
               escape: false,
               indent: parseInt(spacing)
             });

             try {
               if (isValidateEnabled) {
                 JSON.parse(value);
               }
             } catch (e) {
               console.error('error from worker: ', e);
               postMessage({ error: true, originalJson: value, result: format.result });
               return;
             }

             postMessage({ error: false, originalJson: value, result: format.result });
             return;
           }
           // empty json was given
           postMessage({ error: false, originalJson: value, result: value });
         });
      }
    `;

export default function Editors() {
  const worker = useRef<Worker>(undefined);
  const { jsonState, saveState, resultState, isValidateEnabled } = usePersistenceContext();
  const historyContext = useJsonHistoryContext();
  const [originalJson, setOriginalResult] = useState<string>(jsonState);
  const [result, setResult] = useState<string>(resultState);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [spacing, setSpacing] = useState<string>(defaultSpacing);
  const jsonReferenceEditor = useRef<ReactCodeMirrorRef>(undefined);
  const resultReferenceEditor: any = useRef(undefined);

  useEffect(() => {
    worker.current = new Worker(URL.createObjectURL(new Blob([code])));
    worker.current.onmessage = (workerSelf: MessageEvent) => {
      setError('');
      if (workerSelf.data.error) {
        setError('invalid json');
      }

      setResult(workerSelf.data.result);
      setInProgress(false);
    };
  }, []);

  useEffect(() => {
    return () => {
      saveState(originalJson, result);
    };
  }, [saveState, originalJson, result]);

  const onChange = (eventValue: string, eventSpacing: string) =>{
    if (worker.current) {
      worker.current.postMessage({ jsonAsString: eventValue, spacing: eventSpacing, isValidateEnabled });
    }
    setOriginalResult(eventValue);
    setInProgress(true);
    historyContext.appendEntry(eventValue);
  };

  const pasteFromClipboard = async () => {
    const clipboardItems = await navigator.clipboard.read();
    let result = '';
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        const text = await blob.text();
        result += text;
      }
    }

    onChange(result, spacing);
  };

  const cleanup = () => onChange('', spacing);

  const writeToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    toast.success('Copied');
  };

  const cleanWhiteSpaces = () => {
    const withoutSpaces = cleanUp.cleanWhiteSpaces(originalJson);
    setResult(withoutSpaces);
  };

  const cleanNewLines = () => {
    const withoutNewLines = cleanUp.cleanNewLines(originalJson);
    setResult(withoutNewLines);
  };

  const cleanNewLinesAndSpaces = () => {
    const withoutSpacesAndNewLines = cleanUp.cleanWhiteSpacesAndNewLines(originalJson);
    setResult(withoutSpacesAndNewLines);
  };

  const updateSpacing = (newSpacing: string) => {
    setSpacing(newSpacing);
    onChange(originalJson, newSpacing);
  };

  return <div className="p-1 mb-8 pb-8 h-full" style={{ height: '80vh' }}>
    <div className="flex h-full justify-center p-1" data-testid="editor-container">
      <EditorContainer>
        <JsonMenu
          pasteFromClipboard={navigator.clipboard && typeof navigator.clipboard.write === 'function' ? pasteFromClipboard : false}
          cleanup={cleanup}
          onLoadedFile={(text: string) => onChange(text, spacing)}
          onSearch={() => openSearchPanel(jsonReferenceEditor.current?.view!!)}
        />

        <JsonEditor
          input={originalJson}
          onChange={event => onChange(event.value, spacing)}
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
        <ResultMenu
          spacing={spacing}
          updateSpacing={updateSpacing}
          writeToClipboard={navigator.clipboard && typeof navigator.clipboard.read === 'function' ? writeToClipboard : false}
          cleanWhiteSpaces={cleanWhiteSpaces}
          cleanNewLines={cleanNewLines}
          cleanNewLinesAndSpaces={cleanNewLinesAndSpaces}
          onSearch={() => openSearchPanel(resultReferenceEditor.current.view)}
        />

        <JsonEditor
          input={result}
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
