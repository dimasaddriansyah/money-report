import { Suspense } from "react";
import AppRoutes from "./Routes";
import { Toaster } from "sonner";
import AppLayout from "../shared/layouts/AppLayout";

export default function AppContent() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-slate-400">
          Loading...
        </div>
      }
    >
      <AppLayout>
        <AppRoutes />
      </AppLayout>

      <Toaster position="top-center" richColors />
    </Suspense>
  );
}