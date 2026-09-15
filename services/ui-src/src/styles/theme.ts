// Chakra UI theme info: https://v2.chakra-ui.com/docs/styled-system/theme
import { extendTheme } from "@chakra-ui/react";

// Global style overrides
import { styles } from "./styles";

// Foundational style overrides
import { foundations } from "./foundations";

// Component style overrides
import { components } from "./components";

const theme = extendTheme({
  ...foundations,
  config: {
    cssVarPrefix: "mdct",
  },
  components,
  styles,
});

export default theme;
