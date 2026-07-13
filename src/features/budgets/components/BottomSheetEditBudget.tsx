import { DollarCircleIcon } from "hugeicons-react";
import BottomSheet from "../../../shared/ui/BottomSheet";
import TextField from "../../../shared/ui/TextField";
import { formatDateMonthRange } from "../../../shared/utils/format.helper";
import type { useBudgetEdit } from "../hooks/useBudgetEdit";
import type { Budget } from "../types/budget";

type Props = {
  open: boolean;
  budget: Budget | null;
  edit: ReturnType<typeof useBudgetEdit>;
  onClose: () => void;
};

export default function BottomSheetEditBudget({
  open,
  budget,
  edit,
  onClose,
}: Props) {
  if (!budget) return null;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={`Edit Budget ${formatDateMonthRange(budget.date)}`}>
      <div className="p-4 flex flex-col gap-4">
        <TextField
          label="Amount"
          leftIcon={<DollarCircleIcon size={20} />}
          value={edit.amountInput}
          onChange={edit.handleAmountChange} />

        <button
          disabled={edit.loading}
          onClick={async () => {
            const success = await edit.save(budget);
            if (success) {
              onClose();
            }
          }}
          className="p-3 text-sm font-semibold text-white bg-black hover:bg-black/90 rounded-xl cursor-pointer">
          {edit.loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </BottomSheet>
  );
}