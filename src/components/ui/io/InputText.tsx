import { ForwardedRef, forwardRef } from 'react';

type InputTextProps = {
  onChange?: (value: string) => void;
  value?: string
  className?: string
  title?: string
  id?: string
  'data-testid'?: string
  'aria-label'?: string
}

const InputText = forwardRef(function InputTextComponent(
  { value, onChange, className, ...rest }: InputTextProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const classes = [className, 'p-1 bg-blue-300 dark:bg-gray-500', ''].join(' ').trim();

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      className={classes}
      onChange={eventValue => onChange ? onChange(eventValue.target.value) : null}
      {...rest}
    />
  );
});

export default InputText;
