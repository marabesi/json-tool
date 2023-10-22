import CodeMirror, { BasicSetupOptions, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import fullConfig from '../../../tailwindResolver';
import { json } from '@codemirror/lang-json';
import { SettingsContext, ThemeContext } from '../../../App';
import { CSSProperties, ForwardedRef, forwardRef, useContext } from 'react';
import { Option, Properties } from '../../../types/components/Editor';
import { duotoneLight } from '@uiw/codemirror-theme-duotone';

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

export default forwardRef(function JsonEditor(props: Props, ref: ForwardedRef<ReactCodeMirrorRef>) {
  const { input, onChange, className, ...rest } = props;
  const theme = useContext(ThemeContext);
  const settings = useContext(SettingsContext);

  const handleChange = (value: string) => {
    if (onChange) {
      onChange({ value });
      return;
    }
  };

  const basicSetup: BasicSetupOptions = {};
  if (settings.options) {
    // @ts-ignore
    settings.options.forEach((item: Option) => basicSetup[item.title as keyof BasicSetupOptions] = item.active);
  }

  const style: CSSProperties = {
    backgroundColor: fullConfig.theme.backgroundColor.gray['200'],
    overflowY: 'hidden',
    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
  };

  if (settings.properties) {
    // @ts-ignore
    settings.properties.forEach((item: Properties) => style[item.key] = item.value);
  }

  return (
    <>
      <textarea data-testid={`raw-${rest['data-testid']}`} className="hidden" defaultValue={input}></textarea>
      <CodeMirror
        ref={ref}
        value={input}
        onChange={handleChange}
        className={[className, 'h-full'].join(' ')}
        style={style}
        height="100%"
        extensions={[json()]}
        theme={theme.darkMode ? 'dark' : duotoneLight}
        basicSetup={basicSetup}
        {...rest}
      />
    </>
  );
});
