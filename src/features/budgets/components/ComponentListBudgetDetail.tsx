import { useState } from "react";
import { useBalance } from "../../../shared/context/BalanceContext";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import { getSpentByBudget } from "../utils/getSpentByBudget.helper";
import ComponentBudgetItem from "./ComponentBudgetItem";

type Props = {
  grouped: {
    accountId: string;
    accountName: string;
    total: number;
    budgets: {
      id: string;
      remark: string;
      amount: number;
    }[];
  }[];
  transactionMap: {
    byRemark: Record<string, number>;
    byAccount: Record<string, number>;
    byCategory: Record<string, number>;
    byCategoryAccount: Record<string, number>;
  };
};

export default function ComponentListBudgetDetail({ grouped, transactionMap }: Props) {
  const { hideBalance } = useBalance();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {grouped.map((group) => (
        <div key={group.accountId}>
          <div className="flex justify-between px-4 py-3 bg-slate-100">
            <div className="flex items-center gap-3">
              <img src={getAccountsImg(group.accountName)} alt={group.accountName} className="w-6 h-6" />
              <span className="text-sm font-semibold text-slate-500">{group.accountName}</span>
            </div>
            <span className="text-sm font-semibold text-slate-500">{formatBalance(formatCurrency(group.total), hideBalance)}</span>
          </div>

          {group.budgets.map((b) => {
            const ACCOUNT_USE_CATEGORY = ["ACC005", "ACC006"];
            const isCategoryBased = ACCOUNT_USE_CATEGORY.includes(group.accountId);
            const spent = isCategoryBased
              ? getSpentByBudget(b.remark, group.accountId, transactionMap)
              : transactionMap.byRemark[b.remark?.toLowerCase() ?? ""] ?? 0;
            const percent =
              b.amount > 0
                ? Math.min(Math.round((spent / b.amount) * 100), 100)
                : 0;

            return (
              <ComponentBudgetItem
                key={b.id}
                id={b.id}
                remark={b.remark}
                amount={b.amount}
                spent={spent}
                percent={percent}
                isOpen={openId === b.id}
                onOpen={() => setOpenId(b.id)}
                onClose={() => setOpenId(null)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}