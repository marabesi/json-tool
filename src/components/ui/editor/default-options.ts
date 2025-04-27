import { EditorOptions, Option, Properties } from '../../../types/components/Editor';

export interface FeatureOptions {
  options: Option[];
}

export const defaultOp: Option[] = [
  { title: 'foldGutter', active: true },
  { title: 'syntaxHighlighting', active : true },
  { title: 'highlightActiveLine', active: true },
  { title: 'historyKeymap', active: true },
  { title: 'history', active: true },
  { title: 'autocompletion', active: false } ,
  { title: 'closeBrackets', active: false },
];

export const properties: Properties = {
  key: 'fontSize',
  value: '12px'
};

export const editorOptions = (): EditorOptions => ({
  options: defaultOp,
  properties: [properties],
});

export const featureOptionsDefault = (): FeatureOptions => ({ options: [ { title: 'JSON History', active: false } ] });