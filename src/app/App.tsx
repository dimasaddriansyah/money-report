import { HashRouter, useLocation } from "react-router-dom";
import AppRoutes from "./Routes";
import BottomNav from "../components/layout/BottomNav";

function AppContent() {
  const location = useLocation();

  // route yang TIDAK ingin menampilkan BottomNav
  const hideNavRoutes = ["/generate-form","/transaction/create"];

  const hideBottomNav = hideNavRoutes.includes(location.pathname);

  return (
    <>
      <AppRoutes />
      {!hideBottomNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
