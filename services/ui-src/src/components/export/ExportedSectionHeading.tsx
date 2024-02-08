// components
import { Box, Heading } from "@chakra-ui/react";
// types
import { AnyObject, CustomHtmlElement, ReportPageVerbiage } from "types";
// utils
import { parseCustomHtml } from "utils";

export const formatSectionInfo = (verbiage: ReportPageVerbiage) => {
  if (
    verbiage?.intro?.exportSectionHeader ||
    verbiage?.intro?.subsection === "State- or Territory-Specific Initiatives"
  ) {
    return (verbiage as AnyObject)?.dashboardSubtitle;
  }

  if (verbiage?.intro.section === "Recruitment, Enrollment, and Transitions") {
    return (verbiage?.intro?.info as CustomHtmlElement[])?.filter(
      (info) => info.type !== "h3"
    );
  }

  return verbiage?.intro?.info;
};

export const ExportedSectionHeading = ({ heading, verbiage }: Props) => {
  const sectionHeading = verbiage?.intro?.exportSectionHeader
    ? verbiage?.intro?.exportSectionHeader
    : heading;
  const sectionHint = verbiage?.intro?.hint ? verbiage?.intro?.hint : null;
  const sectionInfo = formatSectionInfo(verbiage!);
  const stateAndTerritory =
    sectionHeading === "State and Territory-Specific Initiatives";

  //recruit, enrollment and transition has hints that needs to be hidden
  const hideHint =
    verbiage?.intro.section === "Recruitment, Enrollment, and Transitions";

  return (
    <Box data-testid="exportedSectionHeading" sx={sx.container}>
      <Heading as="h2" sx={sx.heading}>
        {sectionHeading}
      </Heading>
      {!hideHint && <Box sx={sx.hintTextBox}>{sectionHint}</Box>}
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
    margin: "4rem 0 1.5rem 0",
    fontSize: "2xl",
    fontWeight: "bold",
  },
  info: {
    paddingTop: "1.5rem",
    p: {
      margin: "1.5rem 0",
    },
    h3: {
      fontSize: "lg",
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
