import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  color: "base",
  fontWeight: "normal",
  margin: "0",
};

const grayBoldVariant = {
  fontWeight: "heading_md",
  color: "gray",
  fontSize: "18px",
};

const variants = {
  grayBold: grayBoldVariant,
};

const headingTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  variants: variants,
  defaultProps: {
    variant: "primary",
    size: "md",
  },
};

export default headingTheme;
