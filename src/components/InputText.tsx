type InputTextProps = {
  onChange?: (value: string) => void;
  value?: string
}

export default function inputText({ value, onChange, ...rest }: InputTextProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={eventValue => onChange ? onChange(eventValue.target.value) : null}
      {...rest}
    />
  );
}
