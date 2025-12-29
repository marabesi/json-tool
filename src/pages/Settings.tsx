import { useState } from 'react';
import Button from '../components/ui/io/Button';
import { Option, Properties } from '../types/components/Editor';
import { useSettingsContext } from '../settings/SettingsContext';

export function Settings() {
  const { editorOptions: options, handleEditorOptionsChanged: handleChange, handleFeatureOptionsChanged, featureOptions } = useSettingsContext();
  const [prop, setProp] = useState<Properties>({ key: 'fontSize', value: options.properties[0].value });

  const [allEditorOptions, setAllOptionsForEditor] = useState<Option[]>(options.options);
  const [allFeatureOptions, setAllOptionsForFeatures] = useState<Option[]>(featureOptions.options);

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

  const onSaveFeatureOption = (selectedOption: Option) => {
    setAllOptionsForFeatures(
      allFeatureOptions.map((option: Option) => {
        if (selectedOption.title === option.title) {
          option.active = !option.active;
        }
        return option;
      })
    );
    handleFeatureOptionsChanged({ options: allFeatureOptions });
  };

  return (
    <div className="p-8">
      <h1 className="text-xl m-2 ml-0">Settings</h1>
      <div className="flex mr-2">
        <div>
          <h2 className="font-bold">Editor</h2>
          {
            allEditorOptions.map((option: Option, index: number) =>
              <div key={index} className="m-2">
                <label className="flex items-center justify-between cursor-pointer">
                  {option.title}
                  <input 
                    type="checkbox" 
                    checked={option.active} 
                    onChange={() => onSaveEditorOption(option)}
                    className="focus:ring-2 focus:ring-yellow-400"
                    aria-label={`Toggle ${option.title}`}
                  />
                </label>
              </div>
            )
          }
          <input 
            data-testid="font-size" 
            type="text" 
            value={prop.value} 
            onChange={(event) => setProp({ key: 'fontSize', value: event.target.value })}
            className="focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded p-1"
            aria-label="Font size"
          />
        </div>

        <div className="ml-5">
          <h2 className="font-bold">Features</h2>
          {
            allFeatureOptions.map((option: Option, index: number) =>
              <div key={index} className="m-2">
                <label className="flex items-center justify-between cursor-pointer">
                  {option.title}
                  <input 
                    className="ml-2 focus:ring-2 focus:ring-yellow-400" 
                    type="checkbox" 
                    data-testid="json-history-setting" 
                    checked={option.active} 
                    onChange={() => onSaveFeatureOption(option)}
                    aria-label={`Toggle ${option.title}`}
                  />
                </label>
              </div>
            )
          }
        </div>
      </div>

      <Button onClick={persistChanges}>Save</Button>
    </div>
  );
}
