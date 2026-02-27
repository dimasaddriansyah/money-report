import { useMemo } from "react";
import type { Budgets } from "../../types/Budgets";
import type { Transactions } from "../../types/Transactions";

export type BudgetDetailStatus =
  | "NOT_USED"
  | "IN_PROGRESS"
  | "DONE"
  | "OVER";

interface ResultItem {
  budget: Budgets;
  used: number;
  status: BudgetDetailStatus;
  percentage: number;
}

export function useBudgetDetailStatus(
  items: Budgets[],
  transactions: Transactions[],
) {
  return useMemo(() => {

    let totalTopUp = 0;
    const investmentOutByProduct: Record<string, number> = {};

    // 🔥 Single pass transaction
    for (const trx of transactions) {

      if (trx.type !== "transfer") continue;

      // 🔵 Internal Transfer VALID
      if (
        trx.category === "Internal Transfer" &&
        trx.from_account === "Blu by BCA" &&
        trx.to_account === "Investment"
      ) {
        totalTopUp += trx.nominal;
      }

      // 🟢 Investment Product
      if (
        trx.category === "Investment" &&
        trx.from_account === "Investment"
      ) {
        investmentOutByProduct[trx.remark] =
          (investmentOutByProduct[trx.remark] || 0) +
          trx.nominal;
      }
    }

    const totalInvestmentOut = Object.values(investmentOutByProduct)
      .reduce((sum, val) => sum + val, 0);

    // 🔥 Map items
    return items.map<ResultItem>((item) => {

      let used = 0;

      // Married Saving = saldo Investment
      if (item.remark === "Married Saving") {
        used = totalTopUp - totalInvestmentOut;
      }
      // Product Investment (Bibit, RDPU, dll)
      else if (investmentOutByProduct[item.remark]) {
        used = investmentOutByProduct[item.remark];
      }
      // Expense normal (non-investment account)
      else {
        used = transactions
          .filter(
            (trx) =>
              trx.type === "expenses" &&
              trx.from_account === item.account &&
              trx.remark === item.remark,
          )
          .reduce((sum, trx) => sum + trx.nominal, 0);
      }

      let status: BudgetDetailStatus;

      if (used === 0) {
        status = "NOT_USED";
      } else if (used >= item.nominal) {
        status = used > item.nominal ? "OVER" : "DONE";
      } else {
        status = "IN_PROGRESS";
      }

      const percentage =
        item.nominal > 0
          ? Math.min(Math.floor((used / item.nominal) * 100), 100)
          : 0;

      return {
        budget: item,
        used,
        status,
        percentage,
      };
    });

  }, [items, transactions]);
}