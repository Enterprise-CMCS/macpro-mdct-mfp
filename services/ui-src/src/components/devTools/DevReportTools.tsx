import { useLocation } from "react-router";
import { useStore } from "utils";
import { Button, Text } from "@chakra-ui/react";
import { ReportContext } from "components/reports/ReportProvider";
import { useContext } from "react";
import { ReportStatus } from "types";
import { fillWorkPlanPage } from "./utils/wp";

const saveReport = async (
  report: { reportType: string; state: string; id: string },
  full_name: string,
  fieldData: any,
  updateReport: Function
) => {
  if (!fieldData) return;

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

  const fillReport = () => {
    let newFieldData = structuredClone(report?.fieldData!);
    report?.formTemplate.flatRoutes?.forEach((route) => {
      newFieldData = {
        ...newFieldData,
        ...fillWorkPlanPage(route, newFieldData),
      };
    });
    saveReport(report!, full_name!, newFieldData, updateReport);
  };

  const getReportAnswers = (reportType: string) => {
    switch (reportType) {
      case "WP":
        return fillWorkPlanPage(currentPage!, report?.fieldData!);
    }
  };

  return (
    <>
      <Text fontWeight="bold">{currentPage?.name}</Text>
      {currentPage?.pageType === "reviewSubmit" ? (
        <>
          <Text>
            Click the [Fill Report] button to autofill the whole report
          </Text>
          <Button onClick={fillReport}>Fill Report</Button>
        </>
      ) : (
        <>
          <Text>Click the [Auto Fill Page] button to autofill the page</Text>
          <Button
            onClick={() => {
              saveReport(
                report!,
                full_name!,
                getReportAnswers(report?.reportType!),
                updateReport
              );
            }}
          >
            Auto Fill Page
          </Button>
        </>
      )}
    </>
  );
};
