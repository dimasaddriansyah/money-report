import { Routes, Route } from "react-router-dom";
import Budgets from "../pages/budgets/Budgets";
import Insights from "../pages/Insights";
import Settings from "../pages/Settings";
import GenerateForm from "../pages/transactions/GenerateForm";
import { lazy } from "react";
import TransactionPage from "../pages/transactions/TransactionPage";
import BudgetCreate from "../pages/budgets/BudgetCreate";

const Dashboard = lazy(() => import("../pages/Dashboard"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/budgets" element={<Budgets />} />
      <Route path="/budget/create" element={<BudgetCreate />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/generate-form" element={<GenerateForm />} />
      <Route path="/transaction/create" element={<TransactionPage />} />
      <Route path="/transaction/edit/:id" element={<TransactionPage />} />
    </Routes>
  );
}
