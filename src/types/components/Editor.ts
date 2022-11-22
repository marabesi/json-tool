export interface Option {
  title: string;
  active: boolean;
}

export interface Properties {
  key: string;
  value: string;
}

export interface EditorOptions {
  options: Option[]
  properties: Properties[]
}

