import { DollarCircleIcon } from "hugeicons-react";
import type { ChangeEvent } from "react";
import Modal from "../../../shared/ui/Modal";
import { formatDateMonthRange } from "../../../shared/utils/format.helper";
import type { Budget } from "../types/budget";

type Props = {
  open: boolean;
  budget?: Budget;
  amount: number;
  amountInput: string;
  loading: boolean;
  onAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<void>;
  onClose: () => void;
};

export default function ComponentBudgetEditModal({
  open,
  budget,
  amount,
  amountInput,
  loading,
  onAmountChange,
  onSubmit,
  onClose,
}: Props) {
  if (!open || !budget) {
    return null;
  }

  return (
    <Modal
      title={`Edit Budget ${formatDateMonthRange(budget.date)}`}
      textButton="Update"
      loading={loading}
      onSubmit={onSubmit}
      onClose={onClose}>
      <div id="amount" className="flex-1 p-4">
        <label className="block text-sm font-medium text-black mb-1">Amount</label>
        <div className="relative flex items-center justify-center">
          <div className="absolute left-4 pointer-events-none"><DollarCircleIcon className="text-slate-400" size={20} /></div>
          <input
            inputMode="numeric"
            value={amountInput}
            onChange={onAmountChange}
            className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border  border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none
              ${amount ? "text-black" : "text-slate-400"}`}
            placeholder="Input transaction amount" />
        </div>
      </div>
    </Modal>
  );
}