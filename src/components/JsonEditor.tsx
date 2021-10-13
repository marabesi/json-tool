import CodeEditor from '@uiw/react-textarea-code-editor';

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
  const handleChange = (editor: any, data: any, value: any) => {
    if (onChange) {
      onChange({ value })
      return;
    }
  }

  return (
    <CodeEditor
      value={input}
      language="json"
      placeholder="Please enter JS code."
      onChange={(evn) => handleChange(null, null, evn.target.value)}
      padding={15}
      style={{
        fontSize: 12,
        backgroundColor: "#f5f5f5",
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}
    />
  );
  // return (
  //   <textarea
  //     className={[className, 'h-full'].join(' ')}
  //     onChange={eventValue => handleChange(null, null,  eventValue.target.value)}
  //     value={input}
  //     {...rest}
  //   />
  // );

  // return (
  //   <CodeMirror
  //     value={input}
  //     options={{
  //       mode: 'application/json',
  //       lineNumbers: false,
  //       theme: 'material',
  //     }}
  //     onBeforeChange={handleChange}
  //     onChange={handleChange}
  //     className={className}
  //     {...rest}
  //   />
  // );
}
