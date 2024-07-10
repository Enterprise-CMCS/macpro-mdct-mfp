import { Box, Heading, Text } from "@chakra-ui/react";

export const SectionHeader = ({
  content,
  label,
  ...props
}: SectionHeaderProps) => {
  const sx = {
    h3: {
      marginTop: "2rem",
    },
    label: {
      marginTop: "3rem",
    },
  };
  return (
    <Box sx={sx} {...props} className="sectionHeader">
      <Heading size="sm" sx={sx.label}>
        {label || ""}
      </Heading>
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
  label?: string;
  [key: string]: any;
}
