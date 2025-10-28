import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  textDecoration: "underline",
  transition: "all 0.3s ease",
};

const primaryVariant = {
  color: "primary",
  _visited: {
    color: "primary",
    textDecorationColor: "primary",
  },
  ":hover, :visited:hover": {
    color: "primary_darker",
    textDecorationColor: "primary_darker",
  },
};

const inverseVariant = {
  color: "white",
  _visited: {
    color: "white",
    textDecorationColor: "white",
  },
  ":hover, :visited:hover": {
    color: "gray_lighter",
    textDecorationColor: "gray_lighter",
  },
};

const unstyledVariant = {
  textDecoration: "none",
  ":focus, :focus-visible, :hover, :visited, :visited:hover": {
    textDecoration: "none",
    color: "base",
  },
};

const unstyledButtonVariant = {
  color: "primary",
  border: "1px solid",
  padding: "0.5rem 1rem",
  borderRadius: "5px",
  fontWeight: "bold",
  textDecoration: "none",
  _visited: { color: "primary" },
  ":hover, :visited:hover": {
    color: "primary_darker",
    textDecoration: "none",
  },
  ".mobile &": {
    border: "none",
  },
};

const variants = {
  primary: primaryVariant,
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
