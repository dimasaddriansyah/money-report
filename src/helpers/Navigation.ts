import {
  CreditCardIcon,
  FireIcon,
  Invoice01Icon,
  MoneySavingJarIcon,
  Note05Icon,
} from "hugeicons-react";

type NavItem =
  | {
    type: "menu";
    labelDesktop: string;
    path: string;
    icon?: any;
  }
  | {
    type: "label";
    label: string;
  };

export const NAV_MENUS_DESKTOP: NavItem[] = [
  {
    type: "menu",
    labelDesktop: "Dashboard",
    path: "/",
    icon: FireIcon,
  },

  {
    type: "label",
    label: "MASTER DATA",
  },
  {
    type: "menu",
    labelDesktop: "Accounts",
    path: "/accounts",
    icon: CreditCardIcon
  },
  {
    type: "menu",
    labelDesktop: "Categories",
    path: "/categories",
    icon: Note05Icon
  },
  {
    type: "label",
    label: "TRANSACTIONS",
  },
  {
    type: "menu",
    labelDesktop: "Transactions",
    path: "/transactions",
    icon: Invoice01Icon,
  },
  {
    type: "menu",
    labelDesktop: "Budgets",
    path: "/budgets",
    icon: MoneySavingJarIcon,
  },
];