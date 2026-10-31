import { BaseSyntheticEvent, useRef } from 'react';
import { FaRegClipboard, FaRegFileArchive, FaRegTrashAlt, FaSearch } from 'react-icons/fa';
import Button from '../io/Button';
import { useToolbarContext } from '../../../ToolbarContext';
import { usePersistenceContext } from '../../../PersistenceContext';
import { useClipboardContext } from '../../../ClipboardContext';

interface Props {
  onLoadedFile: (content: string | ArrayBuffer | null) => void;
  onSearch: () => void;
  onPaste?: (content: string) => void;
  onDelete?: () => void;
  label?: string;
  testIdPrefix?: string;
}

export default function JsonMenu({ onLoadedFile, onSearch, onPaste, onDelete, label, testIdPrefix } : Props) {
  const { deleteJson } = useToolbarContext();
  const { pasteFromClipboard: pasteFromContext, isClipboardAvailable } = useClipboardContext();
  const { onChange, spacing } = usePersistenceContext();

  const fileContent  = useRef<HTMLInputElement>(null);
  const testId = (name: string) => testIdPrefix === undefined ? name : `${testIdPrefix}-${name}`;

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
    const content = await pasteFromContext();

    if (onPaste) {
      onPaste(content);
      return;
    }

    onChange(content, spacing, true);
  }

  return (
    <div className="flex flex-wrap w-full justify-start items-center m-2 ml-0 min-h-10 gap-y-1 gap-x-2" data-testid={testId('json-menu')}>
      {label !== undefined && (
        <span className="mr-1 text-sm font-semibold" data-testid={testId('json-menu-label')}>{label}</span>
      )}
      <Button data-testid={testId('search-json')} onClick={onSearch} title="Search in the json">
        <FaSearch />
      </Button>
      <Button
        onClick={pasteFromClipboard}
        data-testid={testId('paste-from-clipboard')}
        className="ml-0 flex items-center"
        disabled={!isClipboardAvailable()}
        title={isClipboardAvailable() ? 'Paste from clipboard' : 'Paste from clipboard is disabled due lack of browser support'}
      >
        <FaRegClipboard />
      </Button>
      <label
        className="bg-transparent border-0 cursor-pointer p-1 outline-none text-sm hover:bg-blue-800 dark:hover:bg-gray-800 flex items-center"
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
          className="sr-only"
        />
      </label>
      <Button
        onClick={() => {
          if (fileContent.current) {
            fileContent.current.value = '';
          }

          if (onDelete) {
            onDelete();
            return;
          }

          deleteJson();
        }}
        data-testid={testId('clean')}
        className="flex items-center"
        title="Delete all"
      >
        <FaRegTrashAlt />
      </Button>
    </div>
  );
}
