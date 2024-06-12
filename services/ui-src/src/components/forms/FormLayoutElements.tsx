import { Box, Heading, Text } from "@chakra-ui/react";

export const SectionHeader = ({
  content,
  label,
  divider,
  ...props
}: SectionHeaderProps) => {
  const sx = {
    h3: {
      marginTop: "2rem",
    },
    label: {
      marginTop: "2rem",
    },
    hr: {
      margin: divider === "top" ? "3rem 0" : "0",
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
  divider?: "top" | "none";
  [key: string]: any;
}

interface SectionHeaderProps {
  content: string;
  label?: string;
  [key: string]: any;
}
