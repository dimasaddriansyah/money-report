import type { Transaction } from "../types/transaction";

export default function TransactionMobile({ transactions }: { transactions: Transaction[]; }) {
  return (
    <div className="space-y-2">
      {transactions.map((row, index) => (
        <div
          key={`${row.id}-${index}`}
          className="p-4 bg-white rounded-xl border"
        >
          <p className="text-sm text-slate-500">Transaction</p>
          <p className="font-medium text-slate-900">
            {row.remark}
          </p>
        </div>
      ))}
    </div>
  );
}