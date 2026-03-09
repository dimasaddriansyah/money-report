import { useMemo } from "react";
import type { Transactions } from "../../types/Transactions";
import { getAccountsImg } from "../../helpers/UI";

interface Props {
  transactions: Transactions[];
  selectedAccount: string | null;
  onSelectAccount: (account: string | null) => void;
}

export default function FilterAccounts({
  transactions,
  selectedAccount,
  onSelectAccount,
}: Props) {
  const accounts = useMemo(() => {
    const set = new Set<string>();

    transactions.forEach((trx) => {
      if (trx.from_account) set.add(trx.from_account);
      if (trx.to_account) set.add(trx.to_account);
    });

    return ["All Account", ...Array.from(set)];
  }, [transactions]);

  return (
    <section className="">
      <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {accounts.map((account) => {
          const isActive =
            account === "All Account"
              ? selectedAccount === null
              : selectedAccount === account;

          return (
            <div
              key={account}
              onClick={() =>
                onSelectAccount(account === "All Account" ? null : account)
              }
              className={`min-w-28 rounded-2xl px-4 py-2 flex gap-2 shrink-0 snap-start cursor-pointer transition-all
              ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              <img src={`${getAccountsImg(account)}`} alt={`${account}`} className="w-5 h-5" />
              <span className="text-sm font-medium">{account}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
