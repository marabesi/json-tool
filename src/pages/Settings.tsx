import DefaultLayout from '../components/ui/layout/Default';

export interface Option {
  title: string;
  active: boolean;
}

interface Props {
  handleChange: (event: Option) => void;
  options: Option[];
}

export function Settings({ handleChange, options }: Props) {
  return (
    <DefaultLayout>
      <h1 className="text-xl m-2">Settings</h1>
      <div>
        {
          options.map((option: Option, index: number) =>
            <div key={index} className="m-2">
              <label>
                {option.title}
                <input type="checkbox" checked={option.active} onChange={() => handleChange(option)} />
              </label>
            </div>
          )
        }
      </div>
    </DefaultLayout>
  );
}
