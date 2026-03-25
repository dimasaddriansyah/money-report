import { InvoiceIcon } from "hugeicons-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col text-slate-400 gap-4 items-center py-8 px-4">
      <InvoiceIcon className="w-10 h-10 opacity-40" />
      <div className="text-center w-75">
        <p className="text-lg font-medium">No transactions yet</p>
        <p className="text-sm">
          Add your first income or expense to start tracking your cash flow.
        </p>
      </div>
    </div>
  );
}
