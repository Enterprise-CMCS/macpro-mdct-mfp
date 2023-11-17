// components
import { Box, Heading } from "@chakra-ui/react";
// utils
import { useStore } from "utils";
import { ModalDrawerReportPageShape } from "types";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: Props) => {
  const { report } = useStore() ?? {};
  const entities = report?.fieldData?.[entityType];

  return (
    <Box
      mt="2rem"
      data-testid="exportedModalDrawerReportSection"
      sx={sx.container}
    >
      <Heading as="h2" sx={sx.dashboardTitle} data-testid="headerCount">
        {/* {verbiage.pdfDashboardTitle} */}
        {/* TODO delete this */}
        Transition Benchmark Totals
        <br />
        {verbiage.dashboardTitle}
      </Heading>
      <Box sx={sx.border}>
        THIS IS WHERE THE TRANSITION BENCHMARK TOTALS WILL GO
        <br />
        {JSON.stringify(entities)}
      </Box>
    </Box>
  );
};

export interface Props {
  section: ModalDrawerReportPageShape;
}

const sx = {
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
  },
  notAnswered: {
    display: "block",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.error_darker",
    marginTop: "0.5rem",
  },
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  // TODO: delete this
  border: {
    border: "10px solid black",
  },
};
