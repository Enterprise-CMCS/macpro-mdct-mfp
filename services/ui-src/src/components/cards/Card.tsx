import { ReactNode } from "react";
// components
import { Box } from "@chakra-ui/react";

export const Card = ({ children, ...props }: Props) => {
  return (
    <Box {...props} sx={sx.root}>
      {children}
    </Box>
  );
};

interface Props {
  children?: ReactNode | ReactNode[];
  [key: string]: any;
}

const sx = {
  root: {
    width: "100%",
    padding: "spacer4",
    ".mobile &": {
      padding: "spacer2",
    },
  },
};
