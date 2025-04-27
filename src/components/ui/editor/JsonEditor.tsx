import { CSSProperties, ForwardedRef, forwardRef } from 'react';
import CodeMirror, { BasicSetupOptions, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { duotoneLight } from '@uiw/codemirror-theme-duotone';
import { json } from '@codemirror/lang-json';
import fullConfig from '../../../tailwindResolver';
import { Option, Properties } from '../../../types/components/Editor';
import { useSettingsContext } from '../../../settings/SettingsContext';
import { useThemeContext } from '../../../DarkModeContext';

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
  const { darkModeEnabled } = useThemeContext();
  const { editorOptions } = useSettingsContext();

  const handleChange = (value: string) => {
    if (onChange) {
      onChange({ value });
      return;
    }
  };

  const basicSetup: BasicSetupOptions = {};
  if (editorOptions.options) {
    // @ts-ignore
    editorOptions.options.forEach((item: Option) => basicSetup[item.title as keyof BasicSetupOptions] = item.active);
  }

  const style: CSSProperties = {
    backgroundColor: fullConfig.theme.backgroundColor.gray['200'],
    overflowY: 'hidden',
    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
  };

  if (editorOptions.properties) {
    // @ts-ignore
    editorOptions.properties.forEach((item: Properties) => style[item.key] = item.value);
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
        width="48vw"
        height="100%"
        extensions={[json()]}
        theme={darkModeEnabled ? 'dark' : duotoneLight}
        basicSetup={basicSetup}
        {...rest}
      />
    </>
  );
});
