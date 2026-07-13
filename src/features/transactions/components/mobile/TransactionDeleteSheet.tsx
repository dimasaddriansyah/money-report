import { Delete02Icon } from "hugeicons-react";
import BottomSheet from "../../../../shared/ui/BottomSheet";
import type { Transaction } from "../../types/transaction";

type Props = {
  open: boolean;
  loading: boolean;
  transaction: Transaction | null;
  onDelete: () => void;
  onClose: () => void;
};

export default function TransactionDeleteSheet({
  open,
  loading,
  transaction,
  onDelete,
  onClose,
}: Props) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Delete Transaction">
      <div className="flex flex-col gap-4 p-4">
        <p className="text-sm text-slate-500">
          Delete{" "}
          <span className="font-semibold text-black">
            "{transaction?.remark}"
          </span>
          ? This cannot be undone.
        </p>

        <button
          onClick={onDelete}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer">
          <Delete02Icon size={16} />
          {loading ? "Deleting..." : "Delete Transaction"}
        </button>
      </div>
    </BottomSheet>
  );
}