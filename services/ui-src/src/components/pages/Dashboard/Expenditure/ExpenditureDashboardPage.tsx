import React from "react";
import { DashboardPage } from "components";
import { ReportType } from "types";

export const ExpenditureDashboardPage = () => {
  return (
    <DashboardPage reportType={ReportType.EXPENDITURE} showFilter={true} />
  );
};
