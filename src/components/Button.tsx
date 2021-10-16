import { DetailedHTMLProps, ReactNode } from 'react';

type ButtonProps = {
  onClick?: DetailedHTMLProps<any, any>
  children?: ReactNode
}

export default function Button({ children, ...rest }: ButtonProps) {
  return(
    <button
      {...rest}
    >
      {children}
    </button>
  );
}
