import { Box, Heading } from "@chakra-ui/react";

export const SectionHeader = ({ content, ...props }: SectionHeaderProps) => {
  const sx = {
    h3: {
      marginTop: "4rem",
    },
  };
  return (
    <Box sx={sx} {...props}>
      <Heading size="md" sx={sx.h3}>
        {content}
      </Heading>
    </Box>
  );
};

interface SectionHeaderProps {
  content: string;
  [key: string]: any;
}
