const BUDGET_CATEGORY_MAPPING: Record<string, string[]> = {
  "Makan Pribadi": ["CAT001"],
  "Token Listrik": ["CAT004"],
  "Kuota": ["CAT005"],
  "Bensin": ["CAT006"],
  "Service MX King": ["CAT014"],
  "Uang Bersama": ["CAT001"],
};

export function getSpentByBudget(
  remark: string,
  accountId: string | undefined,
  transactionMap: {
    byCategoryAccount: Record<string, number>;
    byCategory: Record<string, number>;
  }
) {
  if (!transactionMap) return 0;

  const key = remark.trim().toLowerCase();

  const mapping = Object.entries(BUDGET_CATEGORY_MAPPING).find(
    ([k]) => k.toLowerCase() === key
  );

  const categories = mapping?.[1] ?? [];

  if (accountId && categories.length) {
    let total = 0;

    for (const cat of categories) {
      const key = `${cat}__${accountId}`;
      total += transactionMap.byCategoryAccount[key] ?? 0;
    }

    return total;
  }

  if (categories.length) {
    return categories.reduce((sum, catId) => {
      return sum + (transactionMap.byCategory[catId] ?? 0);
    }, 0);
  }

  return 0;
}