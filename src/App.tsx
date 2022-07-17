import { useCallback, useEffect, useState } from 'react';
import Button from './components/Button';
import InputText from './components/InputText';
import JsonEditor from './components/JsonEditor';
import Label from './components/Label';
import CleanUp from './core/cleanUp';
import Formatter from './core/formatter';

const cleanUp = new CleanUp();

function App() {
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
    <div className="h-screen bg-gray-500 p-5">
      <a data-testid="buy-me-a-coffee" href="https://www.buymeacoffee.com/marabesi" target="_blank" rel="noreferrer">Buy me a coffee</a>
      <div className="flex w-full justify-start items-center">
        <div className="w-3/6">
          <Button
            onClick={pasteFromClipboard}
            data-testid="paste-from-clipboard"
            className="ml-0"
          >
            paste from clipboard
          </Button>
          <Button
            onClick={cleanup}
            data-testid="clean"
          >
            clean
          </Button>
          <Button
            onClick={cleanWhiteSpaces}
            data-testid="clean-spaces"
          >
            clean spaces
          </Button>
          <Button
            onClick={cleanNewLines}
            data-testid="clean-new-lines"
          >
            clean new lines
          </Button>
          <Button
            onClick={cleanNewLinesAndSpaces}
            data-testid="clean-new-lines-and-spaces"
          >
            clean new lines and spaces
          </Button>
        </div>
        <div className="w-3/6 flex justify-between">
          <InputText
            data-testid="space-size"
            value={spacing}
            onChange={eventValue => updateSpacing(eventValue)}
          />
          <Button
            data-testid="copy-json"
            onClick={writeToClipboard}
          >
            copy json
          </Button>
        </div>
      </div>
      <div className="flex h-5/6">
        <div className="w-3/6 flex flex-col h-full m-1">
          <Label data-testid="label-json">place your json here</Label>
          <JsonEditor
            input={originalJson}
            onChange={eventValue => onJsonChange(eventValue.value)}
            data-testid="json"
          />
        </div>
        <div className="w-3/6 flex flex-col h-full m-1">
          <Label data-testid="label-result">result</Label>
          <JsonEditor
            input={result}
            className="result"
            data-testid="result"
          />
        </div>
      </div>
      <div className="bg-red-600 m-1 text-center text-white">
        {error && <p data-testid="error">{error}</p>}
      </div>
    </div>
  );
}

export default App;
