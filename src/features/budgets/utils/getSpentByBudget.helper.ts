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
  transactionMap: {
    byCategory: Record<string, number>;
  }
) {
  const key = remark.trim().toLowerCase();

  const mapping = Object.entries(BUDGET_CATEGORY_MAPPING).find(
    ([k]) => k.toLowerCase() === key
  );

  const categories = mapping?.[1] ?? [];

  return categories.reduce((sum, catId) => {
    return sum + (transactionMap.byCategory[catId] ?? 0);
  }, 0);
}