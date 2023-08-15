// components
import { Flex } from "@chakra-ui/react";
import { PageTemplate, Sidebar, StandardReportPage } from "components";
import { PageTypes } from "types";
// utils
import {
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockStandardReportPageJson,
} from "utils/testing/mockForm";
import { DrawerReportPage } from "./DrawerReportPage";
import { ModalDrawerReportPage } from "./ModalDrawerReportPage";

export const ReportPageWrapper = () => {
  // these should be built off the form template, which comes from the report.
  const renderPageSection = (route: PageTypes) => {
    switch (route) {
      case PageTypes.DRAWER:
        return <DrawerReportPage route={mockDrawerReportPageJson} />;
      case PageTypes.MODAL_DRAWER:
        return <ModalDrawerReportPage route={mockModalDrawerReportPageJson} />;
      default:
        return <StandardReportPage route={mockStandardReportPageJson} />;
    }
  };

  return (
    <PageTemplate type="report">
      <Flex sx={sx.pageContainer}>
        <>
          <Sidebar isHidden={false} />
          <Flex id="report-content" sx={sx.reportContainer}>
            {renderPageSection(PageTypes.MODAL_DRAWER)}
          </Flex>
        </>
      </Flex>
    </PageTemplate>
  );
};

const sx = {
  pageContainer: {
    width: "100%",
    height: "100%",
  },
  reportContainer: {
    flexDirection: "column",
    width: "100%",
    maxWidth: "reportPageWidth",
    marginY: "3.5rem",
    marginLeft: "3.5rem",
    ".mobile &": {
      marginX: "0rem",
    },
    h3: {
      paddingBottom: "0.75rem",
      fontSize: "lg",
      fontWeight: "bold",
    },
  },
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    padding: "10",

    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
};
