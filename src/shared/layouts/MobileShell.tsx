import { useLocation, matchPath, useNavigate } from "react-router-dom";
import { PlusSignIcon, Settings01Icon } from "hugeicons-react";
import NavigationBottomMobile from "../navigation/NavigationBottomMobile";
import NavigationHeaderMobile from "../navigation/NavigationHeaderMobile";

export default function MobileShell({ children }: any) {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;

  const hiddenRoutes = ["/generate-form"];

  const hideBottomNav =
    matchPath("/account/*", pathname) ||
    matchPath("/category/*", pathname) ||
    matchPath("/budget/*", pathname) ||
    matchPath("/transaction/*", pathname) ||
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
        rightIcon: <PlusSignIcon size={20} />,
        onRightIconClick: () => navigate("/account/create"),
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
        rightIcon: <PlusSignIcon size={20} />,
        onRightIconClick: () => navigate("/category/create"),
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

      <main className="pb-22">{children}</main>

      {!hideBottomNav && <NavigationBottomMobile />}
    </div>
  );
}