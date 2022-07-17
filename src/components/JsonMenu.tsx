import Button from "./Button";

export default function JsonMenu({pasteFromClipboard, cleanup}: any) {
    return (
        <div className="flex w-full justify-start items-center">
            <div className="w-3/6">
                <Button
                    onClick={pasteFromClipboard}
                    data-testid="paste-from-clipboard"
                    className="ml-0"
                >
                    paste from clipboard
                </Button>
                <Button
                    onClick={cleanup}
                    data-testid="clean"
                >
                    clean
                </Button>
            </div>
        </div>
    );
}
