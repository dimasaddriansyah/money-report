import { useMemo } from "react";
import type { Transactions } from "../../types/Transactions";
import { calculateAccountBalances } from "../../helpers/CalculateAccountBalances";
import { formatRupiah } from "../../helpers/Format";

interface Props {
  transactions: Transactions[];
  hide: boolean;
  cardStyle?: string;
  cardPadding?: string;
  accountTextColor?: string;
  balanceTextColor?: string;
}

export default function AccountBalances({
  transactions,
  hide,
  cardStyle,
  cardPadding,
  accountTextColor,
  balanceTextColor,
}: Props) {
  const accountBalances = useMemo(() => {
    return calculateAccountBalances(transactions);
  }, [transactions]);

  const accounts = Object.entries(accountBalances);

  if (accounts.length === 0) return null;

  return (
    <section className={`${cardPadding ?? ""}`}>
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {accounts.map(([account, balance]) => (
          <div
            key={account}
            className={`group min-w-36 rounded-2xl p-4 shrink-0 snap-start bg-white/20 ${cardStyle ?? ""}`}
          >
            <div className={`text-sm text-white/70 ${accountTextColor ?? ""}`}>
              {account}
            </div>
            <div
              className={`text-base text-white ${balanceTextColor ?? ""} font-semibold`}
            >
              {hide ? "Rp •••••••••••" : formatRupiah(balance)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
