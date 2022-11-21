import { useEffect, useState, useMemo } from 'react';
import JsonEditor from '../components/ui/JsonEditor';
import CleanUp from '../core/cleanUp';
import Formatter from '../core/formatter';
import ResultMenu from '../components/ui/menu/ResultMenu';
import JsonMenu from '../components/ui/menu/JsonMenu';
import EditorContainer from '../components/ui/EditorContainer';

const cleanUp = new CleanUp();

interface Props {
  currentJson: string
  onPersist: (json: string) => void
}

export default function Editors({ onPersist, currentJson }: Props) {
  const [originalJson, setOriginalResult] = useState<string>(currentJson);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [spacing, setSpacing] = useState<string>('2');

  const worker = useMemo(() => {
    const code = `
onmessage = (e) => {
  const value = e.data.jsonAsString;

  if (value) {
    try {
      JSON.parse(value);
    } catch (e) {
      postMessage({ error: true, originalJson: value });
      return;
    }

    postMessage({ error: false, originalJson: value });
    return;
  }
  // empty json was given
  postMessage({ error: false, originalJson: value });
};
  `;
    return new Worker(URL.createObjectURL(new Blob([code])));
  }, []);

  worker.onmessage = async (worker: any) => {
    setError('');
    if (worker.data.error) {
      setError('invalid json');
    }

    setOriginalResult(worker.data.originalJson);
  };

  const onJsonChange = async (value: string) => {
    worker.postMessage({ jsonAsString: value });
  };

  useEffect(() => {
    if (!spacing) return;

    const value: string = originalJson;

    let format = new Formatter(value, 2);

    const parseSpacing = parseInt(spacing);
    if (!isNaN(parseSpacing)) {
      format = new Formatter(value, parseSpacing);
    }

    const formatJsonAsync = async () => {
      const result = await format.format();
      setResult(result);
    };

    formatJsonAsync();

    setOriginalResult(value);
    return () => {
      onPersist(originalJson);
    };
  }, [worker, spacing, onPersist, originalJson]);

  const pasteFromClipboard = async () => {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        const text = await blob.text();
        await onJsonChange(text);
      }
    }
  };

  const cleanup = async () => {
    await onJsonChange('');
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
            pasteFromClipboard={pasteFromClipboard}
            cleanup={cleanup}
            onLoadedFile={onJsonChange}
            onSearch={() => search('json')}
          />

          <JsonEditor
            input={originalJson}
            onChange={eventValue => onJsonChange(eventValue.value)}
            data-testid="json"
            contenteditable={true}
          />
        </EditorContainer>
        <EditorContainer>
          <ResultMenu
            spacing={spacing}
            updateSpacing={updateSpacing}
            writeToClipboard={writeToClipboard}
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
