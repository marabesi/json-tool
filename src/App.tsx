import { useState } from 'react'
import JsonEditor from './components/JsonEditor'
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
    <div className="h-screen bg-gray-500">
      <div className="flex">
        <div className="w-3/6 flex flex-col h-full">
          <label>place your json here</label>
          <JsonEditor
            input={originalJson}
            onChange={eventValue => onJsonChange(eventValue.value)}
            data-testid="json"
          />
        </div>
        <div className="w-3/6 flex flex-col min-h-full">
          <label>result</label>
          <JsonEditor
            input={result}
            data-testid="result"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
