import { ReactNode } from 'react';

interface Props {
  children?: ReactNode
  style?: any
}

export default function EditorContainer({ children, style }: Props) {
  return (
    <div className="flex flex-col h-full m-1" style={ style? style: { width: '49vw' }}>
      {children}
    </div>
  );
}
