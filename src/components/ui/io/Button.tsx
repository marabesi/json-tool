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
      className={['bg-transparent border-0 cursor-pointer p-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2', disabled ? 'cursor-not-allowed': 'hover:bg-blue-800 dark:hover:bg-gray-800', className].join(' ')}
      disabled={disabled}
      onClick={onClick ? onClick : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
