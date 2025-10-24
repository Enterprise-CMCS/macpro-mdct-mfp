import { ReactChild } from "react";
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
  children?: ReactChild | ReactChild[];
  [key: string]: any;
}

const sx = {
  root: {
    width: "100%",
    padding: "2rem",
    ".mobile &": {
      padding: "spacer2",
    },
  },
};
