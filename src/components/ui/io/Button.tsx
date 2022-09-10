import { DetailedHTMLProps, ReactNode } from 'react';

type ButtonProps = {
  onClick?: DetailedHTMLProps<any, any>
  children?: ReactNode
  className?: string
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return(
    <button
      className={['bg-transparent border-0 cursor-pointer p-2 outline-none hover:bg-gray-800', className].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
