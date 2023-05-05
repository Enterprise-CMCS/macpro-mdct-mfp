import { Route, Routes } from "react-router-dom";
// components
import { HomePage, NotFoundPage } from "components";
// utils
import { ScrollToTopComponent } from "utils";

export const AppRoutes = () => {
  return (
    <main id="main-content" tabIndex={-1}>
      <ScrollToTopComponent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
};
