// import EmptyState from "../../../shared/ui/EmptyState";
// import type { Budget } from "../types/budget";
// import { useNavigate } from "react-router-dom";
// import { useMemo, useState } from "react";
// import Modal from "../../../components/utils/Modal";
// import { useBudgetActions } from "../hooks/useBudgetActions";
// import { getAccountsImg } from "../../../helpers/UI";
// import { useAccounts } from "../../accounts/hooks/useAccounts";

export default function BudgetDesktop(
  // { budgets, refetch }: { budgets: Budget[]; refetch: () => void; }
) {
  // const { accounts } = useAccounts()

  // const isEmpty = budgets.length === 0;

  // const accountMap = useMemo(
  //   () => Object.fromEntries(accounts.map(row => [row.id, row.name])),
  //   [accounts]
  // );

  // const budgetsByAccount = useMemo(() => {
  //   const map: Record<string, Budget[]> = {};

  //   budgets.forEach((item) => {
  //     if (!item.accountId) return;

  //     const key = item.accountId;

  //     if (!map[key]) {
  //       map[key] = [];
  //     }

  //     map[key].push(item);
  //   });

  //   return map;
  // }, [budgets]);

  return (
    <>
      {/* {isEmpty ? (
        <EmptyState
          title="No budgets yet"
          subtitle="Create your first budget to start tracking"
        />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(budgetsByAccount).map(([accountId, items]) => {
            const accountName = accountMap[accountId] ?? "No Account";

            return (
              <div
                key={accountId}
                className="p-4 bg-white border border-slate-100 rounded-lg space-y-3 hover:bg-slate-100 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getAccountsImg(accountName)}
                    className="w-9 h-9"
                  />
                  <div className="font-medium text-slate-900">
                    {accountName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )} */}
    </>
  )
}

