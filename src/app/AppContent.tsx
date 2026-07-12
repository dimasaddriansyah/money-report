import { Suspense } from "react";
import AppRoutes from "./Routes";
import { Toaster } from "sonner";
import AppLayout from "../shared/layouts/AppLayout";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import LoginPage from "../features/auth/pages/LoginPage";

export default function AppContent() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-slate-400">
          Loading...
        </div>
      }>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AppRoutes />
              </AppLayout>
            </ProtectedRoute>
          }/>
      </Routes>

      <Toaster position="top-center" richColors />
    </Suspense>
  );
}