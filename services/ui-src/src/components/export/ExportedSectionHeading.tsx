// components
import { Box, Heading } from "@chakra-ui/react";
// types
import { ReportPageVerbiage } from "types";
// utils
import { parseCustomHtml } from "utils";

const SAR_RET = "Recruitment, Enrollment, and Transitions";
const WP_SAR_STATE_OR_TERRITORY = "State or Territory-Specific Initiatives";

export const formatSectionInfo = (verbiage: ReportPageVerbiage | undefined) => {
  if (!verbiage) {
    return;
  }

  const {
    intro: { exportSectionHeader, info, subsection },
    dashboardSubtitle,
  } = verbiage;

  if (exportSectionHeader || subsection === WP_SAR_STATE_OR_TERRITORY) {
    return dashboardSubtitle;
  }

  return info;
};

export const ExportedSectionHeading = ({
  heading,
  level = 2,
  verbiage,
}: Props) => {
  const headingLevel = `h${level}` as any;
  const sectionHeading = verbiage?.intro.exportSectionHeader || heading;
  const sectionHint = verbiage?.intro.hint;
  const sectionInfo = formatSectionInfo(verbiage);

  //recruit, enrollment and transition has hints that needs to be hidden
  const showHint = verbiage?.intro.section !== SAR_RET && sectionHint;
  const showInfo = sectionHeading !== WP_SAR_STATE_OR_TERRITORY && sectionInfo;

  return (
    <Box data-testid="exportedSectionHeading" sx={sx.container}>
      <Heading as={headingLevel} sx={sx.heading}>
        {sectionHeading}
      </Heading>
      {showHint && <Box sx={sx.hintTextBox}>{sectionHint}</Box>}
      {showInfo && <Box sx={sx.info}>{parseCustomHtml(sectionInfo)}</Box>}
    </Box>
  );
};

export interface Props {
  heading: string;
  level?: number;
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
    marginTop: "2rem",
    fontSize: "2xl",
    fontWeight: "bold",
    color: "palette.black",
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
