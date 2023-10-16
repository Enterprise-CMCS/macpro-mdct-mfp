import { Navigate, Route, Routes } from "react-router-dom";
import { useFlags } from "launchdarkly-react-client-sdk";
// components
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
} from "components";
// utils
import { ScrollToTopComponent, useStore } from "utils";
// types
import { ReportRoute, ReportType } from "types";

export const AppRoutes = () => {
  const { userIsAdmin } = useStore().user ?? {};
  const { report } = useStore();

  // LaunchDarkly
  const wpReport = true; //useFlags()?.wpReport;
  const sarReport = useFlags().sarReport;

  return (
    <main id="main-content" tabIndex={-1}>
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
          {wpReport && (
            <>
              <Route
                path="/wp"
                element={<DashboardPage reportType={ReportType.WP} />}
              />
              {/* TODO check for report access w userReportAccess */}
              <Route path="/wp/export" element={<ExportedReportPage />} />
            </>
          )}
          {sarReport && (
            <>
              <Route
                path="/sar"
                element={<DashboardPage reportType={ReportType.SAR} />}
              />
              {/* TODO check for report access w userReportAccess */}
              <Route path="/sar/export" element={<ExportedReportPage />} />
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
    </main>
  );
};
