import { useLocation } from "react-router";
import { useStore } from "utils";
import { Button, Text } from "@chakra-ui/react";
import { ReportContext } from "components/reports/ReportProvider";
import { useContext, useState } from "react";
import { ReportStatus } from "types";
import { fillWorkPlanPage } from "./utils/wp";
import { fillSARPage } from "./utils/sar";

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
  const { report, selectedEntity } = useStore();
  const { full_name } = useStore().user ?? {};
  const { pathname } = useLocation();
  const currentPage = report?.formTemplate.flatRoutes?.find((route) =>
    route.path.includes(pathname)
  );
  const { updateReport } = useContext(ReportContext);
  const [loading, setLoading] = useState(false);

  const fillReport = async () => {
    setLoading(true);
    let newFieldData = structuredClone(report?.fieldData!);
    report?.formTemplate.flatRoutes?.forEach((route) => {
      newFieldData = {
        ...newFieldData,
        ...fillWorkPlanPage(route, newFieldData),
      };
    });
    await saveReport(report!, full_name!, newFieldData, updateReport);
    setLoading(false);
  };

  const getReportAnswers = (reportType: string) => {
    switch (reportType) {
      case "WP":
        return fillWorkPlanPage(currentPage!, report?.fieldData!);
      case "SAR":
        return fillSARPage(currentPage!, report?.fieldData!);
    }
  };

  const renderView = () => {
    //TODO: update when we add actually path url for init pages
    if (selectedEntity) {
      return <Text>No tools avaliable for this page</Text>;
    }
    return (
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
          disabled={loading}
        >
          Auto Fill Page
        </Button>
      </>
    );
  };

  return (
    <>
      <Text fontWeight="bold">{currentPage?.name}</Text>
      {currentPage?.pageType === "reviewSubmit" ? (
        <>
          <Text>
            Click the [Fill Report] button to autofill the whole report
          </Text>
          <Button onClick={fillReport} disabled={loading}>
            Fill Report
          </Button>
        </>
      ) : (
        renderView()
      )}
    </>
  );
};
