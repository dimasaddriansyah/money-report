import { Delete02Icon, NoteEditIcon } from "hugeicons-react";
import SwipeableItem from "../../../shared/ui/SwipeableItem";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import ComponentCircularProgress from "./ComponentCircularProgress";
import { useBalance } from "../../../shared/context/BalanceContext";

type Props = {
  id: string;
  remark: string;
  amount: number;
  spent: number;
  percent: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export default function ComponentBudgetItem({
  remark,
  amount,
  spent,
  percent,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  const { hideBalance } = useBalance();

  return (
    <div className="relative overflow-hidden border-b border-slate-50 touch-pan-y">
      <div className="absolute inset-y-0 right-0 flex">
        <div className="w-16 flex items-center justify-center bg-amber-500 text-white cursor-pointer">
          <NoteEditIcon size={20} />
        </div>
        <div className="w-16 flex items-center justify-center bg-red-500 text-white cursor-pointer">
          <Delete02Icon size={20} />
        </div>
      </div>

      <SwipeableItem isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <div className="flex justify-between items-center p-4 bg-white hover:bg-slate-50 transition cursor-pointer">
          <div className="flex flex-col">
            <span className="text-base font-medium">{remark}</span>
            <div className="flex gap-1 text-sm">
              <span className="text-slate-400">{formatBalance(formatCurrency(spent), hideBalance)}</span>
              <span className="text-slate-400">/</span>
              <span className="font-medium text-slate-600">{formatBalance(formatCurrency(amount), hideBalance)}</span>
            </div>
          </div>
          <ComponentCircularProgress value={percent} />
        </div>
      </SwipeableItem>
    </div>
  );
}