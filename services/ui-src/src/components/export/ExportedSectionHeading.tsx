// components
import { Box, Heading } from "@chakra-ui/react";
// types
import { ReportPageVerbiage } from "types";
// utils
import { parseCustomHtml } from "utils";

export const SAR_RET = "Recruitment, Enrollment, and Transitions";
export const WP_SAR_STATE_OR_TERRITORY =
  "State or Territory-Specific Initiatives";

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
  hasHint = true,
  hasInfo = true,
}: Props) => {
  const headingLevel = `h${level}` as any;
  const sectionHint = verbiage?.intro.hint;
  const sectionInfo = formatSectionInfo(verbiage);

  const showHint = hasHint && sectionHint;
  const showInfo = hasInfo && sectionInfo;

  return (
    <Box data-testid="exportedSectionHeading" sx={sx.container}>
      <Heading as={headingLevel} sx={sx.heading}>
        {heading}
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
  hasHint?: boolean;
  hasInfo?: boolean;
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
