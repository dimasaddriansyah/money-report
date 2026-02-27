import { useEffect, useMemo, useState } from "react";
import type { Budgets } from "../../types/Budgets";
import { fetchBudgets } from "../../services/BudgetServices";

export function useBudgets(startDate?: Date, endDate?: Date) {
  const [allBudgets, setAllBudgets] = useState<Budgets[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ===========================================================================
  // FETCH DATA (ONLY ONCE)
  // ===========================================================================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchBudgets();
        setAllBudgets(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ===========================================================================
  // FILTER FOR PERIOD VIEW
  // ===========================================================================
  const periodBudgets = useMemo(() => {
    if (!startDate || !endDate) return allBudgets;

    return allBudgets.filter((row) => {
      const rowDate = new Date(row.date);
      return rowDate >= startDate && rowDate <= endDate;
    });
  }, [allBudgets, startDate, endDate]);

  return {
    budgets: periodBudgets,
    loading,
    error,
  };
}
