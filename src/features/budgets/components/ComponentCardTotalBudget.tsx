import { NoteEditIcon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { useBalance } from "../../../shared/context/BalanceContext";

type Props = {
  amount: number;
  onEdit?: () => void;
}

export default function ComponentCardTotalBudget({ amount, onEdit }: Props) {
  const { hideBalance, setHideBalance } = useBalance();

  return (
    <div className="m-4 p-4 border border-slate-200 rounded-xl bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-sm text-slate-400">Total Budget</span>
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold">{formatBalance(formatCurrency(amount), hideBalance)}</span>
              {hideBalance !== undefined && setHideBalance && (
                hideBalance ? (
                  <ViewIcon
                    onClick={() => setHideBalance(false)}
                    className="text-slate-900 hover:text-slate-500 cursor-pointer" size={20} />
                ) : (
                  <ViewOffSlashIcon
                    onClick={() => setHideBalance(true)}
                    className="text-slate-900 hover:text-slate-500 cursor-pointer" size={20} />
                )
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center px-2.5 py-1.5 border border-amber-500 hover:bg-amber-500 text-amber-500 hover:text-white rounded-lg gap-2 transition cursor-pointer">
          <NoteEditIcon size={16} />
          <span className="text-sm font-semibold">Edit</span>
        </button>
      </div>
    </div>
  )
}

