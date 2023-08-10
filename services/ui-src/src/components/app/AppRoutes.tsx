import { Route, Routes } from "react-router-dom";
// components
import { HomePage, NotFoundPage, ReportPageWrapper } from "components";
// utils
import { ScrollToTopComponent } from "utils";
import { mockStandardReportPageJson } from "utils/testing/mockForm";

export const AppRoutes = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <ScrollToTopComponent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/standard" element={<ReportPageWrapper />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};
