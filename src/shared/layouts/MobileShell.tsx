import { useLocation, matchPath } from "react-router-dom";
import BottomNavigationMobile from "../navigation/BottomNavigationMobile";
import HeaderNavigationMobile from "../navigation/HeaderNavigationMobile";
import { Settings01Icon } from "hugeicons-react";

export default function MobileShell({ children }: any) {
  const location = useLocation();

  const hiddenRoutes = ["/generate-form"];

  const hideBottomNav =
    matchPath("/transaction/*", location.pathname) ||
    matchPath("/budget/*", location.pathname) ||
    hiddenRoutes.includes(location.pathname);

  // 🔥 mapping header per route
  const getHeaderConfig = () => {
    if (matchPath("/transactions", location.pathname)) {
      return {
        title: "Transactions",
        showBack: true,
        rightIcon: <Settings01Icon size={20} />,
      };
    }

    if (matchPath("/accounts", location.pathname)) {
      return {
        title: "Accounts",
        showBack: true,
      };
    }

    if (matchPath("/budget", location.pathname)) {
      return {
        title: "Budget",
      };
    }

    if (matchPath("/transaction/*", location.pathname)) {
      return {
        title: "Detail",
        showBack: true,
      };
    }

    return {
      title: "App",
    };
  };

  const headerConfig = getHeaderConfig();

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderNavigationMobile {...headerConfig} />

      <main className="pb-28">{children}</main>

      {!hideBottomNav && <BottomNavigationMobile />}
    </div>
  );
}