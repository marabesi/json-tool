import { FaCoffee, FaRegSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Switch from 'react-switch';
import fullConfig from '../../tailwindResolver';

interface Props {
  onDarkModeChanged: (checked: boolean) => void;
  darkModeEnabled: boolean
}

export default function Header({ onDarkModeChanged, darkModeEnabled, ...props }: Props) {
  return (
    <div className="bg-blue-900 flex justify-between p-5 dark:bg-gray-700" {...props}>
      <div className="flex">
        <h2 className="text-yellow-400 font-bold">
          <Link to="/" data-testid="to-home">JSON tool</Link>
        </h2> |
        <a href="https://github.com/marabesi/json-tool" target="_blank" rel="noreferrer">by marabesi</a>
        <a href="https://github.com/marabesi/json-tool/discussions/72" target="_blank" rel="noreferrer" className="ml-14">What feature are you missing?</a>
      </div>
      <div className="flex items-center">
        <Switch
          onChange={onDarkModeChanged}
          checked={darkModeEnabled}
          data-testid="dark-mode"
          className="mr-5"
          height={18}
          width={50}
          onColor={fullConfig.theme.backgroundColor.blue['900']}
          offColor={fullConfig.theme.backgroundColor.gray['700']}
          checkedIcon={false}
          uncheckedIcon={false}
        />
        <Link className="flex items-center mr-5" data-testid="settings" to="/settings">
          <FaRegSun />
        </Link>
        <a className="flex items-center" data-testid="buy-me-a-coffee" href="https://www.buymeacoffee.com/marabesi" target="_blank" rel="noreferrer">
          <FaCoffee className="mr-2"/>
          <span>Buy me a coffee</span>
        </a>
      </div>
    </div>
  );
}
