// components
import { Flex } from "@chakra-ui/react";
import {
  DrawerReportPage,
  //ModalDrawerReportPage,
  ModalOverlayReportPage,
  PageTemplate,
  ReviewSubmitPage,
  Sidebar,
  StandardReportPage,
} from "components";
import { useLocation } from "react-router-dom";
//import { ModalOverlayReportPageShape} from "types";
import { PageTypes } from "types";
// utils
import {
  mockDrawerReportPageJson,
  //mockModalOverlayReportPageJson,
  mockStandardReportPageJson,
} from "utils/testing/mockForm";
// import { mockGeneralInfoReportPageJson } from "utils/testing/generalInfoMockForm";

// import { mockStandardTBSReportPageJson } from "utils/testing/tbsMockForm";
import { mockStandardSTSReportPageJson } from "utils/testing/stsMockForm"; //REMOVE when ready

export const ReportPageWrapper = () => {
  const location = useLocation();

  // temporary for mocking correct json per page
  const getRoutePath = (path: string) => {
    if (path === "/standard") {
      return mockStandardReportPageJson;
    } else if (
      // add the path
      path === ""
    ) {
      // add the mock page json
      return mockStandardReportPageJson;
    } else {
      return mockStandardReportPageJson;
    }
  };
  // these should be built off the form template, which comes from the report.
  const renderPageSection = (route: PageTypes) => {
    switch (route) {
      case PageTypes.DRAWER:
        return <DrawerReportPage route={mockDrawerReportPageJson} />;
      case PageTypes.MODAL_OVERLAY:
        return (
          <ModalOverlayReportPage
            route={mockStandardSTSReportPageJson}
            setSidebarHidden={() => {
              return false;
            }}
          />
        );
      case PageTypes.REVIEW_SUBMIT:
        return <ReviewSubmitPage />;
      default:
        return <StandardReportPage route={getRoutePath(location.pathname)} />;
    }
  };

  return (
    <PageTemplate type="report">
      <Flex sx={sx.pageContainer}>
        <>
          <Sidebar isHidden={false} />
          <Flex id="report-content" sx={sx.reportContainer}>
            {renderPageSection(PageTypes.MODAL_OVERLAY)}
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
