import { createContext, ReactElement, useContext, useState } from 'react';
import { EditorOptions, LayoutOption } from '../types/components/Editor';
import {
  editorOptions as defaultOptions,
  FeatureOptions,
} from '../default-options';
import { defaultLayout, featureOptionsDefault } from '../default-features';

interface SettingContext {
  editorOptions: EditorOptions;
  featureOptions: FeatureOptions;
  handleEditorOptionsChanged: (changed: EditorOptions) => void;
  handleFeatureOptionsChanged: (changed: FeatureOptions) => void;
  isHistoryEnabled: boolean;
  layout: LayoutOption;
  handleLayoutChanged: (layout: LayoutOption) => void;
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
  const [editorOptions, setEditorOptions] = useState<EditorOptions>(defaultOptions());
  const [featureOptions, setFeatureOptions] = useState<FeatureOptions>(featureOptionsDefault());
  const [layout, setLayout] = useState<LayoutOption>(defaultLayout());

  const handleEditorOptionsChanged = (changed: EditorOptions) => {
    editorOptions.properties = changed.properties;
    editorOptions.options = changed.options;
    setEditorOptions(editorOptions);
  };

  const handleFeatureOptionsChanged = (changed: FeatureOptions) => {
    setFeatureOptions(changed);
  };

  const handleLayoutChanged = (newLayout: LayoutOption) => {
    setLayout(newLayout);
  };

  const isHistoryEnabled = featureOptions.options.find(item => item.title === 'JSON History' && item.active) !== undefined;

  return (
    <SettingsContext.Provider value={{
      editorOptions,
      featureOptions,
      handleEditorOptionsChanged,
      handleFeatureOptionsChanged,
      isHistoryEnabled,
      layout,
      handleLayoutChanged,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
