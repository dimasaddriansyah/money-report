import { useEffect, useState } from "react";
import type { Accounts } from "../../types/Accounts";
import { fetchAccounts } from "../../services/AccountServices";

export function useAccounts() {
  const [allAccounts, setAllAccounts] = useState<Accounts[]>([]);
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

        const data = await fetchAccounts();
        setAllAccounts(data);
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
    accounts: allAccounts,
    loading,
    error,
  };
}
