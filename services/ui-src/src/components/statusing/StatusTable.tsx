// components
import { Box } from "@chakra-ui/react";
import { Table } from "components";
import { ChildRow } from "./ChildRow";
// types
import { ReportPageProgress } from "types";
// utils
import { getReportVerbiage, getRouteStatus, useStore } from "utils";

export const StatusTable = () => {
  const { report } = useStore();
  const { reviewAndSubmitVerbiage } = getReportVerbiage(report?.reportType);
  const { review } = reviewAndSubmitVerbiage;
  const rowDepth = 1;
  return report ? (
    <Box sx={sx.container}>
      <Table content={review.table} sx={sx.table}>
        {getRouteStatus(report).map((page: ReportPageProgress) => {
          return <ChildRow key={page.path} page={page} rowDepth={rowDepth} />;
        })}
      </Table>
    </Box>
  ) : (
    <Box />
  );
};

const sx = {
  container: {
    marginTop: "spacer4",
    table: {
      td: {
        borderBottom: "none",
      },
    },
  },
  table: {
    marginBottom: "spacer5",
    th: {
      padding: "1rem 0 1rem 1rem",
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
      color: "gray",
      fontWeight: "600",
      fontSize: "sm",
      lineHeight: "1.125rem",
      ".mobile &": {
        padding: "0.75rem 0rem",
      },
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
      color: "base",
      "&:last-child": {
        borderBottom: 0,
      },
    },
    td: {
      minWidth: "6rem",
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
      textAlign: "left",
      color: "base",
      "&:nth-of-type(1)": {
        width: "20rem",
      },
      "&:last-of-type": {
        textAlign: "right",
        paddingRight: "spacer1",
      },
    },
  },
};
