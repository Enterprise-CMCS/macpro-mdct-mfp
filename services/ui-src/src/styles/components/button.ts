import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  transition: "all 0.3s ease",
  borderRadius: "0.25rem",
  px: "1.5em",
  py: "0.5em",
  fontWeight: "bold",
  width: "fit-content",
  "&:disabled, &:disabled:hover": {
    color: "gray",
    backgroundColor: "gray_lighter",
    opacity: "1",
  },
};

const primaryVariant = {
  backgroundColor: "primary",
  color: "white",
  "&:hover": {
    backgroundColor: "primary_darker",
  },
  "&:visited, &:visited:hover": {
    backgroundColor: "primary",
    color: "white",
  },
  "&:disabled, &:disabled:hover": {
    color: "gray",
    backgroundColor: "gray_lighter",
  },
};

const outlineVariant = {
  backgroundColor: "transparent",
  border: "1px solid",
  borderColor: "primary",
  color: "primary",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "gray_lightest",
    color: "primary_darker",
  },
  "&:visited, &:visited:hover": {
    backgroundColor: "transparent",
    color: "primary",
  },
  "&:disabled, &:disabled:hover": {
    color: "gray_lighter",
    borderColor: "gray_lighter",
    backgroundColor: "transparent",
  },
};

const transparentVariant = {
  backgroundColor: "transparent",
  color: "primary",
  textDecoration: "underline",
  padding: "0",
  "&:hover": {
    backgroundColor: "transparent",
    color: "primary_darker",
  },
  "&:visited, &:visited:hover": {
    backgroundColor: "transparent",
    color: "primary",
  },
  "&:disabled, &:disabled:hover": {
    color: "gray_light",
    backgroundColor: "transparent",
  },
};

const dangerVariant = {
  backgroundColor: "error_dark",
  color: "white",
  "&:hover": {
    backgroundColor: "error_darker",
  },
};

const variants = {
  primary: primaryVariant,
  outline: outlineVariant,
  transparent: transparentVariant,
  danger: dangerVariant,
};

const sizes = {
  sm: {
    fontSize: "sm",
    fontWeight: "400",
    px: "0.5em",
    py: "0.25em",
  },
  md: {
    fontSize: "md",
    fontWeight: "700",
    px: "1.5em",
    py: "0.5em",
  },
  lg: {
    fontSize: "lg",
    px: "1.5em",
    py: "1em",
  },
};

const buttonTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  sizes: sizes,
  variants: variants,
  defaultProps: {
    variant: "primary",
    size: "md",
  },
};

export default buttonTheme;
