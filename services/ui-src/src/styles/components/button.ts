import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  transition: "all 0.3s ease",
  borderRadius: "0.25rem",
  px: "1.5em",
  py: "0.5em",
  fontWeight: "bold",
  width: "fit-content",
  "&:disabled, &:disabled:hover": {
    color: "palette.gray",
    backgroundColor: "palette.gray_lighter",
  },
};

const primaryVariant = {
  backgroundColor: "palette.primary",
  color: "palette.white",
  "&:hover": {
    backgroundColor: "palette.primary_darker",
  },
  "&:visited, &:visited:hover": {
    backgroundColor: "palette.primary",
    color: "palette.white",
  },
  "&:disabled, &:disabled:hover": {
    color: "palette.gray",
    backgroundColor: "palette.gray_lighter",
  },
};

const outlineVariant = {
  backgroundColor: "transparent",
  border: "1px solid",
  borderColor: "palette.primary",
  color: "palette.primary",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "transparent",
    color: "palette.primary_darker",
  },
  "&:visited, &:visited:hover": {
    backgroundColor: "transparent",
    color: "palette.primary",
  },
  "&:disabled, &:disabled:hover": {
    color: "palette.gray_lighter",
    borderColor: "palette.gray_lighter",
    backgroundColor: "transparent",
  },
};

const transparentVariant = {
  backgroundColor: "transparent",
  color: "palette.primary",
  textDecoration: "underline",
  padding: "0",
  "&:hover": {
    backgroundColor: "transparent",
    color: "palette.primary_darker",
  },
  "&:visited, &:visited:hover": {
    backgroundColor: "transparent",
    color: "palette.primary",
  },
  "&:disabled, &:disabled:hover": {
    color: "palette.gray_lighter",
    backgroundColor: "transparent",
  },
};

const variants = {
  primary: primaryVariant,
  outline: outlineVariant,
  transparent: transparentVariant,
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
