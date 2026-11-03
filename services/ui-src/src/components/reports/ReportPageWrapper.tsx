import { useState } from "react";
// components
import { Divider, Flex, Stack, Text } from "@chakra-ui/react";
import {
  DrawerReportPage,
  DynamicModalOverlayReportPage,
  DynamicModalOverlayReportPageV2,
  ModalDrawerReportPage,
  ModalOverlayReportPage,
  ModalOverlayReportPageV2,
  PageTemplate,
  PrintButton,
  ReportPageFooter,
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
import {
  hasEntitySteps,
  hasInitiativesWithEntitySteps,
  parseCustomHtml,
  useStore,
} from "utils";

export const ReportPageWrapper = () => {
  const { report } = useStore();
  const { pathname } = useLocation();
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

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
        if (!hasEntitySteps(route)) {
          return (
            <ModalOverlayReportPageV2
              route={route as ModalOverlayReportPageShape}
              setSidebarHidden={setSidebarHidden}
            />
          );
        }

        return (
          <ModalOverlayReportPage
            route={route as ModalOverlayReportPageShape}
            setSidebarHidden={setSidebarHidden}
          />
        );
      case PageTypes.DYNAMIC_MODAL_OVERLAY:
        if (!hasInitiativesWithEntitySteps(route)) {
          return (
            <DynamicModalOverlayReportPageV2
              route={route as DynamicModalOverlayReportPageShape}
              setSidebarHidden={setSidebarHidden}
            />
          );
        }

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
        return (
          <StandardReportPage
            route={route as StandardReportPageShape}
            setSubmitting={setSubmitting}
          />
        );
    }
  };

  const reportTemplate = report?.formTemplate.flatRoutes!.find(
    (route: ReportRoute) => route.path === pathname
  );

  return (
    <PageTemplate section={false} type="report">
      <Flex sx={sx.pageContainer}>
        <Sidebar isHidden={sidebarHidden} />
        {reportTemplate && (
          <Stack>
            <Flex
              as="main"
              id="report-content"
              sx={sx.reportContainer}
              gap="spacer3"
            >
              {renderPageSection(reportTemplate)}
              {/* {route.verbiage.reviewPdfHint && ( */}
              {reportTemplate.verbiage?.reviewPdfHint && (
                <Stack gap="spacer3">
                  <Text color="gray">
                    {parseCustomHtml(reportTemplate.verbiage.reviewPdfHint)}
                  </Text>
                  <PrintButton />
                </Stack>
              )}
              <Divider marginTop="spacer2"></Divider>
              {reportTemplate.pageType != PageTypes.REVIEW_SUBMIT && (
                <ReportPageFooter
                  submitting={submitting}
                  form={(reportTemplate as any).form}
                  praDisclosure={reportTemplate.verbiage?.praDisclosure}
                />
              )}
            </Flex>
          </Stack>
        )}
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
    paddingLeft: "spacer7",
    ".mobile &": {
      marginX: "0rem",
    },
    h3: {
      paddingBottom: "0.75rem",
      fontSize: "heading_lg",
      fontWeight: "heading_lg",
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
