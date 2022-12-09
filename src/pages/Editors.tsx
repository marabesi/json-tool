import { useEffect, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import JsonEditor from '../components/ui/editor/JsonEditor';
import CleanUp from '../core/cleanUp';
import ResultMenu from '../components/ui/menu/ResultMenu';
import JsonMenu from '../components/ui/menu/JsonMenu';
import EditorContainer from '../components/ui/editor/EditorContainer';
import { EditorsPageProps } from '../types/pages';

const cleanUp = new CleanUp();
const defaultSpacing = '2';
const HALF_SECOND = 500;

export default function Editors({ onPersist, currentJson }: EditorsPageProps) {
  const [originalJson, setOriginalResult] = useState<string>(currentJson);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [spacing, setSpacing] = useState<string>(defaultSpacing);

  const onChange = AwesomeDebouncePromise((eventValue: string) => setOriginalResult(eventValue), HALF_SECOND);

  useEffect(() => {
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
    const worker = new Worker(URL.createObjectURL(new Blob([code])));
    worker.postMessage({ jsonAsString: originalJson, spacing });
    worker.onmessage = async (workerSelf: MessageEvent) => {
      setError('');
      if (workerSelf.data.error) {
        setError('invalid json');
      }

      setResult(workerSelf.data.result);
      worker.terminate();
    };
  }, [spacing, originalJson]);

  useEffect(() => {
    return () => {
      onPersist(originalJson);
    };
  }, [onPersist, originalJson]);

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

    onChange(result);
  };

  const cleanup = () => onChange('');

  const writeToClipboard = async () => {
    await navigator.clipboard.writeText(result);
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

  const updateSpacing = (newSpacing: string) => setSpacing(newSpacing);

  const search = (dataTestId: string) => {
    const editor = document.querySelector(`[data-testid=${dataTestId}] .cm-content`) as HTMLElement;
    if (editor) {
      editor.focus();
      editor.dispatchEvent(new KeyboardEvent('keydown', {
        'key': 'f',
        ctrlKey: true,
      }));
    }
  };

  return (
    <div className="p-1 mb-8 h-full" style={{ height: '80vh' }}>
      <div className="flex h-full justify-center">
        <EditorContainer>
          <JsonMenu
            pasteFromClipboard={navigator.clipboard && typeof navigator.clipboard.write === 'function' ? pasteFromClipboard : false}
            cleanup={cleanup}
            onLoadedFile={(text: string) => setOriginalResult(text)}
            onSearch={() => search('json')}
          />

          <JsonEditor
            input={originalJson}
            onChange={event => onChange(event.value)}
            data-testid="json"
            contenteditable={true}
          />
        </EditorContainer>
        <EditorContainer>
          <ResultMenu
            spacing={spacing}
            updateSpacing={updateSpacing}
            writeToClipboard={navigator.clipboard && typeof navigator.clipboard.read === 'function' ? writeToClipboard : false}
            cleanWhiteSpaces={cleanWhiteSpaces}
            cleanNewLines={cleanNewLines}
            cleanNewLinesAndSpaces={cleanNewLinesAndSpaces}
            onSearch={() => search('result')}
          />

          <JsonEditor
            input={result}
            className="result"
            data-testid="result"
            contenteditable={true}
          />
        </EditorContainer>
      </div>
      <div className="bg-red-600 m-1 mt-2 text-center text-white">
        {error && <p data-testid="error">{error}</p>}
      </div>
    </div>
  );
}
