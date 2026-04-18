import { useLocation, matchPath } from "react-router-dom";
import { Settings01Icon } from "hugeicons-react";
import NavigationBottomMobile from "../navigation/NavigationBottomMobile";
import NavigationHeaderMobile from "../navigation/NavigationHeaderMobile";

export default function MobileShell({ children }: any) {
  const location = useLocation();

  const pathname = location.pathname;

  const hiddenRoutes = ["/generate-form"];

  const hideBottomNav =
    matchPath("/transaction/*", pathname) ||
    matchPath("/budget/*", pathname) ||
    hiddenRoutes.includes(pathname);

  const headerConfig = (() => {
    if (matchPath("/account/*", pathname)) {
      return {
        title: "Accounts",
        showBack: true,
      };
    }

    if (matchPath("/accounts", pathname)) {
      return {
        title: "Accounts",
        rightIcon: <Settings01Icon size={20} />,
        showBack: true,
      };
    }

    if (matchPath("/category/*", pathname)) {
      return {
        title: "Categories",
        showBack: true,
      };
    }

    if (matchPath("/categories", pathname)) {
      return {
        title: "Categories",
        rightIcon: <Settings01Icon size={20} />,
        showBack: true,
      };
    }

    if (matchPath("/transaction/generate/form", pathname)) {
      return {
        title: "Generate Transactions",
        showBack: true,
      };
    }

    if (matchPath("/transaction/*", pathname)) {
      return {
        title: "Transactions",
        showBack: true,
      };
    }

    if (matchPath("/transactions", pathname)) {
      return {
        title: "Transactions",
        rightIcon: <Settings01Icon size={20} />,
      };
    }

    if (matchPath("/budget/*", pathname)) {
      return {
        title: "Budgets",
        showBack: true,
      };
    }

    if (matchPath("/budgets", pathname)) {
      return {
        title: "Budgets",
        rightIcon: <Settings01Icon size={20} />,
      };
    }

    return {
      title: "App",
    };
  })();

  return (
    <div className="min-h-screen">
      <NavigationHeaderMobile {...headerConfig} />

      <main className="pb-28">{children}</main>

      {!hideBottomNav && <NavigationBottomMobile />}
    </div>
  );
}