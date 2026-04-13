import { getAccountsImg } from "../../../helpers/UI";
import { useBalance } from "../../../shared/context/BalanceContext";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import type { Account } from "../../accounts/types/account";

type AccountWithBalance = Account & {
  balance: number;
};

type Props = {
  accounts: AccountWithBalance[];
};

export default function DashboardSectionAccountBalanceSummary({ accounts }: Props) {
    const { hideBalance } = useBalance();

  return (
    <div className="min-w-0">
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {accounts.map((row) => (
          <div
            key={row.id}
            className="min-w-60 shrink-0 p-4 bg-white hover:bg-slate-100 rounded-lg border border-slate-100 cursor-pointer">
            <div className="flex items-center gap-4">
              <img src={getAccountsImg(row.name)} alt={row.name} className="w-8 h-8" />
              <div className="flex flex-col text-sm">
                <span className="font-medium">{formatBalance(formatCurrency(row.balance), hideBalance)}</span>
                <span className="text-slate-400">{row.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}