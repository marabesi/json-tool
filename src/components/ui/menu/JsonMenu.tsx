import Button from "../io/Button";
import { useFileUpload } from 'use-file-upload';
import {FaRegClipboard, FaRegFileArchive, FaRegTrashAlt} from "react-icons/fa";

interface Props {
    pasteFromClipboard: any;
    cleanup: any;
    onLoadedFile: any;
}

export default function JsonMenu({pasteFromClipboard, cleanup, onLoadedFile} : Props) {
    const [file, selectFile] = useFileUpload();

    return (
        <div className="flex w-full justify-start items-center m-2 ml-0">
            <Button
                onClick={pasteFromClipboard}
                data-testid="paste-from-clipboard"
                className="ml-0 flex items-center"
            >
                <FaRegClipboard className="mr-2" />
                Paste from clipboard
            </Button>
            <Button
                className="ml-0 flex items-center"
                onClick={() => {
                selectFile({accept: ['application/json', 'text/plain'], multiple: false}, () => {
                    const reader = new FileReader();
                    reader.readAsText(file as any, "UTF-8");
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
            </Button>
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
