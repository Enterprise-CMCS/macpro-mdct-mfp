import { Navigate, Route, Routes } from "react-router-dom";
import { useFlags } from "launchdarkly-react-client-sdk";
// components
import {
  AdminBannerProvider,
  AdminPage,
  HomePage,
  NotFoundPage,
  DashboardPage,
  ProfilePage,
  ReportPageWrapper,
  ReviewSubmitPage,
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
          <Route path="*" element={<NotFoundPage />} />
          {/* MFP Report Routes */}
          {wpReport && (
            <Route
              path="/wp"
              element={<DashboardPage reportType={ReportType.WP} />}
            />
          )}
          {sarReport && (
            <Route
              path="/sar"
              element={<DashboardPage reportType={ReportType.SAR} />}
            />
          )}
          {/* General Report Routes */}
          {report?.reportType === ReportType.WP && (
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
