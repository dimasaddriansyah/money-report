import { useEffect, useState } from "react";
import { fetchBudgets } from "../services/BudgetService";
import type { Budget } from "../types/budget";

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadBudgets() {
    try {
      setLoading(true);
      const data = await fetchBudgets();
      setBudgets(data);
    } catch (err) {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBudgets();
  }, []);

  return {
    budgets,
    loading,
    error,
    refetch: loadBudgets,
  };
}