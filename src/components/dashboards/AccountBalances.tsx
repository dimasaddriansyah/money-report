import { useMemo } from "react";
import type { Transactions } from "../../types/Transactions";
import { calculateAccountBalances } from "../../helpers/CalculateAccountBalances";
import { formatRupiah } from "../../helpers/Format";

interface Props {
  transactions: Transactions[];
  hide: boolean;
}

export default function AccountBalances({ transactions, hide }: Props) {
  const accountBalances = useMemo(() => {
    return calculateAccountBalances(transactions);
  }, [transactions]);

  const accounts = Object.entries(accountBalances);

  if (accounts.length === 0) return null;

  return (
    <section className="px-4 pb-6">
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {accounts.map(([account, balance]) => (
          <div
            key={account}
            className="min-w-36 rounded-2xl p-4 bg-white/5 shrink-0 snap-start transition-all cursor-pointer"
          >
            <div className="text-sm text-white/70">{account}</div>
            <div className="text-base font-semibold text-white">
              {hide ? "Rp •••••••••••" : formatRupiah(balance)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
