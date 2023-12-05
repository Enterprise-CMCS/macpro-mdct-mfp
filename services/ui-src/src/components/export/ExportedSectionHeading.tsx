// components
import { Box, Heading } from "@chakra-ui/react";
// types
import { ReportPageVerbiage } from "types";
// utils
import { parseCustomHtml } from "utils";

export const ExportedSectionHeading = ({ heading, verbiage }: Props) => {
  const sectionHeading = verbiage?.intro?.exportSectionHeader
    ? verbiage?.intro?.exportSectionHeader
    : verbiage?.intro?.subsection || heading;
  const sectionInfo = verbiage?.intro?.exportSectionHeader
    ? null
    : verbiage?.intro?.info;
  const stateAndTerritory =
    sectionHeading === "State and Territory-Specific Initiatives";

  return (
    <Box data-testid="exportedSectionHeading" sx={sx.container}>
      <Heading as="h2" sx={sx.heading}>
        {sectionHeading}
      </Heading>
      {!stateAndTerritory && sectionInfo && (
        <Box sx={sx.info}>{parseCustomHtml(sectionInfo)}</Box>
      )}
    </Box>
  );
};

export interface Props {
  heading: string;
  reportType?: string;
  verbiage?: ReportPageVerbiage;
}

const sx = {
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
  },
  heading: {
    margin: "1.5rem 0",
    fontSize: "2xl",
    fontWeight: "bold",
  },
  info: {
    p: {
      margin: "1.5rem 0",
    },
    h3: {
      fontSize: "lg",
    },
  },
  spreadsheet: {
    margin: "1.5rem 0",
    "@media print": {
      pageBreakAfter: "avoid",
    },
  },
};
