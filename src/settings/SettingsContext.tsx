import { createContext, ReactElement, useContext, useState } from 'react';
import { EditorOptions } from 'src/types/components/Editor';
import {
  editorOptions as defaultOptions,
  FeatureOptions,
  featureOptionsDefault
} from 'src/components/ui/editor/default-options';

interface SettingContext {
  editorOptions: EditorOptions;
  featureOptions: FeatureOptions;
  handleEditorOptionsChanged: (changed: EditorOptions) => void;
  handleFeatureOptionsChanged: (changed: FeatureOptions) => void;
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
  const [editorOptions, setEditorOptions] = useState<EditorOptions>(defaultOptions);
  const [featureOptions, setFeatureOptions] = useState<FeatureOptions>(featureOptionsDefault);

  const handleEditorOptionsChanged = (changed: EditorOptions) => {
    editorOptions.properties = changed.properties;
    editorOptions.options = changed.options;
    setEditorOptions(editorOptions);
  };

  const handleFeatureOptionsChanged = (changed: FeatureOptions) => {
    setFeatureOptions(changed);
  };

  return (
    <SettingsContext.Provider value={{
      editorOptions,
      featureOptions,
      handleEditorOptionsChanged,
      handleFeatureOptionsChanged,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
