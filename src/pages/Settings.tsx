import DefaultLayout from '../components/ui/layout/Default';
import { EditorOptions, Properties } from '../App';
import { useState } from 'react';
import Button from '../components/ui/io/Button';

export interface Option {
  title: string;
  active: boolean;
}

interface Props {
  handleChange: (event?: Option, properties?: Properties) => void;
  options: EditorOptions;
}

export function Settings({ handleChange, options }: Props) {
  const [prop, setProp] = useState<string>(options.properties[0].value);

  const onChangeInput = () => {
    handleChange(undefined, { key: 'fontSize', value: prop });
  };

  return (
    <DefaultLayout>
      <h1 className="text-xl m-2">Settings</h1>
      <div>
        {
          options.options.map((option: Option, index: number) =>
            <div key={index} className="m-2">
              <label>
                {option.title}
                <input type="checkbox" checked={option.active} onChange={() => handleChange(option, undefined)} />
              </label>
            </div>
          )
        }
        <input data-testid="font-size" type="text" value={prop} onChange={(event) => setProp(event.target.value)}/>
      </div>
      <Button onClick={onChangeInput}>Save</Button>
    </DefaultLayout>
  );
}
