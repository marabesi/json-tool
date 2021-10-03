import { useState } from 'react'
import JsonEditor from './components/JsonEditor'
import Label from './components/Label';
import Formatter from './core/formatter'

function App() {
  const [originalJson, setOriginalResult] = useState('');
  const [result, setResult] = useState('');

  const onJsonChange = async (value: string) => {
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
          />
        </div>
      </div>
    </div>
  );
}

export default App;
