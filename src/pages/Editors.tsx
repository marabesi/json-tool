import { useCallback, useEffect, useState } from 'react';
import JsonEditor from '../components/ui/JsonEditor';
import CleanUp from '../core/cleanUp';
import Formatter from '../core/formatter';
import ResultMenu from '../components/ui/menu/ResultMenu';
import JsonMenu from '../components/ui/menu/JsonMenu';
import EditorContainer from '../components/ui/EditorContainer';
import DefaultLayout from '../components/ui/layout/Default';

const cleanUp = new CleanUp();

export default function Editors() {
  const [originalJson, setOriginalResult] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [spacing, setSpacing] = useState<string>('2');

  const onJsonChange = useCallback(async (value: string) => {
    setError('');

    if (!spacing) return;

    try {
      if (value) {
        JSON.parse(value);
      }
    } catch (e: any) {
      setError('invalid json');
    }

    let format = new Formatter(value, 2);

    const parseSpacing = parseInt(spacing);
    if (!isNaN(parseSpacing)) {
      format = new Formatter(value, parseSpacing);
    }

    const result = await format.format();

    setOriginalResult(value);
    setResult(result);
  }, [spacing]);

  useEffect(() => {
    onJsonChange(originalJson);
  }, [spacing, originalJson, onJsonChange]);

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

  return (
    <DefaultLayout>
      <div className="p-1 mb-8 h-full" style={{ height: '80vh' }}>
        <div className="flex h-full justify-center">
          <EditorContainer>
            <JsonMenu
              pasteFromClipboard={pasteFromClipboard}
              cleanup={cleanup}
              onLoadedFile={onJsonChange}
            />

            <JsonEditor
              input={originalJson}
              onChange={eventValue => onJsonChange(eventValue.value)}
              data-testid="json"
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
            />

            <JsonEditor
              input={result}
              className="result"
              data-testid="result"
            />
          </EditorContainer>
        </div>
        <div className="bg-red-600 m-1 mt-2 text-center text-white">
          {error && <p data-testid="error">{error}</p>}
        </div>
      </div>
    </DefaultLayout>
  );
}
