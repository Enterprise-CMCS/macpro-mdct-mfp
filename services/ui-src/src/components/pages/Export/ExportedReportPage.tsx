import { Helmet } from "react-helmet";
// utils
import { useStore, displayLongformPeriod } from "utils";
import { assertExhaustive } from "utils/other/typing";
// components
import { Box, Center, Heading, Spinner } from "@chakra-ui/react";
import {
  ExportedReportMetadataTable,
  ExportedSectionHeading,
  ExportedReportWrapper,
} from "components";
// types
import {
  PageTypes,
  ReportRoute,
  ReportRouteWithForm,
  ReportShape,
  ReportType,
} from "types";
// verbiage
import wpVerbiage from "verbiage/pages/wp/wp-export";
import sarVerbiage from "verbiage/pages/sar/sar-export";

const SAR_RET = "Recruitment, Enrollment, and Transitions";
const WP_SAR_STATE_AND_TERRITORY = "State or Territory-Specific Initiatives";
const WP_SAR_GENERAL_INFORMATION = "General Information";

export const ExportedReportPage = () => {
  const { report } = useStore();

  const routesToRender = report?.formTemplate.routes || [];

  const reportType = (report?.reportType ||
    localStorage.getItem("selectedReportType")) as ReportType;

  const exportVerbiageMap: { [key in ReportType]: any } = {
    WP: wpVerbiage,
    SAR: sarVerbiage,
  };

  const exportVerbiage = exportVerbiageMap[reportType];
  const { metadata, reportPage } = exportVerbiage;

  return (
    <Box sx={sx.container}>
      {(report && routesToRender.length > 0 && (
        <Box sx={sx.innerContainer}>
          {/* pdf metadata */}
          <Helmet>
            <title>{reportTitle(reportType, reportPage, report)}</title>
            <meta name="author" content={metadata.author} />
            <meta name="subject" content={metadata.subject} />
            <meta name="language" content={metadata.language} />
          </Helmet>
          {/* report heading */}
          <Heading as="h1" sx={sx.heading}>
            {reportTitle(reportType, reportPage, report)}
          </Heading>
          {/* report metadata tables */}
          <ExportedReportMetadataTable
            reportType={reportType}
            verbiage={reportPage}
          />
          {/* report sections */}
          {renderReportSections(
            report.formTemplate.routes,
            report.reportType,
            report
          )}
        </Box>
      )) || (
        <Center>
          <Spinner size="lg" />
        </Center>
      )}
    </Box>
  );
};

export const reportTitle = (
  reportType: ReportType,
  reportPage: any,
  report: ReportShape
): string => {
  switch (reportType) {
    case ReportType.WP:
    case ReportType.SAR:
      return `${report.fieldData.stateName} ${reportPage.heading} ${report.reportYear} - Period ${report.reportPeriod}`;
    default:
      assertExhaustive(reportType);
      throw new Error(
        `The title for report type ${reportType} has not been implemented.`
      );
  }
};

export const formatSectionHeader = (report: ReportShape, header: string) => {
  const newPeriod = `${displayLongformPeriod(
    report.reportPeriod,
    report.reportYear
  )}`;
  const newHeader = header.replace(" reporting period", newPeriod);
  return newHeader;
};

export const renderReportSections = (
  reportRoutes: ReportRoute[],
  reportType: string,
  report: ReportShape
) => {
  // recursively render sections
  const renderSection = (section: ReportRoute, level: number) => {
    //because R,E & T section needs numbers added, switch from shallow copy to deep copy
    const childSections = structuredClone(section.children) || [];
    let showSection = true;

    if (section.name === WP_SAR_GENERAL_INFORMATION) {
      showSection = reportType !== ReportType.WP;
    }

    if (section.name === WP_SAR_STATE_AND_TERRITORY) {
      showSection = childSections.length == 0;
    }

    //adding numbers for R,E & T section
    if (section.name === SAR_RET) {
      childSections.forEach((section, index) => {
        const subsectionTitle = section.verbiage?.intro.subsection;

        if (subsectionTitle)
          section.verbiage!.intro.subsection = `${
            index + 1
          }. ${subsectionTitle}`;
      });
    }

    const heading = section.verbiage?.intro.subsection
      ? formatSectionHeader(report, section.verbiage.intro.subsection)
      : section.name;

    return (
      <Box key={section.path}>
        {/* if section does not have children and has content to render, render it */}
        {showSection && (
          <Box>
            <ExportedSectionHeading
              heading={heading}
              level={level}
              reportType={reportType}
              verbiage={section.verbiage}
            />
            <ExportedReportWrapper section={section as ReportRouteWithForm} />
          </Box>
        )}
        {/* if section has children, recurse */}
        {childSections.map((child: ReportRoute) => renderSection(child, level))}
      </Box>
    );
  };

  return reportRoutes
    .filter((section) => section.pageType !== PageTypes.REVIEW_SUBMIT)
    .map((section: ReportRoute) => (
      <Box key={section.path} mt="3.5rem">
        {renderSection(section, 2)}
      </Box>
    ));
};

export const sx = {
  container: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "0 auto",
    paddingBottom: "4rem",
  },
  innerContainer: {
    width: "100%",
    maxWidth: "40rem",
    margin: "auto",
    "@media print": {
      margin: "5rem 0",
    },
  },
  heading: {
    fontWeight: "300",
    lineHeight: "lineHeights.heading",
    fontSize: "4xl",
  },
  combinedDataTable: {
    tableLayout: "fixed",
    ".combined-data-title": {
      display: "inline-block",
      marginBottom: "0.5rem",
      fontSize: "md",
      fontWeight: "bold",
    },
    "th, td": {
      verticalAlign: "top",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
      paddingLeft: "0.5rem",
    },
    tr: {
      "th, td": {
        "&:first-of-type": {
          ".desktop &": {
            paddingLeft: "6rem",
          },
        },
        "&:nth-last-of-type(2)": {
          width: "19.5rem",
        },
      },
    },
  },
  sectionHeading: {
    fontWeight: "bold",
    fontSize: "2xl",
    marginBottom: "2xl",
  },
};
