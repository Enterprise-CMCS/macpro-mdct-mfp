import { Navigate, Route, Routes } from "react-router-dom";
// components
import {
  AdminPage,
  HomePage,
  NotFoundPage,
  ReportPageWrapper,
  ReviewSubmitPage,
} from "components";
// utils
import { ScrollToTopComponent, useUserStore } from "utils";

export const AppRoutes = () => {
  const { userIsAdmin } = useUserStore().user ?? {};

  return (
    <main id="main-content" tabIndex={-1}>
      <ScrollToTopComponent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin"
          element={!userIsAdmin ? <Navigate to="/profile" /> : <AdminPage />}
        />
        <Route path="/standard" element={<ReportPageWrapper />} />
        <Route path="/reviewSubmit" element={<ReviewSubmitPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};
