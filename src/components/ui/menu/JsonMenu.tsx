import { BaseSyntheticEvent, DetailedHTMLProps, useRef } from 'react';
import { FaRegClipboard, FaRegFileArchive, FaRegTrashAlt, FaSearch } from 'react-icons/fa';
import Button from '../io/Button';
import { useToolbarContext } from '../../../ToolbarContext';
import { usePersistenceContext } from '../../../PersistenceContext';
import { useClipboardContext } from '../../../ClipboardContext';

interface Props {
  onLoadedFile: DetailedHTMLProps<any, any>;
  onSearch: DetailedHTMLProps<any, any>;
}

export default function JsonMenu({ onLoadedFile, onSearch } : Props) {
  const { deleteJson } = useToolbarContext();
  const { pasteFromClipboard: pasteFromContext, isClipboardAvailable } = useClipboardContext();
  const { onChange, spacing } = usePersistenceContext();

  const fileContent  = useRef(null);

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
    onChange(await pasteFromContext(), spacing, true);
  }

  return (
    <div className="flex w-full justify-start items-center m-2 ml-0 h-10">
      <Button data-testid="search-json" onClick={onSearch}>
        <FaSearch className="mr-2" />
      </Button>
      <Button
        onClick={pasteFromClipboard}
        data-testid="paste-from-clipboard"
        className="ml-0 flex items-center"
        disabled={!isClipboardAvailable()}
        title="Paste from clipboard is disabled due lack of browser support"
      >
        <FaRegClipboard className="mr-2" />
        Paste from clipboard
      </Button>
      <Button className="ml-0 flex items-center">
        <FaRegFileArchive className="mr-2" />
        <input type="file" ref={fileContent} accept="application/json" onChange={onFileUploaded} data-testid="upload-json" />
      </Button>
      <Button
        onClick={() => {
          if (fileContent.current) {
            // @ts-ignore at the  time of this code, there were no options to reset without accessing the ref
            fileContent.current.value = '';
          }
          deleteJson();
        }}
        data-testid="clean"
        className="flex items-center"
      >
        <FaRegTrashAlt className="mr-2" />
        Delete all
      </Button>
    </div>
  );
}
