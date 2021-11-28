import { DetailedHTMLProps, ReactNode } from 'react';

type ButtonProps = {
  onClick?: DetailedHTMLProps<any, any>
  children?: ReactNode
  className?: string
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return(
    <button
      className={['bg-white p-2 m-2', className].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
