import { DetailedHTMLProps, ReactNode } from 'react';
import Button from '@mui/material/Button';

type ButtonProps = {
  onClick?: DetailedHTMLProps<any, any>
  children?: ReactNode
  className?: string
}

export default function CustomButton({ children, className, onClick, ...rest }: ButtonProps) {
  // @ts-ignore
  const dataTestid = rest['data-testid'];
  return(
      <Button
        variant="contained"
        className={['', className].join(' ')}
        onClick={onClick}
        data-testid={dataTestid}
      >
        {children}
      </Button>
  );
}
