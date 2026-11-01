import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { isEditableTarget } from './core/keyboard';

export interface ShortcutDefinition {
  id: string;
  keys: string[];
  description: string;
  section: string;
  handler: () => void;
  ignoreWhileTyping?: boolean;
}

export interface UseShortcutOptions extends Omit<ShortcutDefinition, 'handler'> {
  handler: () => void;
  enabled?: boolean;
}

interface ShortcutsContextInterface {
  shortcuts: ShortcutDefinition[];
  register: (shortcut: ShortcutDefinition) => () => void;
}

const ShortcutsContext = createContext<ShortcutsContextInterface | undefined>(undefined);

const modifiers = ['alt', 'option', 'shift', 'ctrl', 'cmd', 'meta', 'mod'];

const symbolCodes: Record<string, string> = {
  '[': 'bracketleft',
  ']': 'bracketright',
  '\\': 'backslash',
  ';': 'semicolon',
  '\'': 'quote',
  ',': 'comma',
  '.': 'period',
  '/': 'slash',
  '`': 'backquote',
  '-': 'minus',
  '=': 'equal',
};

export function shortcutMatches(keys: string, event: KeyboardEvent): boolean {
  const parts = keys.toLowerCase().split('+').map((part) => part.trim()).filter(Boolean);
  const key = parts.filter((part) => !modifiers.includes(part)).join('+');

  if (key === '') {
    return false;
  }

  const wantsAlt = parts.includes('alt') || parts.includes('option');
  const wantsShift = parts.includes('shift');
  const wantsCtrl = parts.includes('ctrl');
  const wantsMeta = parts.includes('cmd') || parts.includes('meta');
  const wantsMod = parts.includes('mod');
  const shiftIsPartOfKey = key === '?';

  if (event.altKey !== wantsAlt || (!shiftIsPartOfKey && event.shiftKey !== wantsShift)) {
    return false;
  }

  if (wantsMod) {
    if (!event.ctrlKey && !event.metaKey) {
      return false;
    }
  } else if (event.ctrlKey !== wantsCtrl || event.metaKey !== wantsMeta) {
    return false;
  }

  const eventKey = event.key.toLowerCase();
  const eventCode = event.code.toLowerCase();

  return eventKey === key
    || eventCode === key
    || eventCode === `key${key}`
    || eventCode === `digit${key}`
    || eventCode === `numpad${key}`
    || eventCode === symbolCodes[key];
}

export const useShortcuts = () => {
  const context = useContext(ShortcutsContext);

  if (context === undefined) {
    throw new Error('useShortcuts must be used within a ShortcutsContextProvider');
  }

  return context;
};

export const useShortcut = ({
  id,
  keys,
  description,
  section,
  handler,
  ignoreWhileTyping,
  enabled = true,
}: UseShortcutOptions) => {
  const { register } = useShortcuts();
  const handlerReference = useRef(handler);
  const keysSignature = keys.join('|');

  useLayoutEffect(() => {
    handlerReference.current = handler;
  }, [handler]);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    return register({
      id,
      keys: keysSignature.split('|'),
      description,
      section,
      ignoreWhileTyping,
      handler: () => handlerReference.current(),
    });
  }, [register, id, keysSignature, description, section, ignoreWhileTyping, enabled]);
};

export const ShortcutsContextProvider = ({ children }: { children: ReactElement }) => {
  const [shortcuts, setShortcuts] = useState<ShortcutDefinition[]>([]);
  const shortcutsReference = useRef<Map<string, ShortcutDefinition>>(new Map());

  const register = useCallback((shortcut: ShortcutDefinition) => {
    shortcutsReference.current.set(shortcut.id, shortcut);
    setShortcuts(Array.from(shortcutsReference.current.values()));

    return () => {
      if (shortcutsReference.current.get(shortcut.id) === shortcut) {
        shortcutsReference.current.delete(shortcut.id);
        setShortcuts(Array.from(shortcutsReference.current.values()));
      }
    };
  }, []);

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.repeat) {
        return;
      }

      for (const shortcut of Array.from(shortcutsReference.current.values())) {
        const matches = shortcut.keys.some((keys) => shortcutMatches(keys, event));

        if (!matches) {
          continue;
        }

        if (shortcut.ignoreWhileTyping && isEditableTarget(event.target)) {
          continue;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        shortcut.handler();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ShortcutsContext.Provider value={{ shortcuts, register }}>
      {children}
    </ShortcutsContext.Provider>
  );
};
