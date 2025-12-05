import { useState } from "react";
// components
import { Flex } from "@chakra-ui/react";
import {
  DrawerReportPage,
  DynamicModalOverlayReportPage,
  ModalDrawerReportPage,
  ModalOverlayReportPage,
  PageTemplate,
  ReviewSubmitPage,
  Sidebar,
  StandardReportPage,
} from "components";
import { useLocation } from "react-router";
import {
  DrawerReportPageShape,
  ModalDrawerReportPageShape,
  ModalOverlayReportPageShape,
  DynamicModalOverlayReportPageShape,
  PageTypes,
  ReportRoute,
  StandardReportPageShape,
} from "types";
// utils
import { useStore } from "utils";

export const ReportPageWrapper = () => {
  const { report } = useStore();
  const { pathname } = useLocation();
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);

  const showSidebar = () => {
    if (sidebarHidden) setSidebarHidden(false);
  };

  // these should be built off the form template, which comes from the report.
  const renderPageSection = (route: ReportRoute) => {
    switch (route.pageType) {
      case PageTypes.DRAWER:
        return <DrawerReportPage route={route as DrawerReportPageShape} />;
      case PageTypes.MODAL_DRAWER:
        showSidebar();
        return (
          <ModalDrawerReportPage route={route as ModalDrawerReportPageShape} />
        );
      case PageTypes.MODAL_OVERLAY:
        return (
          <ModalOverlayReportPage
            route={route as ModalOverlayReportPageShape}
            setSidebarHidden={setSidebarHidden}
          />
        );
      case PageTypes.DYNAMIC_MODAL_OVERLAY:
        return (
          <DynamicModalOverlayReportPage
            route={route as DynamicModalOverlayReportPageShape}
            setSidebarHidden={setSidebarHidden}
          />
        );
      case PageTypes.REVIEW_SUBMIT:
        return <ReviewSubmitPage />;
      default:
        showSidebar();
        return <StandardReportPage route={route as StandardReportPageShape} />;
    }
  };

  const reportTemplate = report?.formTemplate.flatRoutes!.find(
    (route: ReportRoute) => route.path === pathname
  );

  return (
    <PageTemplate section={false} type="report">
      <Flex sx={sx.pageContainer}>
        <Sidebar isHidden={sidebarHidden} />
        <Flex as="main" id="report-content" sx={sx.reportContainer}>
          {reportTemplate && renderPageSection(reportTemplate)}
        </Flex>
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
    marginY: "spacer7",
    marginLeft: "spacer7",
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
        borderColor: "black",
      },
      "&:after": {
        borderLeftColor: "black",
      },
    },
  },
};
