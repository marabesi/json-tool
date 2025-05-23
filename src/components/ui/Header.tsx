import { ReactNode } from 'react';
import { FaRegSun, FaRegLightbulb, FaHistory } from 'react-icons/fa';
import { NavLink, LinkProps } from 'react-router';
import Switch from 'react-switch';
import fullConfig from '../../tailwindResolver';
import { usePersistenceContext } from '../../PersistenceContext';
import { useThemeContext } from '../../DarkModeContext';
import { useSettingsContext } from '../../settings/SettingsContext';
import { useDrawerContext } from '../../DrawerContext';

type TabProps = LinkProps & { children: ReactNode };

function TabWrapper({ children, ...props }: TabProps) {
  const { className, to, ...rest } = props;
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        return [className, 'p-5', isActive ? 'bg-blue-400 dark:bg-gray-600' : ''].join(' ');
      }}
      {...rest}
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  const { isValidateEnabled, setValidateEnabled } = usePersistenceContext();
  const { onDarkThemeChanged, darkModeEnabled  } = useThemeContext();
  const { isHistoryEnabled } = useSettingsContext();
  const{ toggle } = useDrawerContext();

  return (
    <div className="bg-blue-900 flex justify-between dark:bg-gray-700">
      <div className="h-14 flex items-center">
        <TabWrapper to="/" data-testid="to-home" className="flex">
          <h2 className="text-yellow-400 font-bold">
              JSON tool
          </h2>|by marabesi
        </TabWrapper>
        <TabWrapper  data-testid="docs" to="/docs" title="JSON tool documentation">
          <FaRegLightbulb />
        </TabWrapper>
        <TabWrapper  data-testid="settings" to="/settings" title="JSON tool settings">
          <FaRegSun />
        </TabWrapper>
      </div>

      <div className="flex items-center">
        {isHistoryEnabled &&
          <button data-testid="json-drawer-history-button" className="mr-5" onClick={toggle}>
            <FaHistory />
          </button>
        }
        
        <div className="mr-5">
          <input
            type="checkbox"
            id="is-validate-json"
            onChange={() => setValidateEnabled(!isValidateEnabled)}
            data-testid="is-validate-json"
            checked={isValidateEnabled}
            className="mr-1 cursor-pointer"
          />
          <label htmlFor="is-validate-json" className="cursor-pointer">validate json</label>
        </div>
        
        <Switch
          onChange={onDarkThemeChanged}
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
      </div>
    </div>
  );
}
