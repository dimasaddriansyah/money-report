import { useEffect, useMemo, useState } from "react";
import type { Budgets } from "../../types/Budgets";
import { fetchBudgets } from "../../services/BudgetServices";
import { API_URL } from "../../services/APIServices";
import { toast } from "sonner";

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

  // =========================================================
  // DELETE (OPTIMISTIC UPDATE)
  // =========================================================
  const deleteBudget = async (id: string) => {
    const payload = {
      module: "budgets",
      action: "delete",
      budget_id: id,
    };

    const previousState = allBudgets;

    setAllBudgets((prev) => prev.filter((t) => t.budget_id !== id));

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Success", {
          description: result.message,
          duration: 2000,
        });
        return true;
      }
      setAllBudgets(previousState);
      toast.error("Something went wrong!", {
        duration: 2000,
      });
      return false;
    } catch (error) {
      console.error(error);
      setAllBudgets(previousState);
      return false;
    }
  };

  return {
    budgets: periodBudgets,
    loading,
    error,
    deleteBudget,
  };
}
