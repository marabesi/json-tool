import { ReactNode } from 'react';

interface Props {
  children?: ReactNode,
  'data-testid'?: string
}

export default function Label({ children, 'data-testid': testId }: Props) {
  return (
    <label
      className="text-white"
      data-testid={testId}
    >
      {children}
    </label>
  );
}