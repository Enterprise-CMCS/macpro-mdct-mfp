import { Box, Heading, Text } from "@chakra-ui/react";

export const SectionHeader = ({
  content,
  divider,
  label,
  ...props
}: SectionHeaderProps) => {
  const sx = {
    h3: {
      marginTop: "2rem",
    },
    label: {
      marginTop: "2rem",
    },
    h1: {
      padding: divider === "bottom" ? "2rem 0 1rem 0" : "2rem",
    },
  };
  return (
    <Box sx={sx} {...props}>
      {divider === "top" && <hr></hr>}
      <Heading size="sm" sx={sx.label}>
        {label || ""}
      </Heading>
      <Heading size="md" sx={sx.h3}>
        {content}
      </Heading>
      {divider === "bottom" && <hr></hr>}
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
  divider: "top" | "bottom" | "none";
  [key: string]: any;
}

interface SectionHeaderProps {
  content: string;
  label?: string;
  [key: string]: any;
}
