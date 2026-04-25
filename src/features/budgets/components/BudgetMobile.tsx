import type { Account } from "../../accounts/types/account";
import TransactionComponentFilterDate from "../../transactions/components/TransactionComponentFilterDate";
import { useTransactionPeriod } from "../../transactions/hooks/useTransactionPeriod";
import { useBudgetGroupedByAccount } from "../hooks/useBudgetGroupedByAccount";
import type { Budget } from "../types/budget";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  refetch: () => void;
};

export default function BudgetMobile({ budgets, accounts }: Props) {
  const { start, end, prev, next, isCurrentPeriod } = useTransactionPeriod();
  const grouped = useBudgetGroupedByAccount({ budgets, start, end, accounts });

  console.log(grouped);
  console.log("START:", start);
  console.log("END:", end);

  budgets.forEach(b => {
    console.log("BUDGET DATE:", b.date);
  });


  return (
    <div className="">
      <TransactionComponentFilterDate period={{ start, end, prev, next, isCurrentPeriod }} />

      <div className="space-y-4">
        {grouped.map((group) => (
          <div key={group.accountId}>
            <div className="flex justify-between font-semibold">
              <span>{group.accountName}</span>
              <span>{group.total}</span>
            </div>

            {group.budgets.map((b) => (
              <div key={b.id} className="flex justify-between text-sm">
                <span>{b.remark}</span>
                <span>{b.amount}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}