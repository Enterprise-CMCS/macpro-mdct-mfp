import { breakpoints } from "./breakpoints";
import { fonts } from "./fonts";
import { colors } from "./colors";
import { sizes } from "./sizes";
import { space } from "./space";
import { typography } from "./typography";

export const foundations = {
  breakpoints: breakpoints,
  colors: colors,
  fonts: fonts,
  sizes: sizes,
  space: space,
  ...typography,
};
