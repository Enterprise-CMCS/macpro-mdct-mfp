import { useContext } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// components
import { Box } from "@chakra-ui/react";
import {
  AdminBannerProvider,
  AdminPage,
  HomePage,
  HelpPage,
  NotFoundPage,
  DashboardPage,
  ProfilePage,
  ReportPageWrapper,
  ReviewSubmitPage,
  ExportedReportPage,
  ReportContext,
} from "components";
// utils
import { ScrollToTopComponent, useStore } from "utils";
// types
import { ReportRoute, ReportType } from "types";
import { useFlags } from "launchdarkly-react-client-sdk";

export const AppRoutes = () => {
  const { userIsAdmin } = useStore().user ?? {};
  const { report } = useStore();
  const { isReportPage } = useContext(ReportContext);

  const { pathname } = useLocation();
  const isExportPage = pathname.includes("/export");
  const hasNav = isReportPage && !isExportPage;
  const boxElement = hasNav ? "div" : "main";

  const abcdReport = useFlags()?.abcdReport;

  return (
    <Box
      as={boxElement}
      id="main-content"
      data-testid="main-content"
      tabIndex={-1}
    >
      <ScrollToTopComponent />
      <AdminBannerProvider>
        <Routes>
          {/* General Routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={!userIsAdmin ? <Navigate to="/profile" /> : <AdminPage />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
          {/* MFP Report Routes */}
          <Route
            path="/wp"
            element={<DashboardPage reportType={ReportType.WP} />}
          />
          <Route path="/wp/export" element={<ExportedReportPage />} />
          <Route
            path="/sar"
            element={<DashboardPage reportType={ReportType.SAR} />}
          />
          <Route path="/sar/export" element={<ExportedReportPage />} />
          {abcdReport && (
            <>
              <Route
                path="/abcd"
                element={<DashboardPage reportType={ReportType.ABCD} />}
              />
              <Route path="/abcd/export" element={<ExportedReportPage />} />
            </>
          )}
          {/* General Report Routes */}
          {report && (
            <>
              {(report.formTemplate.flatRoutes ?? []).map(
                (route: ReportRoute) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<ReportPageWrapper />}
                  />
                )
              )}
            </>
          )}
          <Route path="/reviewSubmit" element={<ReviewSubmitPage />} />
        </Routes>
      </AdminBannerProvider>
    </Box>
  );
};
