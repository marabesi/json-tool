import { createContext, ReactElement, useContext } from 'react';
import { usePersistenceContext } from './PersistenceContext';
import CleanUp from './core/cleanUp';

const cleanUp = new CleanUp();

interface ToolbarContextInterface {
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
  const { jsonState, setResultState, onChange, spacing, setSpacing } = usePersistenceContext();

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