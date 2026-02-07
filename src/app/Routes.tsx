import { Routes, Route } from "react-router-dom";
import Budgets from "../pages/Budgets";
import Insights from "../pages/Insights";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import GenerateForm from "../pages/transactions/GenerateForm";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/budgets" element={<Budgets />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/generate-form" element={<GenerateForm />} />
    </Routes>
  );
}
