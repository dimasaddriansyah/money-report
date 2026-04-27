import { NoteEditIcon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { useBalance } from "../../../shared/context/BalanceContext";

type Props = {
  amount: number;
}

export default function ComponentCardTotalBudget({ amount }: Props) {
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
        <button className="flex items-center px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 border text-white text-sm rounded-lg gap-1 cursor-pointer">
          <NoteEditIcon size={20} />
          <span className="font-semibold">Edit</span>
        </button>
      </div>
    </div>
  )
}

