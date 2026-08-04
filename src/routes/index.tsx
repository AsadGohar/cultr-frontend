import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "./routeConfig";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { RootLayout } from "@/layouts/RootLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/old-home" element={<Navigate to={ROUTES.HOME} replace />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
