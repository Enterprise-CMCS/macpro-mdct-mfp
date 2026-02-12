import {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLInputAutoCompleteAttribute,
  ReactNode,
} from "react";
import { Box, SystemStyleObject } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
// utils
import { maskMap } from "utils/other/mask";

export const NumberFieldDisplay = ({
  ariaLabelledby,
  autoComplete,
  disabled = false,
  errorMessage,
  hint,
  id,
  label,
  mask,
  name,
  nested = false,
  onBlur,
  onChange,
  placeholder,
  readOnly = false,
  sxOverride,
  value,
}: Props) => {
  const maskClass = mask || "";
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";

  const ariaProps = {
    "aria-labelledby": ariaLabelledby,
  };

  return (
    <Box sx={{ ...sx, ...sxOverride }} className={`${nestedChildClasses}`}>
      <Box sx={sx.numberFieldContainer} className={maskClass}>
        <CmsdsTextField
          autoComplete={autoComplete}
          disabled={disabled}
          errorMessage={errorMessage}
          hint={hint}
          id={id}
          label={label}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          value={value}
          {...ariaProps}
        />
        <SymbolOverlay disabled={disabled} fieldMask={mask} nested={nested} />
      </Box>
    </Box>
  );
};

interface Props {
  ariaLabelledby?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  disabled?: boolean;
  errorMessage?: ReactNode;
  hint?: ReactNode;
  id: string;
  label?: ReactNode;
  mask?: keyof typeof maskMap | null;
  name: string;
  nested?: boolean;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  readOnly?: boolean;
  sxOverride?: SystemStyleObject;
  value: string;
}

export const SymbolOverlay = ({
  fieldMask,
  nested,
  disabled,
}: SymbolOverlayProps) => {
  const symbolMap = { percentage: "%", currency: "$" };
  const symbol = fieldMask
    ? symbolMap[fieldMask as keyof typeof symbolMap]
    : undefined;
  const disabledClass = disabled ? "disabled" : "";
  const nestedClass = nested ? "nested" : "";
  return symbol ? (
    <Box
      className={`${disabledClass} ${nestedClass} `}
      sx={sx.symbolOverlay}
    >{` ${symbol} `}</Box>
  ) : (
    <></>
  );
};
interface SymbolOverlayProps {
  fieldMask?: keyof typeof maskMap | null;
  nested: boolean;
  disabled: boolean;
}

const sx = {
  ".ds-c-field": {
    maxWidth: "15rem",
    paddingLeft: "spacer1",
    paddingRight: "spacer1",
  },
  numberFieldContainer: {
    position: "relative",
    "&.currency": {
      ".ds-c-field": {
        paddingLeft: "spacer3",
      },
    },
    "&.percentage": {
      ".ds-c-field": {
        paddingRight: "1.75rem",
      },
    },
  },
  symbolOverlay: {
    position: "absolute",
    paddingTop: "1px",
    fontSize: "lg",
    fontWeight: "700",
    "&.nested": {
      bottom: "15px",
      left: "245px",
    },
    ".percentage &": {
      bottom: "11px",
      left: "213px",
    },
    ".currency &": {
      bottom: "11px",
      left: "10px",
    },
  },
};
