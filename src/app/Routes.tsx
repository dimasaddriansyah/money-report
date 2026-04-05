import { Routes, Route } from "react-router-dom";
import Budgets from "../pages/budgets/Budgets";
import Insights from "../pages/Insights";
import Settings from "../pages/Settings";
import GenerateForm from "../pages/transactions/GenerateForm";
import { lazy } from "react";
import TransactionFormPage from "../pages/transactions/TransactionFormPage";
import BudgetFormPages from "../pages/budgets/BudgetFormPage";
import Accounts from "../pages/accounts/Accounts";
import Categories from "../pages/categories/Categories";
import Transactions from "../pages/transactions/Transactions";

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
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/categories" element={<Categories />} />
    </Routes>
  );
}
