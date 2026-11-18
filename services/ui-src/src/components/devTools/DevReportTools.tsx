import { useLocation } from "react-router";
import { useStore } from "utils";
import { Button, Text } from "@chakra-ui/react";
import { ReportContext } from "components/reports/ReportProvider";
import { useContext } from "react";
import { ReportStatus } from "types";
import { workplanTools } from "./WPUtil";

const saveReport = async (
  report: { reportType: string; state: string; id: string },
  full_name: string,
  fieldData: any,
  updateReport: Function
) => {
  const reportKeys = {
    reportType: report.reportType,
    state: report.state,
    id: report.id,
  };

  const dataToWrite = {
    metadata: {
      status: ReportStatus.IN_PROGRESS,
      lastAlteredBy: full_name,
    },
    fieldData: fieldData,
  };
  await updateReport(reportKeys, dataToWrite);
};

export const DevReportTools = () => {
  const { report } = useStore();
  const { full_name } = useStore().user ?? {};
  const { pathname } = useLocation();
  const currentPage = report?.formTemplate.flatRoutes?.find((route) =>
    route.path.includes(pathname)
  );
  const { updateReport } = useContext(ReportContext);

  //figure out what page i'm on
  return (
    <>
      <Text fontWeight="bold">Current Page: {currentPage?.name}</Text>
      <Button
        onClick={() => {
          saveReport(
            report!,
            full_name!,
            workplanTools(currentPage!, report?.fieldData!),
            updateReport
          );
        }}
      >
        Fill Page
      </Button>
    </>
  );
};
