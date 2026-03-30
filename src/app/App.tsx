import { HashRouter, matchPath, useLocation } from "react-router-dom";
import { Suspense } from "react";
import AppRoutes from "./Routes";
import BottomNav from "../components/navigation/BottomNav";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import { Toaster } from "sonner";

function AppContent() {
  const location = useLocation();

  const hiddenRoutes = ["/generate-form"];

  const hideBottomNav =
    matchPath("/transaction/*", location.pathname) ||
    matchPath("/budget/*", location.pathname) ||
    hiddenRoutes.includes(location.pathname);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {/* TABLET + DESKTOP */}
      <div className="hidden md:flex min-h-screen">
        <div className="flex-1 bg-slate-50">
          <AppRoutes />
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden">
        <AppRoutes />
        {!hideBottomNav && <BottomNav />}
      </div>

      <Toaster position="bottom-center" richColors />
    </Suspense>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
