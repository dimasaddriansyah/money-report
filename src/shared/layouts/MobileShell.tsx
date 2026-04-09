import { useLocation, matchPath } from "react-router-dom";
import BottomNav from "../../components/navigation/BottomNav";

export default function MobileShell({ children }: any) {
  const location = useLocation();

  const hiddenRoutes = ["/generate-form"];

  const hideBottomNav =
    matchPath("/transaction/*", location.pathname) ||
    matchPath("/budget/*", location.pathname) ||
    hiddenRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="pb-20">{children}</main>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}