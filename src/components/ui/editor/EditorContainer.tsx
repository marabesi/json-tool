import { CSSProperties, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
  'data-fullscreen'?: boolean;
}

export default function EditorContainer({ children, className = '', style, ...rest }: Props) {
  return (
    <div className={['flex flex-col h-full m-1 min-w-0 overflow-hidden', className].join(' ')} style={style} {...rest}>
      {children}
    </div>
  );
}
