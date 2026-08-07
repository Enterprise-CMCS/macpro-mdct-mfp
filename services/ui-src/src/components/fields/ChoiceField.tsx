import { useState } from "react";
// components
import { Choice as CmsdsChoice } from "@cmsgov/design-system";
import { Box, SystemStyleObject, Text } from "@chakra-ui/react";
// utils
import { labelTextWithOptional } from "utils";

export const ChoiceField = ({
  name,
  label,
  hint,
  sxOverride,
  styleAsOptional,
  ...props
}: Props) => {
  const [checkboxState, setCheckboxState] = useState<boolean>(props?.hydrate ?? false);

  // update form data and checkbox state
  const onChangeHandler = async () => {
    setCheckboxState(!checkboxState);
  };

  const labelText =
    label && styleAsOptional ? labelTextWithOptional(label) : label;

  return (
    <Box sx={{ ...sx, ...sxOverride }}>
      <Text sx={sx.label} id="label">
        {labelText}
      </Text>
      <CmsdsChoice
        type="checkbox"
        name={name}
        hint={hint}
        onChange={onChangeHandler}
        checked={checkboxState}
        aria-labelledby="label"
        // required by component library, but unused
        label={<></>}
        value={checkboxState.toString()}
      />
    </Box>
  );
};

interface Props {
  name: string;
  label?: string;
  hint: string;
  sxOverride?: SystemStyleObject;
  styleAsOptional?: boolean;
  [key: string]: any;
}

const sx = {
  ".ds-c-choice[type='checkbox']:checked::after": {
    boxSizing: "content-box",
  },
  label: {
    fontWeight: "bold",
    fontSize: "md",
    marginTop: "spacer3",
  },
  ".ds-c-field__hint": {
    marginTop: "-0.5rem",
    marginLeft: "spacer_half",
  },
};
