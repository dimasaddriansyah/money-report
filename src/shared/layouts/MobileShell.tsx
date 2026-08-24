import { useLocation, matchPath } from "react-router-dom";
import NavigationBottomMobile from "../navigation/NavigationBottomMobile";

export default function MobileShell({ children }: any) {
  const location = useLocation();

  const pathname = location.pathname;

  const hiddenRoutes = ["/generate-form"];

  const hideBottomNav =
    matchPath("/account/*", pathname) ||
    matchPath("/category/*", pathname) ||
    matchPath("/budget/*", pathname) ||
    matchPath("/transaction/*", pathname) ||
    hiddenRoutes.includes(pathname);

  return (
    <div className="min-h-screen">
      <main className="pb-22">{children}</main>

      {!hideBottomNav && <NavigationBottomMobile />}
    </div>
  );
}