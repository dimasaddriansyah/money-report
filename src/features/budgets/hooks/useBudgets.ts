import { useCallback, useEffect, useState } from "react";
import type { Budget } from "../types/budget";
import { fetchBudgets } from "../services/BudgetService";

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchBudgets();
      setBudgets(result.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load budgets");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  return {
    budgets,
    loading,
    error,
    refetch: loadBudgets,
  };
}