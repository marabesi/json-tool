import { createContext, ReactElement, useContext, useState } from 'react';
import { EditorOptions } from 'src/types/components/Editor';
import { editorOptions as defaultOptions } from 'src/components/ui/editor/default-options';

interface SettingContext {
  editorOptions: EditorOptions;
  handleEditorOptionsChanged: (changed: EditorOptions) => void;
}

const SettingsContext = createContext<SettingContext | undefined>(undefined);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsContextProvider');
  }
  return context;
};

export const SettingsContextProvider = ({ children }: { children: ReactElement }) => {
  const [editorOptions, setEditorOptions] = useState<any>(defaultOptions);

  const handleChange = (changed: EditorOptions) => {
    editorOptions.properties = changed.properties;
    editorOptions.options = changed.options;
    setEditorOptions(editorOptions);
  };

  return (
    <SettingsContext.Provider value={{
      editorOptions: editorOptions,
      handleEditorOptionsChanged: handleChange
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;