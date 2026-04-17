import { useMemo } from "react";
import type { Category } from "../../categories/types/category";
import type { Transaction } from "../../transactions/types/transaction";

export function useCategoryExpenseData(
  transactions: Transaction[],
  categories: Category[]
) {
  return useMemo(() => {
    const COLORS = ["#5070DD", "#B6D634", "#FF994D", "#0CA8DF", "#505372"];

    const categoryMap = new Map(
      categories.map(c => [c.id, c.name])
    );

    const grouped: Record<string, { total: number; count: number }> = {};

    transactions.forEach((trx) => {
      if (trx.typeId !== "TP002" || !trx.categoryId) return;

      if (!grouped[trx.categoryId]) {
        grouped[trx.categoryId] = { total: 0, count: 0 };
      }

      grouped[trx.categoryId].total += trx.amount;
      grouped[trx.categoryId].count += 1;
    });

    const entries = Object.entries(grouped)
      .map(([categoryId, data]) => ({
        categoryId,
        name: categoryMap.get(categoryId) ?? "Unknown",
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total);

    // 🎯 assign warna ke full list
    const list = entries.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
    }));

    // 🎯 chart (top 4 + others)
    const top4 = list.slice(0, 4);
    const rest = list.slice(4);

    const othersTotal = rest.reduce((sum, item) => sum + item.total, 0);

    const chart = [...top4].map(item => ({
      name: item.name,
      value: item.total,
      color: item.color,
    }));

    if (othersTotal > 0) {
      chart.push({
        name: "Others",
        value: othersTotal,
        color: "#CBD5F5",
      });
    }

    return {
      list,
      chart,
    };
  }, [transactions, categories]);
}