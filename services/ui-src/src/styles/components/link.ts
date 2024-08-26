import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  textDecoration: "underline",
  transition: "all 0.3s ease",
};

const primaryVarian = {
  color: "palette.primary",
  _visited: {
    color: "palette.primary",
    textDecorationColor: "palette.primary",
  },
  ":hover, :visited:hover": {
    color: "palette.primary_darker",
    textDecorationColor: "palette.primary_darker",
  },
};

const inverseVariant = {
  color: "palette.white",
  _visited: {
    color: "palette.white",
    textDecorationColor: "palette.white",
  },
  ":hover, :visited:hover": {
    color: "palette.gray_lighter",
    textDecorationColor: "palette.gray_lighter",
  },
};

const unstyledVariant = {
  textDecoration: "none",
  ":focus, :focus-visible, :hover, :visited, :visited:hover": {
    textDecoration: "none",
  },
};

const unstyledButtonVariant = {
  color: "palette.primary",
  border: "1px solid",
  padding: ".5rem 1rem",
  borderRadius: "5px",
  fontWeight: "bold",
  textDecoration: "none",
  _visited: { color: "palette.primary" },
  ":hover, :visited:hover": {
    color: "palette.primary_darker",
    textDecoration: "none",
  },
  ".mobile &": {
    border: "none",
  },
};

const variants = {
  primary: primaryVarian,
  inverse: inverseVariant,
  unstyled: unstyledVariant,
  outlineButton: unstyledButtonVariant,
};

const linkTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  variants: variants,
  defaultProps: {
    variant: "primary",
  },
};

export default linkTheme;
