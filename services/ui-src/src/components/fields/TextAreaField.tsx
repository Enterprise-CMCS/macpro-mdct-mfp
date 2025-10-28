// components
import { TextField } from "components";

export const TextAreaField = ({
  name,
  label,
  placeholder,
  rows = 3,
  maxLength,
  ...props
}: Props) => {
  return (
    <TextField
      name={name}
      label={label}
      placeholder={placeholder}
      multiline
      rows={rows}
      maxLength={maxLength}
      {...props}
    />
  );
};

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  clear?: boolean;
  maxLength?: number;
  [key: string]: any;
}
