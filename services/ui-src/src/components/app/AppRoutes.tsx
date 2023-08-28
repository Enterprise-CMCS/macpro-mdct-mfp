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
import { ScrollToTopComponent, useUserStore } from "utils";
// types
import { ReportType } from "types";

export const AppRoutes = () => {
  const { userIsAdmin } = useUserStore().user ?? {};

  // LaunchDarkly
  const wpReport = useFlags()?.wpReport;
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
          <Route path="/standard" element={<ReportPageWrapper />} />
          <Route path="/reviewSubmit" element={<ReviewSubmitPage />} />
          {/* Temporary Page Routes */}
          <Route
            path="/wp/transition-benchmarks"
            element={<ReportPageWrapper />}
          />
        </Routes>
      </AdminBannerProvider>
    </main>
  );
};
