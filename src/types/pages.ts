import { EditorOptions } from './components/Editor';

export interface EditorsPageProps {
  currentJson: string
  onPersist: (json: string) => void
}

export interface SettingsPageProps {
  handleChange: (editorOptions: EditorOptions) => void;
  options: EditorOptions;
}
