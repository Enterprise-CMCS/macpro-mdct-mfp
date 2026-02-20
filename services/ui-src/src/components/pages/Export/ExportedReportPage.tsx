import { ComponentClass } from "react";
import { Helmet as HelmetImport, HelmetProps } from "react-helmet";
// components
import { Box, Center, Heading, Spinner } from "@chakra-ui/react";
import {
  ExportedReportMetadataTable,
  ExportedSectionHeading,
  ExportedReportWrapper,
} from "components";
// types
import {
  HeadingLevel,
  PageTypes,
  ReportPageVerbiage,
  ReportRoute,
  ReportRouteWithForm,
  ReportShape,
  ReportType,
} from "types";
// utils
import { useStore, displayLongformPeriod, getReportVerbiage } from "utils";
import { assertExhaustive } from "utils/other/typing";

export const SAR_RET = "Recruitment, Enrollment, and Transitions";
export const WP_SAR_STATE_TERRITORY_INITIATIVES =
  "State or Territory-Specific Initiatives";
export const WP_SAR_STATE_TERRITORY_INITIATIVES_INSTRUCTIONS =
  "State or Territory-Specific Initiatives Instructions";
export const WP_SAR_GENERAL_INFORMATION = "General Information";

export const ExportedReportPage = () => {
  const { report } = useStore();

  const routesToRender = report?.formTemplate.routes || [];

  const reportType = (report?.reportType ||
    localStorage.getItem("selectedReportType")) as ReportType;

  const { exportVerbiage } = getReportVerbiage(reportType);
  const { metadata, reportPage } = exportVerbiage;

  const Helmet = HelmetImport as ComponentClass<HelmetProps>;

  return (
    <Box sx={sx.container}>
      {(report && routesToRender.length > 0 && (
        <Box sx={sx.innerContainer}>
          {/* pdf metadata */}
          <Helmet>
            <title>{reportTitle(reportType, report, reportPage)}</title>
            <meta name="author" content={metadata.author} />
            <meta name="subject" content={metadata.subject} />
            <meta name="language" content={metadata.language} />
          </Helmet>
          {/* report heading */}
          <Heading as="h1" sx={sx.heading}>
            {reportTitle(reportType, report, reportPage)}
          </Heading>
          {/* report metadata tables */}
          <ExportedReportMetadataTable
            reportType={reportType}
            verbiage={reportPage}
          />
          {/* report sections */}
          {renderReportSections(routesToRender, report)}
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
  report: ReportShape,
  reportPage?: any
): string => {
  const { fieldData, reportYear, reportPeriod } = report;
  const { stateName } = fieldData;
  switch (reportType) {
    case ReportType.WP: {
      return `${stateName} ${reportPage.heading} ${reportYear} - Period ${reportPeriod}`;
    }
    case ReportType.SAR: {
      return `${stateName} ${reportPage.heading} ${reportYear} - Period ${reportPeriod}`;
    }
    case ReportType.EXPENDITURE: {
      return `${stateName} ${reportPage.heading} ${reportYear} - Period ${reportPeriod}`;
    }
    default:
      assertExhaustive(reportType as never);
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

  const newHeader = header.replace("reporting period", newPeriod);
  return newHeader;
};

export const formatSectionInfo = (verbiage: ReportPageVerbiage | undefined) => {
  if (!verbiage) {
    return;
  }

  if (
    verbiage.intro.exportSectionHeader ||
    verbiage.intro.subsection === WP_SAR_STATE_TERRITORY_INITIATIVES
  ) {
    return verbiage.dashboardSubtitle;
  }

  return verbiage.intro.info;
};

export const renderReportSections = (
  reportRoutes: ReportRoute[],
  report: ReportShape
) => {
  const { reportType } = report;
  // recursively render sections
  const renderSection = (section: ReportRoute, headingLevel: HeadingLevel) => {
    //because R,E & T section needs numbers added, switch from shallow copy to deep copy
    const childSections = structuredClone(section.children) || [];
    const subsection = section.verbiage?.intro.subsection;

    const heading = subsection
      ? formatSectionHeader(report, subsection)
      : section.name;
    const sectionHeading =
      section.verbiage?.intro.exportSectionHeader || heading;
    let hint = section.verbiage?.intro.hint;
    let info = formatSectionInfo(section.verbiage);
    let showSection = true;

    if (section.name === WP_SAR_GENERAL_INFORMATION) {
      showSection = reportType !== ReportType.WP;
    }

    if (section.name === WP_SAR_STATE_TERRITORY_INITIATIVES) {
      showSection = childSections.length == 0;
    }

    // Hide section info for initiatives
    if (sectionHeading === WP_SAR_STATE_TERRITORY_INITIATIVES) {
      info = undefined;
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

    //recruit, enrollment and transition has hints that needs to be hidden
    if (section.verbiage?.intro.section === SAR_RET) {
      hint = undefined;
    }

    const currentLevel = parseInt(headingLevel.charAt(1), 10);
    const nextLevel = currentLevel + 1;
    let nextHeadingLevel = `h${nextLevel}`;

    return (
      <Box key={section.path}>
        {/* if section does not have children and has content to render, render it */}
        {/* temporary block expenediture sections till PDF ready. */}
        {showSection && reportType !== ReportType.EXPENDITURE && (
          <Box>
            <ExportedSectionHeading
              heading={sectionHeading}
              hint={hint}
              info={info}
              headingLevel={headingLevel}
            />
            <ExportedReportWrapper
              section={section as ReportRouteWithForm}
              headingLevel={nextHeadingLevel as HeadingLevel}
            />
          </Box>
        )}
        {/* if section has children, recurse */}
        {childSections.map((child: ReportRoute) => {
          if (
            [
              WP_SAR_STATE_TERRITORY_INITIATIVES,
              WP_SAR_STATE_TERRITORY_INITIATIVES_INSTRUCTIONS,
            ].includes(child.name)
          ) {
            nextHeadingLevel = "h2";
          }

          return renderSection(child, nextHeadingLevel as HeadingLevel);
        })}
      </Box>
    );
  };

  return reportRoutes
    .filter((section) => section.pageType !== PageTypes.REVIEW_SUBMIT)
    .map((section: ReportRoute) => (
      <Box key={section.path} mt="3.5rem">
        {renderSection(section, "h2")}
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
      marginBottom: "spacer1",
      fontSize: "md",
      fontWeight: "bold",
    },
    "th, td": {
      verticalAlign: "top",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
      paddingLeft: "spacer1",
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
