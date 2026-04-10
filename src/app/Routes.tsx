import { Routes, Route } from "react-router-dom";
import Budgets from "../pages/budgets/Budgets";
import Insights from "../pages/Insights";
import Settings from "../pages/Settings";
import GenerateForm from "../pages/transactions/GenerateForm";
import { lazy } from "react";
import TransactionFormPage from "../pages/transactions/TransactionFormPage";
import BudgetFormPages from "../pages/budgets/BudgetFormPage";
import Transactions from "../pages/transactions/Transactions";
import AccountCreatePage from "../features/accounts/pages/AccountCreatePage";
import AccountEditPage from "../features/accounts/pages/AccountEditPage";
import AccountPage from "../features/accounts/pages/AccountPage";
import CategoryPage from "../features/categories/pages/CategoryPage";
import CategoryEditPage from "../features/categories/pages/CategoryEditPage";
import CategoryCreatePage from "../features/categories/pages/CategoryCreatePage";

const Dashboard = lazy(() => import("../pages/Dashboard"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/generate-form" element={<GenerateForm />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/transaction/create" element={<TransactionFormPage />} />
      <Route path="/transaction/edit/:id" element={<TransactionFormPage />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/budgets" element={<Budgets />} />
      <Route path="/budget/create" element={<BudgetFormPages />} />
      <Route path="/budget/edit/:id" element={<BudgetFormPages />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/accounts" element={<AccountPage />} />
      <Route path="/account/create" element={<AccountCreatePage />} />
      <Route path="/account/edit/:id" element={<AccountEditPage />} />
      <Route path="/categories" element={<CategoryPage />} />
      <Route path="/category/create" element={<CategoryCreatePage />} />
      <Route path="/category/edit/:id" element={<CategoryEditPage />} />
    </Routes>
  );
}
