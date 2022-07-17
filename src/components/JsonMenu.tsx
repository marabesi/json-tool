import Button from "./Button";
import {FaRegClipboard, FaRegTrashAlt} from "react-icons/fa";

export default function JsonMenu({pasteFromClipboard, cleanup}: any) {
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
