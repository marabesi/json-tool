type InputTextProps = {
  onChange?: (value: string) => void;
  value?: string
  className?: string
}

export default function inputText({ value, onChange, className, ...rest }: InputTextProps) {
  const classes = [className, 'p-1 bg-blue-300 dark:bg-gray-500', ''].join(' ').trim();
  return (
    <input
      type="text"
      value={value}
      className={classes}
      onChange={eventValue => onChange ? onChange(eventValue.target.value) : null}
      {...rest}
    />
  );
}
