import { ReactNode } from 'react';

interface Props {
  pageTestId?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function EditorPage({ pageTestId, footer, children }: Props) {
  return (
    <div className="p-1 pt-0 mb-8 pb-8 flex flex-col h-full" style={{ height: '80vh' }}>
      <div className="flex flex-1 min-h-0" data-testid={pageTestId}>
        {children}
      </div>
      {footer}
    </div>
  );
}
