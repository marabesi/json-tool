import { BaseSyntheticEvent, DetailedHTMLProps, useRef } from 'react';
import Button from '../io/Button';
import { FaRegClipboard, FaRegFileArchive, FaRegTrashAlt, FaSearch } from 'react-icons/fa';

interface Props {
  pasteFromClipboard: DetailedHTMLProps<any, any>;
  cleanup: DetailedHTMLProps<any, any>;
  onLoadedFile: DetailedHTMLProps<any, any>;
  onSearch: DetailedHTMLProps<any, any>;
}

export default function JsonMenu({ pasteFromClipboard, cleanup, onLoadedFile, onSearch } : Props) {
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

  return (
    <div className="flex w-full justify-start items-center m-2 ml-0 h-10">
      <Button data-testid="search-json" onClick={onSearch}>
        <FaSearch className="mr-2" />
      </Button>
      <Button
        onClick={pasteFromClipboard}
        data-testid="paste-from-clipboard"
        className="ml-0 flex items-center"
        disabled={!pasteFromClipboard}
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
          cleanup();
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
