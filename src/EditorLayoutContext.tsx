import { createContext, ReactElement, useContext, useState } from 'react';

interface EditorLayoutContextInterface {
  leftWidth: number;
  setLeftWidth: (width: number) => void;
}

const EditorLayoutContext = createContext<EditorLayoutContextInterface | undefined>(undefined);

export const useEditorLayoutContext = () => {
  const context = useContext(EditorLayoutContext);
  if (context === undefined) {
    throw new Error('useEditorLayoutContext must be used within a EditorLayoutContextProvider');
  }
  return context;
};

export const EditorLayoutContextProvider = ({ children }: { children: ReactElement }) => {
  const [leftWidth, setLeftWidth] = useState(50);

  return (
    <EditorLayoutContext.Provider value={{ leftWidth, setLeftWidth }}>
      {children}
    </EditorLayoutContext.Provider>
  );
};
