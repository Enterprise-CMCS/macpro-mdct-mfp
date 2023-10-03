// components
import { Box, Heading } from "@chakra-ui/react";
import { ChoiceListField } from "components";
// utils
import { ChoiceFieldProps } from "types";

export const CheckboxField = ({
  name,
  label,
  choices,
  heading,
  sxOverride,
  ...props
}: ChoiceFieldProps) => {
  return (
    <Box sx={sxOverride}>
      {/* SAR field sections */}
      {heading && <Heading sx={sx.fieldHeading}>{heading}</Heading>}
      <ChoiceListField
        type="checkbox"
        name={name}
        label={label}
        choices={choices}
        {...props}
      />
    </Box>
  );
};

const sx = {
  fieldHeading: {
    fontSize: "28px",
    paddingTop: "1.5rem",
  },
};
