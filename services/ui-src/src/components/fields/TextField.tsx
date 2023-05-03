// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box } from "@chakra-ui/react";
// utils
import { labelTextWithOptional, parseCustomHtml, useUser } from "utils";
import { AnyObject, CustomHtmlElement } from "types";

export const TextField = ({
  name,
  label,
  hint,
  placeholder,
  sxOverride,
  nested,
  styleAsOptional,
  ...props
}: Props) => {
  const parsedHint = hint && parseCustomHtml(hint);
  const nestedChildClasses = nested ? "nested ds-c-choice__checkedChild" : "";
  const labelClass = !label ? "no-label" : "";
  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  return (
    <Box sx={sxOverride} className={`${nestedChildClasses} ${labelClass}`}>
      <CmsdsTextField
        id={name}
        name={name}
        label={labelText || ""}
        hint={parsedHint}
        placeholder={placeholder}
        {...props}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint?: CustomHtmlElement[];
  placeholder?: string;
  sxOverride?: AnyObject;
  nested?: boolean;
  autosave?: boolean;
  styleAsOptional?: boolean;
  clear?: boolean;
  [key: string]: any;
}
