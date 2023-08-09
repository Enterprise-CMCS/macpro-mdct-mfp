// components
import { Flex } from "@chakra-ui/react";
import { PageTemplate, Sidebar, StandardReportPage } from "components";
// utils

import React from "react";
import { mockStandardReportPageJson } from "utils/testing/mockForm";

export const ReportPageWrapper = () => {
  return (
    <PageTemplate type="standard">
      <Flex sx={sx.pageContainer}>
        <>
          <Sidebar isHidden={false} />
          <Flex id="report-content" sx={sx.reportContainer}>
            <StandardReportPage route={mockStandardReportPageJson} />
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
