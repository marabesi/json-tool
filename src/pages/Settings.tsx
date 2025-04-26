import { useState } from 'react';
import Button from '../components/ui/io/Button';
import { Option, Properties } from '../types/components/Editor';
import { useSettingsContext } from 'src/settings/SettingsContext';

export function Settings() {
  const { editorOptions: options, handleEditorOptionsChanged: handleChange } = useSettingsContext();
  const [prop, setProp] = useState<Properties>({ key: 'fontSize', value: options.properties[0].value });
  const [ops, setOps] = useState<Option[]>(options.options);

  const persistChanges = () => {
    handleChange({
      options: ops,
      properties: [prop],
    });
  };

  const onSaveOs = (option: Option) => {
    setOps(
      ops.map((op: Option) => {
        if (op.title === option.title) {
          op.active = !option.active;
        }
        return op;
      })
    );
  };

  return (
    <div>
      <h1 className="text-xl m-2">Settings</h1>
      <div className="flex mr-2">
        <div>
          <h2>Editor</h2>
          {
            ops.map((option: Option, index: number) =>
              <div key={index} className="m-2">
                <label>
                  {option.title}
                  <input type="checkbox" checked={option.active} onChange={() => onSaveOs(option)} />
                </label>
              </div>
            )
          }
          <input data-testid="font-size" type="text" value={prop.value} onChange={(event) => setProp({ key: 'fontSize', value: event.target.value })}/>
        </div>
      </div>

      <Button onClick={persistChanges}>Save</Button>
    </div>
  );
}
