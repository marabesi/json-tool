import { DetailedHTMLProps, ReactNode } from 'react';

type ButtonProps = {
  onClick?: DetailedHTMLProps<any, any>
  children?: ReactNode
  className?: string
  title?: string
  disabled?: boolean
}

export default function Button({ children, className, onClick, disabled, ...rest }: ButtonProps) {
  return(
    <button
      className={['bg-transparent border-0 cursor-pointer p-2 outline-none', disabled ? 'cursor-not-allowed': 'hover:bg-blue-800 dark:hover:bg-gray-800', className].join(' ')}
      disabled={disabled}
      onClick={onClick ? onClick : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
