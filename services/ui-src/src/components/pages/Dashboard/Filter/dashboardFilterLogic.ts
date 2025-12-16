import { ReportMetadataShape } from "types";

export const filterYearOptions = [
  { label: "All", value: "All" },
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
];

export const filterQuarterOptions = [
  { label: "All", value: "All" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

export const handleExpenditureFilter = (
  filterYear: string,
  filterQuarter: string,
  listOfReports?: ReportMetadataShape[]
) =>
  (listOfReports || []).filter((report) => {
    const yearMatch =
      filterYear === "All" || String(report.reportYear) === filterYear;
    // TODO: Change from reportPeriod to quarter when backend is updated
    const quarterMatch =
      filterQuarter === "All" || String(report.reportPeriod) === filterQuarter;
    return yearMatch && quarterMatch;
  });
