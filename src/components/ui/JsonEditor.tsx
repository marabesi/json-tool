import CodeMirror from '@uiw/react-codemirror';
import fullConfig from '../../tailwindResolver';
import { json } from '@codemirror/lang-json';

type Event = {
  value: string;
};

type EventChange = (event: Event) => void;

interface Props{
  input: string;
  className?: string;
  onChange?: EventChange;
  'data-testid': string;
}

export default function JsonEditor({ input, onChange, className, ...rest }: Props) {
  const handleChange = (value: string) => {
    if (onChange) {
      onChange({ value });
      return;
    }
  };

  return (
    <>
      <textarea data-testid={`raw-${rest['data-testid']}`} className="hidden" defaultValue={input}></textarea>
      <CodeMirror
        value={input}
        onChange={handleChange}
        className={[className, 'h-full'].join(' ')}
        style={{
          fontSize: 12,
          backgroundColor: fullConfig.theme.backgroundColor.gray['200'],
          overflowY: 'scroll',
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
        height="100%"
        extensions={[json()]}
        basicSetup={{
          foldGutter: true,
          syntaxHighlighting: true,
          history: false,
          highlightActiveLine: false,
          autocompletion: false,
          closeBrackets: false,
        }}
        {...rest}
      />
    </>
  );
}
