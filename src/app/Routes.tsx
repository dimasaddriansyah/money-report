import { Routes, Route } from "react-router-dom";
import Budgets from "../pages/budgets/Budgets";
import Insights from "../pages/Insights";
import Settings from "../pages/Settings";
import GenerateForm from "../pages/transactions/GenerateForm";
import { lazy } from "react";
import TransactionFormPage from "../pages/transactions/TransactionFormPage";
import BudgetFormPages from "../pages/budgets/BudgetFormPage";
import Categories from "../pages/categories/Categories";
import Transactions from "../pages/transactions/Transactions";
import AccountsPage from "../features/accounts/pages/AccountsPage";
import AccountCreatePage from "../features/accounts/pages/AccountCreatePage";
import AccountEditPage from "../features/accounts/pages/AccountEditPage";

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
      <Route path="/accounts" element={<AccountsPage />} />
      <Route path="/account/create" element={<AccountCreatePage />} />
      <Route path="/account/edit/:id" element={<AccountEditPage />} />
      <Route path="/categories" element={<Categories />} />
    </Routes>
  );
}
