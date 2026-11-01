import { Fragment, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getFocusableElements } from '../../core/keyboard';
import { useShortcuts } from '../../ShortcutsContext';

const generalShortcuts = [
  { keys: 'Tab', description: 'Move to the next control, including out of the JSON editors' },
  { keys: 'Shift + Tab', description: 'Move to the previous control' },
  { keys: 'Enter or Space', description: 'Activate the focused control' },
  { keys: 'Esc', description: 'Close a dialog or exit the table full screen' },
  { keys: 'Left / Right arrow', description: 'Resize the editors when the divider is focused' },
  { keys: 'Home / End', description: 'Minimum or maximum editor width when the divider is focused' },
];

interface Props {
  onClose: () => void;
}

function displayKeys(keys: string[]): string {
  return keys.map((key) => key.replace(/\bMod\b/gi, 'Ctrl/⌘')).join(' or ');
}

export default function KeyboardShortcuts({ onClose }: Props) {
  const dialogReference = useRef<HTMLDivElement>(null);
  const closeReference = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const { shortcuts } = useShortcuts();

  useEffect(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeReference.current?.focus();

    return () => previousFocus.current?.focus();
  }, []);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = getFocusableElements(dialogReference.current);

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const sections = shortcuts.reduce<Record<string, typeof shortcuts>>((groups, shortcut) => {
    if (groups[shortcut.section] === undefined) {
      groups[shortcut.section] = [];
    }

    groups[shortcut.section].push(shortcut);
    return groups;
  }, {});

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      data-testid="keyboard-shortcuts-backdrop"
      onClick={onClose}
    >
      <div
        ref={dialogReference}
        id="keyboard-shortcuts-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
        data-testid="keyboard-shortcuts"
        className="max-h-full w-full max-w-2xl overflow-auto rounded bg-blue-400 p-5 text-gray-100 shadow-xl dark:bg-gray-600 dark:text-gray-400"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="keyboard-shortcuts-title" className="text-lg font-semibold">
            Keyboard shortcuts
          </h2>
          <button
            ref={closeReference}
            type="button"
            data-testid="keyboard-shortcuts-close"
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close keyboard shortcuts"
            className="rounded p-1 hover:bg-blue-800 dark:hover:bg-gray-800"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">General</h3>
            <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
              {generalShortcuts.map(({ keys, description }) => (
                <Fragment key={keys}>
                  <dt>
                    <kbd className="rounded bg-blue-900 px-2 py-1 font-mono text-xs text-white dark:bg-gray-800">{keys}</kbd>
                  </dt>
                  <dd>{description}</dd>
                </Fragment>
              ))}
            </dl>
          </section>

          {Object.entries(sections).map(([section, sectionShortcuts]) => (
            <section key={section}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">{section}</h3>
              <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
                {sectionShortcuts.map((shortcut) => (
                  <Fragment key={shortcut.id}>
                    <dt>
                      <kbd className="rounded bg-blue-900 px-2 py-1 font-mono text-xs text-white dark:bg-gray-800">
                        {displayKeys(shortcut.keys)}
                      </kbd>
                    </dt>
                    <dd>{shortcut.description}</dd>
                  </Fragment>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <p className="mt-4 text-xs">Press ? again or Esc to close this list.</p>
      </div>
    </div>
  );
}
