import { formatCurrency } from "../../../shared/utils/format.helper";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import type { Account } from "../../accounts/types/account";
import TransactionComponentFilterDate from "../../transactions/components/TransactionComponentFilterDate";
import { useTransactionPeriod } from "../../transactions/hooks/useTransactionPeriod";
import { useBudgetGroupedByAccount } from "../hooks/useBudgetGroupedByAccount";
import type { Budget } from "../types/budget";
import ComponentCircularProgress from "./ComponentCircularProgress";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  refetch: () => void;
};

export default function BudgetMobile({ budgets, accounts }: Props) {
  const { start, end, prev, next, isCurrentPeriod } = useTransactionPeriod();
  const grouped = useBudgetGroupedByAccount({ budgets, start, end, accounts });

  return (
    <div className="">
      <TransactionComponentFilterDate period={{ start, end, prev, next, isCurrentPeriod }} />

      <div className="flex flex-col">
        {grouped.map((group) => (
          <div key={group.accountId}>
            <div className="flex justify-between px-4 py-3 bg-slate-100">
              <div className="flex items-center gap-3">
                <img src={getAccountsImg(group.accountName)} alt={group.accountName} className="w-6 h-6" />
                <span className="text-sm font-semibold text-slate-500">{group.accountName}</span>
              </div>
              <span className="text-sm font-semibold text-slate-500">{formatCurrency(group.total)}</span>
            </div>

            {group.budgets.map((b) => {
              const percent = Math.min(Math.round((30000 / b.amount) * 100), 100);
              return (
                <div
                  key={b.id}
                  className="flex justify-between items-center p-4 gap-4 bg-white hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-base font-medium"> {b.remark} </span>
                    <span className="text-sm text-slate-400"> {formatCurrency(b.amount)} </span>
                  </div>
                  <ComponentCircularProgress value={percent} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}