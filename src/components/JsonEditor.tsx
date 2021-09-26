type Event = {
  value: string;
};

type EventChange = (event: Event) => void;

interface Props{
  input: string;
  onChange?: EventChange;
}

export default function JsonEditor({ input, onChange, ...rest }: Props) {
  return (
    <textarea
      onChange={eventValue => onChange ? onChange({ value: eventValue.target.value }) : null}
      value={input}
      {...rest}
    />
  )
}