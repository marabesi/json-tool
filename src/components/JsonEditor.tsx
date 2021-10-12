// import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

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
    <textarea
      className={[className, 'h-full'].join(' ')}
      onChange={eventValue => handleChange(null, null,  eventValue.target.value)}
      value={input}
      {...rest}
    />
  );

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
