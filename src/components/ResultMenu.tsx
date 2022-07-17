import InputText from "./InputText";
import Button from "./Button";

export default function ResultMenu(
    { spacing, updateSpacing, writeToClipboard, cleanWhiteSpaces, cleanNewLines, cleanNewLinesAndSpaces } : any
) {
    return (
        <div className="flex justify-between">
            <InputText
                data-testid="space-size"
                value={spacing}
                onChange={eventValue => updateSpacing(eventValue)}
            />
            <Button
                onClick={cleanWhiteSpaces}
                data-testid="clean-spaces"
            >
                clean spaces
            </Button>
            <Button
                onClick={cleanNewLines}
                data-testid="clean-new-lines"
            >
                clean new lines
            </Button>
            <Button
                onClick={cleanNewLinesAndSpaces}
                data-testid="clean-new-lines-and-spaces"
            >
                clean new lines and spaces
            </Button>

            <Button
                data-testid="copy-json"
                onClick={writeToClipboard}
            >
                copy json
            </Button>
        </div>
    );
}
