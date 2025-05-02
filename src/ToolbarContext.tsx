import { createContext, ReactElement, useContext } from 'react';
import toast from 'react-hot-toast';
import { usePersistenceContext } from './PersistenceContext';
import CleanUp from './core/cleanUp';

const cleanUp = new CleanUp();

interface ToolbarContextInterface {
  pasteFromClipboard: () => Promise<string>;
  writeToClipboard: () => Promise<void>;
  isClipboardAvailable: () => boolean;
  deleteJson: () => void;
  cleanWhiteSpaces: () => void;
  cleanNewLines: () => void;
  cleanNewLinesAndSpaces: () => void;
  updateSpacing: (newSpacing: string) => void;

}

const ToolbarContext = createContext<ToolbarContextInterface | undefined>(undefined);

export const useToolbarContext = () => {
  const context = useContext(ToolbarContext);
  if (context === undefined) {
    throw new Error('useDrawerContext must be used within a ToolbarContextProvider');
  }
  return context;
};

export const ToolbarContextProvider = ({ children }: { children: ReactElement }) => {
  const { jsonState, resultState, setResultState, onChange, spacing, setSpacing } = usePersistenceContext();

  const isClipboardAvailable = () => navigator.clipboard && typeof navigator.clipboard.read === 'function';

  const writeToClipboard = async () => {
    await navigator.clipboard.writeText(resultState);
    toast.success('Copied');
  };

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

    return result;
  };

  const deleteJson = () => onChange('', spacing);

  const cleanWhiteSpaces = () => {
    const withoutSpaces = cleanUp.cleanWhiteSpaces(jsonState);
    setResultState(withoutSpaces);
  };

  const cleanNewLines = () => {
    const withoutNewLines = cleanUp.cleanNewLines(jsonState);
    setResultState(withoutNewLines);
  };

  const cleanNewLinesAndSpaces = () => {
    const withoutSpacesAndNewLines = cleanUp.cleanWhiteSpacesAndNewLines(jsonState);
    setResultState(withoutSpacesAndNewLines);
  };

  const updateSpacing = (newSpacing: string) => {
    setSpacing(newSpacing);
    onChange(jsonState, newSpacing);
  };

  return (
    <ToolbarContext.Provider value={{
      isClipboardAvailable,
      writeToClipboard,
      pasteFromClipboard,
      deleteJson,
      cleanWhiteSpaces,
      cleanNewLines,
      cleanNewLinesAndSpaces,
      updateSpacing,
    }}>
      {children}
    </ToolbarContext.Provider>
  );
};