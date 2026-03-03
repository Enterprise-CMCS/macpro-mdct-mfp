import {
  ReactNode,
  FocusEventHandler,
  ChangeEventHandler,
  HTMLInputAutoCompleteAttribute,
  AriaAttributes,
} from "react";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box, Heading, SystemStyleObject } from "@chakra-ui/react";
import { CharacterCounter } from "components";

export const TextFieldDisplay = ({
  ariaLabelledby,
  autoComplete,
  disabled = false,
  errorMessage,
  hint,
  heading,
  id,
  label,
  maxLength,
  multiline = false,
  name,
  onChange,
  onBlur,
  nested = false,
  placeholder,
  rows,
  sxOverride,
  value,
}: Props) => {
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";
  const ariaProps: AriaAttributes = {
    "aria-labelledby": ariaLabelledby,
  };

  if (maxLength) {
    ariaProps["aria-describedby"] = `${name}-counter`;
  }

  return (
    <Box sx={sxOverride} className={`${nestedChildClasses} ${labelClass}`}>
      {/* SAR field sections */}
      {heading && <Heading sx={sx.fieldHeading}>{heading}</Heading>}
      <CmsdsTextField
        autoComplete={autoComplete}
        disabled={disabled}
        errorMessage={errorMessage}
        hint={hint}
        id={id}
        label={label}
        multiline={multiline}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        value={value}
        {...ariaProps}
      />
      {maxLength && (
        <CharacterCounter
          id={`${name}-counter`}
          input={value ?? ""}
          maxLength={maxLength}
        />
      )}
    </Box>
  );
};

interface Props {
  ariaLabelledby?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  disabled?: boolean;
  errorMessage?: ReactNode;
  heading?: string;
  hint?: ReactNode;
  id: string;
  label?: ReactNode;
  maxLength?: number;
  multiline?: boolean;
  name: string;
  nested?: boolean;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  sxOverride?: SystemStyleObject;
  value?: string;
}

const sx = {
  fieldHeading: {
    fontSize: "28px",
    paddingTop: "spacer3",
  },
};
