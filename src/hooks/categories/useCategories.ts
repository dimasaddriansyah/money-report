import { useEffect, useState } from "react";
import type { Categories } from "../../types/Categories";
import { fetchCategories } from "../../services/CategoryServices";

export function useCategories() {
  const [allCategories, setAllCategories] = useState<Categories[]>([]);
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

        const data = await fetchCategories();
        setAllCategories(data);
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

  return {
    categories: allCategories,
    loading,
    error,
  };
}
