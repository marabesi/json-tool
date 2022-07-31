import DefaultLayout from '../components/ui/layout/Default';
import { EditorOptions, Properties } from '../App';

export interface Option {
  title: string;
  active: boolean;
}

interface Props {
  handleChange: (event?: Option, properties?: Properties) => void;
  options: EditorOptions;
}

export function Settings({ handleChange, options }: Props) {
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
        <input data-testid="font-size" type="number" value="12" />
      </div>
    </DefaultLayout>
  );
}
