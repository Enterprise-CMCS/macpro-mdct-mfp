import { Navigate, Route, Routes } from "react-router-dom";
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
          {/* MFP ROUTES */}
          <Route
            path="/wp"
            element={<DashboardPage reportType={ReportType.WP} />}
          />
          {/* Report Routes */}
          <Route path="/standard" element={<ReportPageWrapper />} />
          <Route
            path="/wp/state-specific-initiatives-instructions"
            element={<ReportPageWrapper />}
          />
          <Route path="/reviewSubmit" element={<ReviewSubmitPage />} />
        </Routes>
      </AdminBannerProvider>
    </main>
  );
};
