import { Button, Select, Divider, Text } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { DropdownOptions } from "types";
import { deleteReport, useStore } from "utils";

interface Props {
  reload?: Function;
  state?: string;
  datasets: DropdownOptions[];
}

export const DevDashboardTools = ({ reload, state }: Props) => {
  const [loading, setLoading] = useState(false);
  const { reportsByState } = useStore();
  const [selectedReport, setSelectedReport] = useState<string>("");
  const reportType = "WP";

  if (!reportsByState) return;

  const onDeleteReport = async () => {
    setLoading(true);
    const [state, id] = selectedReport.split("#"); // split value from select option below
    await deleteReport({ reportType, state, id });
    if (reload) reload(reportType, state);
    setLoading(false);
  };

  const onDeleteAll = async () => {
    setLoading(true);
    if (!state) return;
    if (reload) reload();
    setLoading(false);
  };

  return (
    <>
      <Text fontWeight="bold">Delete a Report</Text>
      <Select
        placeholder="Select a report to delete"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setSelectedReport(e.target.value);
        }}
        aria-label="select a report to delete"
      >
        {reportsByState.map((report) => (
          <option key={`${report.id}`} value={`${report.id}`}>
            {report.submissionName}
          </option>
        ))}
      </Select>
      <Button onClick={onDeleteReport} disabled={!selectedReport || loading}>
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
