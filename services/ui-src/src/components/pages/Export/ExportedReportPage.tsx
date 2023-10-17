// utils
import { useStore } from "utils";
import { ReportType } from "types";
export const ExportedReportPage = () => {
  const { report } = useStore() ?? {};
  const reportType = (report?.reportType ||
    localStorage.getItem("selectedReportType")) as ReportType;

  return <div>Hi! This will be a PDF for {reportType}</div>;
};
