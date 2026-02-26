import { useMemo } from "react";
import type { Transaction } from "../../types/Transactions";
import { calculateAccountBalances } from "../../helpers/CalculateAccountBalances";
import { formatRupiah } from "../../helpers/Format";

interface Props {
  transactions: Transaction[];
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
            className="min-w-36 bg-white/20 rounded-2xl p-4 shrink-0 snap-start"
          >
            <div className="text-sm text-white/70">{account}</div>
            <div className="text-base text-white font-semibold">
              {hide ? "Rp •••••••••••" : formatRupiah(balance)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
