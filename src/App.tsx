import { useState } from 'react';
import Button from './components/Button';
import JsonEditor from './components/JsonEditor';
import Label from './components/Label';
import Formatter from './core/formatter';

function App() {
  const [originalJson, setOriginalResult] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onJsonChange = async (value: string) => {
    setError('');

    try {
      if (value) {
        JSON.parse(value);
      }
    } catch (e: any) {
      setError('invalid json');
    }

    const format = new Formatter(value);
    const result = await format.format();

    setOriginalResult(value);
    setResult(result);
  };

  const pasteFromClipboard = async () => {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        await onJsonChange(await blob.text());
      }
    }
  };

  const cleanup = async () => {
    await onJsonChange('');
  };

  const writeToClipboard = async () => {
    await navigator.clipboard.writeText(result);
  };

  return (
    <div className="h-screen bg-gray-500 p-5">
      <div className="flex w-full justify-start items-center">
        <div className="w-3/6">
          <Button
            onClick={pasteFromClipboard}
            data-testid="paste-from-clipboard"
            className="m-5 ml-0"
          >
            paste from clipboard
          </Button>
          <Button
            onClick={cleanup}
            data-testid="clean"
          >
            clean
          </Button>
        </div>
        <div className="w-3/6">
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
