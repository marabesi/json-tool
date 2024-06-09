import { Ref, useEffect, useRef, useState } from 'react';
import { openSearchPanel } from '@codemirror/search';
import JsonEditor from '../components/ui/editor/JsonEditor';
import CleanUp from '../core/cleanUp';
import ResultMenu from '../components/ui/menu/ResultMenu';
import JsonMenu from '../components/ui/menu/JsonMenu';
import EditorContainer from '../components/ui/editor/EditorContainer';
import { EditorsPageProps } from '../types/pages';
import Loading from '../components/ui/Loading';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';

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

           if (value) {
             // eslint-disable-next-line no-undef
             const format = await fmt2json(value, {
               expand: true,
               escape: false,
               indent: parseInt(spacing)
             });

             try {
               JSON.parse(value);
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

export default function Editors({ onPersist, currentJson }: EditorsPageProps) {
  const worker = useRef<Worker>();
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [originalJson, setOriginalResult] = useState<string>(currentJson);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [spacing, setSpacing] = useState<string>(defaultSpacing);
  const jsonReferenceEditor = useRef<ReactCodeMirrorRef>();
  const resultReferenceEditor: any = useRef();

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
      onPersist(originalJson);
    };
  }, [onPersist, originalJson]);

  const onChange = (eventValue: string, eventSpacing: string) =>{
    if (worker.current) {
      worker.current.postMessage({ jsonAsString: eventValue, spacing: eventSpacing });
    }
    setOriginalResult(eventValue);
    setInProgress(true);
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

  const writeToClipboard = async () => await navigator.clipboard.writeText(result);

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


  return <div className="p-1 mb-8 h-full" style={{ height: '80vh' }}>
    <div className="flex h-full justify-center" data-testid="editor-container">
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
          <Loading className="animate-spin h-6 w-6 text-blue-900 dark:text-gray-400" data-testid="loading" />
          : null}
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
      {error && <p data-testid="error">{error}</p>}
    </div>
  </div>;
}
