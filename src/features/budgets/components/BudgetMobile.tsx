import type { Account } from "../../accounts/types/account";
import { useBudgetGroupedByAccount } from "../hooks/useBudgetGroupedByAccount";
import { useBudgetPeriod } from "../hooks/useBudgetPeriod";
import type { Budget } from "../types/budget";
import BudgetFilterMonth from "./BudgetFilterMonth";

type Props = {
  budgets: Budget[];
  accounts: Account[];
  refetch: () => void;
};

export default function BudgetMobile({ budgets, accounts }: Props) {
  const { month, prev, next, isMaxMonth } = useBudgetPeriod();
  const grouped = useBudgetGroupedByAccount({ budgets, month, accounts });

  console.log(grouped);
  

  return (
    <div className="">
      <BudgetFilterMonth month={month} prev={prev} next={next} isMaxMonth={isMaxMonth} />

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