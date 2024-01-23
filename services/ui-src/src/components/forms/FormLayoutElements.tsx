import { Box, Heading, Text } from "@chakra-ui/react";

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

export const SectionContent = ({ content }: SectionContentProps) => {
  const sx = {
    paddingTop: "0.5rem",
  };
  return <Text sx={sx}>{content}</Text>;
};

interface SectionContentProps {
  content: string;
  [key: string]: any;
}

interface SectionHeaderProps {
  content: string;
  [key: string]: any;
}
