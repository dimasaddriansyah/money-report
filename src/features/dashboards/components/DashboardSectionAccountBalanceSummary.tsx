import { useBalance } from "../../../shared/context/BalanceContext";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import type { Account } from "../../accounts/types/account";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import { getAccountStyle } from "../../transactions/utils/ui.helpers";

type AccountWithBalance = Account & {
  balance: number;
};

type Props = {
  accounts: AccountWithBalance[];
};

export default function DashboardSectionAccountBalanceSummary({
  accounts,
}: Props) {
  const { hideBalance } = useBalance();

  return (
    <div className="min-w-0 overflow-x-auto no-scrollbar">
      <div className="grid grid-rows-3 sm:grid-rows-2 grid-flow-col auto-cols-[240px] gap-4 w-max">
        {accounts.map((row) => (
          <div
            key={row.id}
            className="h-full flex items-center bg-white hover:bg-slate-100 rounded-lg border border-slate-100 cursor-pointer overflow-hidden">
            {/* Left - Image */}
            <div
              className={`w-16 h-full min-h-20 flex items-center justify-center shrink-0 border-0 ${getAccountStyle(row.name)}`}>
              <img src={getAccountsImg(row.name)} alt={row.name} className="w-8 h-8 object-contain" />
            </div>

            {/* Right - Balance & Account Name */}
            <div className="flex flex-col text-sm p-4 min-w-0">
              <span className="font-semibold tabular-nums truncate">
                {formatBalance(formatCurrency(row.balance), hideBalance)}
              </span>
              <span className="text-slate-500 truncate">{row.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}