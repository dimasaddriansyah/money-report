import { HashRouter, matchPath, useLocation } from "react-router-dom";
import { Suspense } from "react";
import AppRoutes from "./Routes";
import BottomNav from "../components/navigation/BottomNav";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import { Toaster } from "sonner";

function AppContent() {
  const location = useLocation();

  const hideBottomNav =
    matchPath("/transaction/*", location.pathname) ||
    location.pathname === "/generate-form";

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AppRoutes />
      {!hideBottomNav && <BottomNav />}
      <Toaster
        position="top-center"
        richColors
      />
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
