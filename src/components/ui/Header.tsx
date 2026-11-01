import { ReactNode, useCallback, useState } from 'react';
import { FaRegSun, FaRegLightbulb, FaHistory, FaTable, FaProjectDiagram, FaExchangeAlt, FaKeyboard } from 'react-icons/fa';
import { NavLink, LinkProps, useLocation, useNavigate } from 'react-router';
import Switch from 'react-switch';
import fullConfig from '../../tailwindResolver';
import { usePersistenceContext } from '../../PersistenceContext';
import { useThemeContext } from '../../DarkModeContext';
import { useSettingsContext } from '../../settings/SettingsContext';
import { useDrawerContext } from '../../DrawerContext';
import { useShortcut } from '../../ShortcutsContext';
import { focusResultEditor, focusWorkingEditor } from '../../core/editorFocus';
import KeyboardShortcuts from './KeyboardShortcuts';

type TabProps = LinkProps & { children: ReactNode };

function TabWrapper({ children, ...props }: TabProps) {
  const { className, to, ...rest } = props;
  return (
    <NavLink
      to={to}
      className={({ isActive }) => {
        return [
          className,
          'p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-inset',
          isActive ? 'bg-blue-400 dark:bg-gray-600' : '',
        ].join(' ');
      }}
      {...rest}
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  const { isValidateEnabled, setValidateEnabled, isScrollSyncEnabled, setScrollSyncEnabled } = usePersistenceContext();
  const { onDarkThemeChanged, darkModeEnabled  } = useThemeContext();
  const { isHistoryEnabled } = useSettingsContext();
  const { isOpen, toggle } = useDrawerContext();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasWorkingEditor = ['/', '/table', '/schema', '/diff'].includes(location.pathname);
  const hasResultEditor = ['/', '/diff'].includes(location.pathname);

  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);
  const toggleShortcuts = useCallback(() => setShortcutsOpen((open) => !open), []);

  useShortcut({
    id: 'view-home',
    keys: ['Alt+1', 'Alt+Home'],
    description: 'Go to the home view',
    section: 'Views',
    handler: () => {
      closeShortcuts();
      navigate('/');
    },
  });

  useShortcut({
    id: 'view-table',
    keys: ['Alt+2'],
    description: 'Go to the table view',
    section: 'Views',
    handler: () => {
      closeShortcuts();
      navigate('/table');
    },
  });

  useShortcut({
    id: 'view-shape',
    keys: ['Alt+3'],
    description: 'Go to the shape view',
    section: 'Views',
    handler: () => {
      closeShortcuts();
      navigate('/schema');
    },
  });

  useShortcut({
    id: 'view-diff',
    keys: ['Alt+4'],
    description: 'Go to the diff view',
    section: 'Views',
    handler: () => {
      closeShortcuts();
      navigate('/diff');
    },
  });

  useShortcut({
    id: 'view-settings',
    keys: ['Alt+5', 'Alt+S'],
    description: 'Go to the settings view',
    section: 'Views',
    handler: () => {
      closeShortcuts();
      navigate('/settings');
    },
  });

  useShortcut({
    id: 'history-drawer',
    keys: ['Alt+H'],
    description: 'Open or close the history drawer',
    section: 'Header',
    enabled: isHistoryEnabled,
    handler: toggle,
  });

  useShortcut({
    id: 'documentation',
    keys: ['Alt+D', 'Alt+Shift+D'],
    description: 'Open the documentation',
    section: 'Header',
    handler: () => window.open('./docs/', '_blank', 'noopener,noreferrer'),
  });

  useShortcut({
    id: 'shortcut-help',
    keys: ['?'],
    description: 'Open or close this shortcut list',
    section: 'Header',
    ignoreWhileTyping: true,
    handler: toggleShortcuts,
  });

  useShortcut({
    id: 'validate-json',
    keys: ['Alt+J'],
    description: 'Toggle JSON validation',
    section: 'Header',
    handler: () => setValidateEnabled(!isValidateEnabled),
  });

  useShortcut({
    id: 'sync-scroll',
    keys: ['Alt+Y'],
    description: 'Toggle sync scroll',
    section: 'Header',
    handler: () => setScrollSyncEnabled(!isScrollSyncEnabled),
  });

  useShortcut({
    id: 'dark-mode',
    keys: ['Alt+M'],
    description: 'Toggle dark mode',
    section: 'Header',
    handler: () => onDarkThemeChanged(!darkModeEnabled),
  });

  useShortcut({
    id: 'focus-working-editor',
    keys: ['Alt+Shift+W'],
    description: 'Focus the working editor',
    section: 'Editors',
    enabled: hasWorkingEditor,
    handler: focusWorkingEditor,
  });

  useShortcut({
    id: 'focus-result-editor',
    keys: ['Alt+Shift+R'],
    description: 'Focus the result or compare editor',
    section: 'Editors',
    enabled: hasResultEditor,
    handler: focusResultEditor,
  });

  return (
    <>
      <div className="bg-blue-900 flex justify-between dark:bg-gray-700">
        <div className="h-14 flex items-center">
          <nav aria-label="Views" className="flex items-center">
            <TabWrapper to="/" data-testid="to-home" title="Home (Alt+1 or Alt+Home)" aria-label="Home" aria-keyshortcuts="Alt+1 Alt+Home" className="flex">
              <h2 className="text-yellow-400 font-bold">
                  JSON tool
              </h2>|by marabesi
            </TabWrapper>
            <TabWrapper
              data-testid="table"
              to="/table"
              title="Show JSON as a table (Alt+2)"
              aria-label="Table view"
              aria-keyshortcuts="Alt+2"
            >
              <FaTable />
            </TabWrapper>
            <TabWrapper
              data-testid="schema"
              to="/schema"
              title="Show JSON shape and property statistics (Alt+3)"
              aria-label="JSON shape view"
              aria-keyshortcuts="Alt+3"
            >
              <FaProjectDiagram />
            </TabWrapper>
            <TabWrapper
              data-testid="diff"
              to="/diff"
              title="Compare two JSON documents (Alt+4)"
              aria-label="Diff view"
              aria-keyshortcuts="Alt+4"
            >
              <FaExchangeAlt />
            </TabWrapper>
            <TabWrapper
              data-testid="settings"
              to="/settings"
              title="JSON tool settings (Alt+5 or Alt+S)"
              aria-label="Settings"
              aria-keyshortcuts="Alt+5 Alt+S"
            >
              <FaRegSun />
            </TabWrapper>
          </nav>
          <button
            type="button"
            data-testid="keyboard-shortcuts-open"
            onClick={toggleShortcuts}
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
            aria-keyshortcuts="?"
            aria-haspopup="dialog"
            aria-expanded={shortcutsOpen}
            aria-controls="keyboard-shortcuts-dialog"
            className="flex items-center gap-2 p-5 hover:bg-blue-800 dark:hover:bg-gray-800"
          >
            <FaKeyboard />
          </button>
          <a
            data-testid="docs"
            href="./docs/"
            target="_blank"
            rel="noreferrer"
            title="Open the JSON tool documentation (Alt+D or Alt+Shift+D)"
            aria-label="Documentation"
            aria-keyshortcuts="Alt+D Alt+Shift+D"
            className="flex items-center gap-2 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-inset"
          >
            <FaRegLightbulb />
            <span>Docs</span>
          </a>
        </div>

        <div className="flex items-center">
          {isHistoryEnabled &&
            <button
              type="button"
              data-testid="json-drawer-history-button"
              className="mr-5 rounded p-1 hover:bg-blue-800 dark:hover:bg-gray-800"
              onClick={toggle}
              title="Open history (Alt+H)"
              aria-label="Open history"
              aria-keyshortcuts="Alt+H"
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls="dialog-right"
            >
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
              aria-keyshortcuts="Alt+J"
              title="Validate JSON (Alt+J)"
              className="mr-1 cursor-pointer"
            />
            <label htmlFor="is-validate-json" className="cursor-pointer">validate json</label>
          </div>

          <div className="mr-5">
            <input
              type="checkbox"
              id="is-sync-scroll"
              onChange={() => setScrollSyncEnabled(!isScrollSyncEnabled)}
              data-testid="is-sync-scroll"
              checked={isScrollSyncEnabled}
              aria-keyshortcuts="Alt+Y"
              title="Sync scroll (Alt+Y)"
              className="mr-1 cursor-pointer"
            />
            <label htmlFor="is-sync-scroll" className="cursor-pointer">sync scroll</label>
          </div>

          <Switch
            onChange={onDarkThemeChanged}
            checked={darkModeEnabled}
            data-testid="dark-mode"
            aria-label="Dark mode"
            aria-keyshortcuts="Alt+M"
            title="Dark mode (Alt+M)"
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
      {shortcutsOpen && <KeyboardShortcuts onClose={closeShortcuts} />}
    </>
  );
}
