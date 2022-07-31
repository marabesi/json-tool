import CodeMirror, { BasicSetupOptions } from '@uiw/react-codemirror';
import fullConfig from '../../tailwindResolver';
import { json } from '@codemirror/lang-json';
import { Properties, SettingsContext } from '../../App';
import { Option } from '../../pages/Settings';
import { CSSProperties } from 'react';

type Event = {
  value: string;
};

type EventChange = (event: Event) => void;

interface Props{
  input: string;
  className?: string;
  onChange?: EventChange;
  'data-testid': string;
  contenteditable: boolean;
}

export default function JsonEditor({ input, onChange, className, ...rest }: Props) {
  const handleChange = (value: string) => {
    if (onChange) {
      onChange({ value });
      return;
    }
  };

  return (
    <SettingsContext.Consumer>
      {
        settings => {
          const basicSetup: BasicSetupOptions = {};
          settings.options.forEach((item : Option) => basicSetup[item.title as keyof BasicSetupOptions] = item.active);

          const style: CSSProperties = {
            backgroundColor: fullConfig.theme.backgroundColor.gray['200'],
            overflowY: 'hidden',
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          };

          // @ts-ignore
          settings.properties.forEach((item : Properties) => style[item.key] = item.value);

          return (
            <>
              <textarea data-testid={`raw-${rest['data-testid']}`} className="hidden" defaultValue={input}></textarea>
              <CodeMirror
                value={input}
                onChange={handleChange}
                className={[className, 'h-full'].join(' ')}
                style={style}
                height="100%"
                extensions={[json()]}
                basicSetup={basicSetup}
                {...rest}
              />
            </>
          );
        }
      }
    </SettingsContext.Consumer>
  );
}
