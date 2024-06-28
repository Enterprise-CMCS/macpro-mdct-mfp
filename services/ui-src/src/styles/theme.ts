// Chakra UI theme info: https://chakra-ui.com/docs/styled-system/theming/theme
import { extendTheme } from "@chakra-ui/react";

// Global style overrides
import { styles } from "./styles";

// Foundational style overrides
import { breakpoints } from "./foundations/breakpoints";
import { lineHeights } from "./foundations/lineHeights";
import { fonts } from "./foundations/fonts";
import { colors } from "./foundations/colors";

// Component style overrides
import { components } from "./components";

// Component style overrides

const theme = extendTheme({
  sizes: {
    appMax: "100vw",
    basicPageWidth: "46rem",
    reportPageWidth: "46rem",
    // font sizes: https://design.cms.gov/utilities/font-size/
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.3125rem", // 21px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },
  breakpoints,
  fonts,
  lineHeights,
  colors,
  components,
  styles,
});

export default theme;
