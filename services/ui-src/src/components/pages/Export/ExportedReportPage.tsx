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

export const ExportedReportPage = () => {
  const { report } = useStore() ?? {};
  const routesToRender = report?.formTemplate.routes.filter(
    (route: ReportRoute) => route
  );
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
      {(report && routesToRender && (
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
      return `${report.fieldData.stateName} ${reportPage.heading} ${report.reportYear} - Period ${report.reportPeriod}`;
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
  const newHeader = header?.replace(" reporting period", newPeriod);
  return newHeader;
};

export const renderReportSections = (
  reportRoutes: ReportRoute[],
  reportType: string,
  report: ReportShape
) => {
  // recursively render sections
  const renderSection = (section: ReportRoute) => {
    //because R,E & T section needs numbers added, switch from shallow copy to deep copy
    let childSections = structuredClone(section?.children);
    const initatives =
      section.name === "State- or Territory Specific Initiatives" &&
      childSections;
    const showGeneralInformation = !(
      reportType === ReportType.WP && section.name === "General Information"
    );
    //adding numbers for R,E & T section
    if (section.name === "Recruitment, Enrollment, and Transitions") {
      childSections?.forEach((section, index) => {
        if (section.verbiage?.intro?.subsection)
          section.verbiage.intro.subsection = `${index + 1}. ${
            section.verbiage?.intro?.subsection
          }`;
      });
    }

    return (
      <Box key={section.path}>
        {/* if section does not have children and has content to render, render it */}
        {showGeneralInformation && !initatives && (
          <Box>
            <ExportedSectionHeading
              heading={
                formatSectionHeader(
                  report,
                  section.verbiage?.intro?.subsection!
                ) || section.name
              }
              reportType={reportType}
              verbiage={section.verbiage || undefined}
            />
            <ExportedReportWrapper section={section as ReportRouteWithForm} />
          </Box>
        )}
        {/* if section has children, recurse */}
        {childSections?.map((child: ReportRoute) => renderSection(child))}
      </Box>
    );
  };

  return reportRoutes.map(
    (section: ReportRoute) =>
      section?.pageType !== PageTypes.REVIEW_SUBMIT && (
        <Box key={section.path} mt="5rem">
          {renderSection(section)}
        </Box>
      )
  );
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
    "table-layout": "fixed",
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
