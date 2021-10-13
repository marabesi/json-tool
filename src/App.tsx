import { useState } from 'react'
import JsonEditor from './components/JsonEditor'
import Label from './components/Label';
import Formatter from './core/formatter'

function App() {
  const [originalJson, setOriginalResult] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onJsonChange = async (value: string) => {
    setError('');

    try {
      JSON.parse(value);
    } catch (e: any) {
      setError('invalid json');
    }

    const format = new Formatter(value);
    const result = await format.format();

    setOriginalResult(value);
    setResult(result);
  }

  return (
    <div className="h-screen bg-gray-500 p-5">
      <div className="flex h-3/6">
        <div className="w-3/6 flex flex-col h-full m-1">
          <Label>place your json here</Label>
          <JsonEditor
            input={originalJson}
            onChange={eventValue => onJsonChange(eventValue.value)}
            data-testid="json"
            className="original"
          />
        </div>
        <div className="w-3/6 flex flex-col h-full m-1">
          <Label>result</Label>
          <JsonEditor
            input={result}
            className="result"
            data-testid="result"
          />
        </div>
      </div>
      <div>
        {error && <p data-testid="error">{error}</p>}
      </div>
    </div>
  );
}

export default App;
