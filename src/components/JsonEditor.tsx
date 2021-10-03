type Event = {
  value: string;
};

type EventChange = (event: Event) => void;

interface Props{
  input: string;
  className?: string;
  onChange?: EventChange;
}

export default function JsonEditor({ input, onChange, className, ...rest }: Props) {
  return (
    <textarea
      className={[className, 'h-full'].join(' ')}
      onChange={eventValue => onChange ? onChange({ value: eventValue.target.value }) : null}
      value={input}
      {...rest}
    />
  )
}
