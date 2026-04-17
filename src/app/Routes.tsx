import { Routes, Route } from "react-router-dom";
import Settings from "../pages/Settings";
import { lazy } from "react";
import AccountCreatePage from "../features/accounts/pages/AccountCreatePage";
import AccountEditPage from "../features/accounts/pages/AccountEditPage";
import AccountPage from "../features/accounts/pages/AccountPage";
import CategoryPage from "../features/categories/pages/CategoryPage";
import CategoryEditPage from "../features/categories/pages/CategoryEditPage";
import CategoryCreatePage from "../features/categories/pages/CategoryCreatePage";
import TransactionPage from "../features/transactions/pages/TransactionPage";
import TransactionCreatePage from "../features/transactions/pages/TransactionCreatePage";
import TransactionEditPage from "../features/transactions/pages/TransactionEditPage";
import BudgetCreatePage from "../features/budgets/pages/BudgetCreatePage";
import BudgetEditPage from "../features/budgets/pages/BudgetEditPage";
import BudgetPage from "../features/budgets/pages/BudgetPage";

const DashboardPage = lazy(() => import("../features/dashboards/pages/DashboardPage"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/transactions" element={<TransactionPage />} />
      <Route path="/transaction/create" element={<TransactionCreatePage />} />
      <Route path="/transaction/edit/:id" element={<TransactionEditPage />} />
      <Route path="/budgets" element={<BudgetPage />} />
      <Route path="/budget/create" element={<BudgetCreatePage />} />
      <Route path="/budget/edit/:id" element={<BudgetEditPage />} />
      <Route path="/accounts" element={<AccountPage />} />
      <Route path="/account/create" element={<AccountCreatePage />} />
      <Route path="/account/edit/:id" element={<AccountEditPage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/category/create" element={<CategoryCreatePage />} />
      <Route path="/category/edit/:id" element={<CategoryEditPage />} />
    </Routes>
  );
}
