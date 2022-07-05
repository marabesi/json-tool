import TextField from '@mui/material/TextField';
type InputTextProps = {
  onChange?: (value: string) => void;
  value?: string
  className?: string
}

export default function inputText({ value, onChange, className, ...rest }: InputTextProps) {
  const classes = [className, ''].join(' ').trim();
  // @ts-ignore
  const dataTestid = rest['data-testid'];
  return (
      <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          value={value}
          className={classes}
          onChange={eventValue => onChange ? onChange(eventValue.target.value) : null}
          data-testid={dataTestid}
      />
  );
}
