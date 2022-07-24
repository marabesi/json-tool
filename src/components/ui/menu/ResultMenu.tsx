import InputText from "../io/InputText";
import Button from "../io/Button";
import {FaBackspace, FaRegCopy, FaTerminal, FaUserFriends} from "react-icons/fa";

export default function ResultMenu(
    { spacing, updateSpacing, writeToClipboard, cleanWhiteSpaces, cleanNewLines, cleanNewLinesAndSpaces } : any
) {
    return (
        <div className="flex justify-start items-center m-2 ml-0 text-white">
            <div className="flex items-center">
                <span className="mr-2">Space tabulation</span>
                <InputText
                    data-testid="space-size"
                    className="w-10 rounded mr-2"
                    value={spacing}
                    onChange={eventValue => updateSpacing(eventValue)}
                />
            </div>
            <Button
                onClick={cleanWhiteSpaces}
                data-testid="clean-spaces"
                className="flex items-center"
            >
                <FaBackspace className="mr-2" />
                Clean spaces
            </Button>
            <Button
                onClick={cleanNewLines}
                data-testid="clean-new-lines"
                className="flex items-center"
            >
                <FaTerminal className="mr-2" />
                Clean new lines
            </Button>
            <Button
                onClick={cleanNewLinesAndSpaces}
                data-testid="clean-new-lines-and-spaces"
                className="flex items-center"
            >
                <FaUserFriends className="mr-2" />
                Clean new lines and spaces
            </Button>

            <Button
                data-testid="copy-json"
                onClick={writeToClipboard}
                className="flex items-center"
            >
                <FaRegCopy className="mr-2" />
                Copy json
            </Button>
        </div>
    );
}
