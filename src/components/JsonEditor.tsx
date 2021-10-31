import CodeEditor from '@uiw/react-textarea-code-editor';

import fullConfig from '../tailwindResolver';

type Event = {
  value: string;
};

type EventChange = (event: Event) => void;

interface Props{
  input: string;
  className?: string;
  onChange?: EventChange;
}

export default function JsonEditor({ input, onChange, className, ...rest }: Props) {
  const handleChange = (value: string) => {
    if (onChange) {
      onChange({ value });
      return;
    }
  };

  return (
    <CodeEditor
      value={input}
      language="json"
      placeholder=""
      className={[className, 'h-full'].join(' ')}
      onChange={(evn) => handleChange(evn.target.value)}
      padding={15}
      style={{
        fontSize: 12,
        backgroundColor: fullConfig.theme.backgroundColor.gray['200'],
        overflowY: 'scroll',
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}
      {...rest}
    />
  );
}
