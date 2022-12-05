import { useEffect, useState, useCallback } from 'react';
import JsonEditor from '../components/ui/editor/JsonEditor';
import CleanUp from '../core/cleanUp';
import ResultMenu from '../components/ui/menu/ResultMenu';
import JsonMenu from '../components/ui/menu/JsonMenu';
import EditorContainer from '../components/ui/editor/EditorContainer';
import { EditorsPageProps } from '../types/pages';
import myWorker from '../core/worker';

const cleanUp = new CleanUp();
const defaultSpacing = '2';

const debounce = (callback: any, wait: any) => {
  let timeoutId: any = null;
  return (...args: any) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};
export default function Editors({ onPersist, currentJson }: EditorsPageProps) {
  const [originalJson, setOriginalResult] = useState<string>(currentJson);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [spacing, setSpacing] = useState<string>(defaultSpacing);

  const onJsonChange = useCallback(() => {
    const code = `
      importScripts('https://unpkg.com/format-to-json@2.1.2/fmt2json.min.js');
      
      if('function' === typeof importScripts) {
        addEventListener('message', ${myWorker.toString()})
      }
    `;
    const worker = new Worker(URL.createObjectURL(new Blob([code])));
    worker.postMessage({ jsonAsString: originalJson, spacing });
    worker.onmessage = async (workerSelf: any) => {
      setError('');
      if (workerSelf.data.error) {
        setError('invalid json');
      }
      setOriginalResult(workerSelf.data.originalJson);
      setResult(workerSelf.data.result);
      worker.terminate();
    };
  }, [originalJson, spacing]);

  useEffect(() => {
    if (!spacing) return;

    onJsonChange();

    return () => {
      onPersist(originalJson);
    };
  }, [spacing, onPersist, originalJson, onJsonChange]);

  const pasteFromClipboard = async () => {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        const text = await blob.text();
        setOriginalResult(text);
      }
    }
  };

  const cleanup = () => {
    setOriginalResult('');
  };

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
            onChange={debounce((eventValue: any) => setOriginalResult(eventValue.value), 500)}
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
