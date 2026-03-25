import {
  FireIcon,
  SparklesIcon,
  MoneySavingJarIcon,
  Settings02Icon,
} from "hugeicons-react";

export const NAV_MENUS = [
  {
    labelMobile: "Home",
    labelDesktop: "Dashboard",
    path: "/",
    Icon: FireIcon,
  },
  {
    labelMobile: "Insights",
    labelDesktop: "Insights",
    path: "/insights",
    Icon: SparklesIcon,
  },
  {
    labelMobile: "Budgets",
    labelDesktop: "Budgets",
    path: "/budgets",
    Icon: MoneySavingJarIcon,
  },
  {
    labelMobile: "Settings",
    labelDesktop: "Settings",
    path: "/settings",
    Icon: Settings02Icon,
  },
];
