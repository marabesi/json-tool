import {ReactNode} from "react";

interface Props {
    children?: ReactNode
}

export default function EditorContainer({ children }: Props) {
    return (
        <div className="w-full flex flex-col h-full m-1">
            {children}
        </div>
    );
}