import { ReactNode, useEffect } from 'react';
import { FaRegSun, FaRegLightbulb, FaHistory } from 'react-icons/fa';
import { NavLink, LinkProps, useNavigate } from 'react-router';
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
        return [className, 'p-5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-inset', isActive ? 'bg-blue-400 dark:bg-gray-600' : ''].join(' ');
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
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt+H to toggle history drawer
      if (event.altKey && event.key.toLowerCase() === 'h' && isHistoryEnabled) {
        event.preventDefault();
        toggle();
      }
      // Alt+S to go to settings
      if (event.altKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        navigate('/settings');
      }
      // Alt+D to go to docs
      if (event.altKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        navigate('/docs');
      }
      // Alt+Home to go to home
      if (event.altKey && event.key === 'Home') {
        event.preventDefault();
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHistoryEnabled, toggle, navigate]);

  return (
    <div className="bg-blue-900 flex justify-between dark:bg-gray-700">
      <div className="h-14 flex items-center">
        <TabWrapper to="/" data-testid="to-home" className="flex">
          <h2 className="text-yellow-400 font-bold">
              JSON tool
          </h2>|by marabesi
        </TabWrapper>
        <TabWrapper  data-testid="docs" to="/docs" title="JSON tool documentation (Alt+D)">
          <FaRegLightbulb />
        </TabWrapper>
        <TabWrapper  data-testid="settings" to="/settings" title="JSON tool settings (Alt+S)">
          <FaRegSun />
        </TabWrapper>
      </div>

      <div className="flex items-center">
        {isHistoryEnabled &&
          <button data-testid="json-drawer-history-button" className="mr-5 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded p-1" onClick={toggle} title="Open history drawer (Alt+H)" aria-label="Open history drawer">
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
            className="mr-1 cursor-pointer focus:ring-2 focus:ring-yellow-400"
            aria-label="Toggle JSON validation"
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
