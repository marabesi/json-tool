import { BaseSyntheticEvent, useRef } from 'react';
import { FaRegClipboard, FaRegFileArchive, FaRegTrashAlt, FaSearch } from 'react-icons/fa';
import Button from '../io/Button';
import { useToolbarContext } from '../../../ToolbarContext';
import { usePersistenceContext } from '../../../PersistenceContext';
import { useClipboardContext } from '../../../ClipboardContext';
import { useShortcut } from '../../../ShortcutsContext';

interface Props {
  onLoadedFile: (content: string | ArrayBuffer | null) => void;
  onSearch: () => void;
  onPaste?: (content: string) => void;
  onDelete?: () => void;
  label?: string;
  testIdPrefix?: string;
  shortcutPrefix?: 'Alt' | 'Alt+Shift';
  shortcutSection?: string;
  searchShortcuts?: string[];
}

export default function JsonMenu({
  onLoadedFile,
  onSearch,
  onPaste,
  onDelete,
  label,
  testIdPrefix,
  shortcutPrefix = 'Alt',
  shortcutSection,
  searchShortcuts = ['Mod+F'],
}: Props) {
  const { deleteJson } = useToolbarContext();
  const { pasteFromClipboard: pasteFromContext, isClipboardAvailable } = useClipboardContext();
  const { onChange, spacing } = usePersistenceContext();

  const fileContent  = useRef<HTMLInputElement>(null);
  const testId = (name: string) => testIdPrefix === undefined ? name : `${testIdPrefix}-${name}`;
  const shortcutId = (name: string) => `${testIdPrefix ?? 'input'}-${name}`;
  const section = shortcutSection ?? (label === undefined ? 'Working editor' : `${label} editor`);

  function onFileUploaded(event: BaseSyntheticEvent) {
    const [fileAt] = event.target.files as File[];
    if (fileAt) {
      const reader = new FileReader();
      reader.readAsText(fileAt, 'UTF-8');
      reader.onload = (evt) => {
        if (evt.target) {
          onLoadedFile(evt.target.result);
        }
      };
    }
  }

  async function pasteFromClipboard() {
    if (!isClipboardAvailable()) {
      return;
    }

    const content = await pasteFromContext();

    if (onPaste) {
      onPaste(content);
      return;
    }

    onChange(content, spacing, true);
  }

  function deleteAll() {
    if (fileContent.current) {
      fileContent.current.value = '';
    }

    if (onDelete) {
      onDelete();
      return;
    }

    deleteJson();
  }

  function openFilePicker() {
    fileContent.current?.click();
  }

  useShortcut({
    id: shortcutId('search'),
    keys: searchShortcuts,
    description: 'Search in the editor',
    section,
    handler: onSearch,
  });

  useShortcut({
    id: shortcutId('paste'),
    keys: [`${shortcutPrefix}+V`],
    description: 'Paste from the clipboard',
    section,
    handler: () => {
      void pasteFromClipboard();
    },
  });

  useShortcut({
    id: shortcutId('upload'),
    keys: [`${shortcutPrefix}+O`],
    description: 'Upload a JSON file',
    section,
    handler: openFilePicker,
  });

  useShortcut({
    id: shortcutId('delete'),
    keys: [`${shortcutPrefix}+Delete`],
    description: 'Delete all',
    section,
    handler: deleteAll,
  });

  return (
    <div className="flex flex-wrap w-full justify-start items-center m-2 ml-0 min-h-10 gap-y-1 gap-x-2" data-testid={testId('json-menu')}>
      {label !== undefined && (
        <span className="mr-1 text-sm font-semibold" data-testid={testId('json-menu-label')}>{label}</span>
      )}
      <Button data-testid={testId('search-json')} onClick={onSearch} title="Search in the json" aria-label="Search in the json">
        <FaSearch />
      </Button>
      <Button
        onClick={pasteFromClipboard}
        data-testid={testId('paste-from-clipboard')}
        className="ml-0 flex items-center"
        disabled={!isClipboardAvailable()}
        title={isClipboardAvailable() ? 'Paste from clipboard' : 'Paste from clipboard is disabled due lack of browser support'}
        aria-label="Paste from clipboard"
      >
        <FaRegClipboard />
      </Button>
      <label
        className="bg-transparent border-0 cursor-pointer p-1 text-sm hover:bg-blue-800 dark:hover:bg-gray-800 flex items-center focus-within:ring-2 focus-within:ring-yellow-400"
        title="Upload a json file"
        data-testid={testId('upload-json-button')}
      >
        <FaRegFileArchive />
        <input
          type="file"
          ref={fileContent}
          accept="application/json"
          onChange={onFileUploaded}
          data-testid={testId('upload-json')}
          aria-label="Upload JSON file"
          className="sr-only"
        />
      </label>
      <Button
        onClick={deleteAll}
        data-testid={testId('clean')}
        className="flex items-center"
        title="Delete all"
        aria-label="Delete all"
      >
        <FaRegTrashAlt />
      </Button>
    </div>
  );
}
