import { useCallback, useEffect, useState } from 'react';
import JsonEditor from './components/JsonEditor';
import CleanUp from './core/cleanUp';
import Formatter from './core/formatter';
import ResultMenu from "./components/ResultMenu";
import JsonMenu from "./components/JsonMenu";
import {FaCoffee} from "react-icons/fa";

const cleanUp = new CleanUp();

function Header() {
  return <div className="bg-blue-900 flex justify-between p-5 text-white">
    <div className="flex">
      <h2 className="text-yellow-400 font-bold">JSON tool</h2> |
      <a href="https://github.com/marabesi/json-tool" target="_blank" rel="noreferrer">by marabesi</a>
    </div>
    <a className="flex items-center" data-testid="buy-me-a-coffee" href="https://www.buymeacoffee.com/marabesi" target="_blank" rel="noreferrer">
      <FaCoffee className="mr-2"/>
      <span>Buy me a coffee</span>
    </a>
  </div>;
}

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
      <div className="bg-gray-500 flex flex-col h-screen">
        <Header />
        <div className="p-1 h-full">
          <div className="flex h-5/6">
            <EditorContainer>
              <JsonMenu
                  pasteFromClipboard={pasteFromClipboard}
                  cleanup={cleanup}
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
          <div className="bg-red-600 m-1 text-center text-white">
            {error && <p data-testid="error">{error}</p>}
          </div>
        </div>
        <div className="flex bg-gray-300 text-white p-5">
          <a href="https://github.com/marabesi/json-tool/blob/main/LICENSE.md" target="_blank" rel="noreferrer">
            CC0 1.0 Universal
          </a>
        </div>
      </div>
  );
}

export default App;

function EditorContainer({ children }: any) {
  return (
      <div className="w-3/6 flex flex-col h-full m-1">
        {children}
      </div>
  );
}
