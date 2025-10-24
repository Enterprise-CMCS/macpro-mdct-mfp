// components
import { Box, Heading } from "@chakra-ui/react";
import { CustomHtmlElement, HeadingLevel } from "types";
// utils
import { parseCustomHtml } from "utils";

export const ExportedSectionHeading = ({
  heading,
  hint,
  info,
  headingLevel = "h2",
}: Props) => {
  return (
    <Box data-testid="exportedSectionHeading" sx={sx.container}>
      <Heading as={headingLevel} sx={sx.heading}>
        {heading}
      </Heading>
      {hint && <Box sx={sx.hintTextBox}>{hint}</Box>}
      {info && <Box sx={sx.info}>{parseCustomHtml(info)}</Box>}
    </Box>
  );
};

export interface Props {
  heading: string;
  hint?: string;
  info?: string | CustomHtmlElement[];
  headingLevel?: HeadingLevel;
}

const sx = {
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
  },
  heading: {
    marginTop: "2rem",
    fontSize: "2xl",
    fontWeight: "bold",
    color: "black",
  },
  info: {
    paddingTop: "1.5rem",
    p: {
      margin: "1.5rem 0",
    },
    li: {
      marginBottom: "1.5rem",
    },
  },
  hintTextBox: {
    color: "#5B616B",
    margin: "1.5rem 0",
  },
  spreadsheet: {
    margin: "1.5rem 0",
    "@media print": {
      pageBreakAfter: "avoid",
    },
  },
};
