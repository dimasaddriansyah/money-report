import { useMemo } from "react";
import type { Transaction } from "../../types/Transactions";
import { calculatePaymentBalances } from "../../helpers/CalculatePaymentBalances";
import { formatRupiah } from "../../helpers/Format";

interface Props {
  transactions: Transaction[];
  hide: boolean;
}

export default function PaymentBalances({ transactions, hide }: Props) {
  const paymentBalances = useMemo(() => {
    return calculatePaymentBalances(transactions);
  }, [transactions]);

  const payments = Object.entries(paymentBalances);

  if (payments.length === 0) return null;

  return (
    <section className="px-4 pb-6">
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {payments.map(([payment, balance]) => (
          <div
            key={payment}
            className="min-w-36 bg-white/20 rounded-2xl p-4 shrink-0 snap-start"
          >
            <div className="text-sm text-white/70">{payment}</div>
            <div className="text-base text-white font-semibold">
              {hide ? "Rp •••••••••••" : formatRupiah(balance)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
