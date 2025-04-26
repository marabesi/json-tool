import { useState } from 'react';
import Button from '../components/ui/io/Button';
import { Option, Properties } from '../types/components/Editor';
import { useSettingsContext } from 'src/settings/SettingsContext';

export function Settings() {
  const { editorOptions: options, handleEditorOptionsChanged: handleChange } = useSettingsContext();
  const [prop, setProp] = useState<Properties>({ key: 'fontSize', value: options.properties[0].value });
  const [allEditorOptions, setAllOptionsForEditor] = useState<Option[]>(options.options);

  const persistChanges = () => {
    handleChange({
      options: allEditorOptions,
      properties: [prop],
    });
  };

  const onSaveEditorOption = (selectedOption: Option) => {
    setAllOptionsForEditor(
      allEditorOptions.map((option: Option) => {
        if (selectedOption.title === option.title) {
          option.active = !option.active;
        }
        return option;
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
            allEditorOptions.map((option: Option, index: number) =>
              <div key={index} className="m-2">
                <label>
                  {option.title}
                  <input type="checkbox" checked={option.active} onChange={() => onSaveEditorOption(option)} />
                </label>
              </div>
            )
          }
          <input data-testid="font-size" type="text" value={prop.value} onChange={(event) => setProp({ key: 'fontSize', value: event.target.value })}/>
        </div>

        <div>
          <h2>Features</h2>
          <div>
            <label>
              JSON History
              <input data-testid="json-history" type="checkbox" />
            </label>
          </div>
        </div>
      </div>

      <Button onClick={persistChanges}>Save</Button>
    </div>
  );
}
