import Button from "../io/Button";
import { useFileUpload } from 'use-file-upload';
import {FaRegClipboard, FaRegFileArchive, FaRegTrashAlt} from "react-icons/fa";

interface Props {
    pasteFromClipboard: any;
    cleanup: any;
    onLoadedFile: any;
}

export default function JsonMenu({pasteFromClipboard, cleanup, onLoadedFile} : Props) {
    // eslint-disable-next-line no-unused-vars
    const [_, selectFile] = useFileUpload();

    return (
        <div className="flex w-full justify-start items-center m-2 ml-0 text-white">
            <Button
                onClick={pasteFromClipboard}
                data-testid="paste-from-clipboard"
                className="ml-0 flex items-center"
            >
                <FaRegClipboard className="mr-2" />
                Paste from clipboard
            </Button>
            <button
                className="ml-0 flex items-center"
                onClick={() => {
                selectFile({accept: ['application/json', 'text/plain'], multiple: false}, ({ file }: any) => {
                    const reader = new FileReader();
                    reader.readAsText(file, "UTF-8");
                    reader.onload = (evt) => {
                        if (evt.target) {
                            onLoadedFile(evt.target.result);
                        }
                    };
                });
            }}
            >
                <FaRegFileArchive className="mr-2" />
                Click to Upload
            </button>
            <Button
                onClick={cleanup}
                data-testid="clean"
                className="flex items-center"
            >
                <FaRegTrashAlt className="mr-2" />
                Delete all
            </Button>
        </div>
    );
}
