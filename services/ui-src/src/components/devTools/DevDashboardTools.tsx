import { Button, Select, Divider, Text } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { ReportType } from "types";
import { deleteReport, deleteReportsForState, useStore } from "utils";

interface Props {
  reportType: ReportType;
  reload?: Function;
  state?: string;
}

export const DevDashboardTools = ({ reload, state, reportType }: Props) => {
  const [loading, setLoading] = useState(false);
  const { reportsByState } = useStore();
  const [selectedReportId, setSelectedReportId] = useState<string>("");

  if (!reportsByState || !state) return;

  const onDeleteReport = async () => {
    setLoading(true);
    const selectedReport = reportsByState.find(
      (report) => report.id === selectedReportId
    );
    if (selectedReport) {
      await deleteReport(selectedReport);
      if (reload) reload();
    }
    setLoading(false);
  };

  const onDeleteAll = async () => {
    setLoading(true);
    if (!state) return;
    await deleteReportsForState(reportType, state);
    if (reload) reload();
    setLoading(false);
  };

  return (
    <>
      <Text fontWeight="bold">Delete a Report</Text>
      <Select
        placeholder="Select a report to delete"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setSelectedReportId(e.target.value);
        }}
        aria-label="select a report to delete"
      >
        {reportsByState.map((report) => (
          <option key={`${report.id}`} value={`${report.id}`}>
            {report.submissionName}
          </option>
        ))}
      </Select>
      <Button onClick={onDeleteReport} disabled={!selectedReportId || loading}>
        Delete Report
      </Button>
      <Divider />
      <Text>Delete all the reports for {reportType}</Text>
      <Button onClick={onDeleteAll} disabled={loading}>
        Delete All Reports
      </Button>
    </>
  );
};
