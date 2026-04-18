import { ArrowRight01Icon, Delete02Icon, NoteEditIcon } from "hugeicons-react";
import { getAccountDisplay, getAccountStyle, getAmountDisplay, getCategoryName } from "../utils/ui.helpers";
import { formatBalance } from "../../../shared/utils/format.helper";
import SwipeableItem from "../../../shared/ui/SwipeableItem";
import type { Transaction } from "../types/transaction";
import { getAccountsImg, getCategoriesImg } from "../../../shared/utils/style.helper";

type Props = {
  row: Transaction;
  accountMap: Record<string, string>;
  categoryMap: Record<string, string>;
  hideBalance: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ComponentTransactionItem({
  row,
  accountMap,
  categoryMap,
  hideBalance,
  isOpen,
  onOpen,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const amountConfig = getAmountDisplay(row);
  const categoryName = getCategoryName(row.categoryId, categoryMap);

  return (
    <div className="relative overflow-hidden border-b border-slate-50 touch-pan-y">
      <div className="absolute inset-y-0 right-0 flex">
        <div onClick={onEdit} className="w-16 flex items-center justify-center bg-amber-500 text-white cursor-pointer">
          <NoteEditIcon size={22} />
        </div>
        <div onClick={onDelete} className="w-16 flex items-center justify-center bg-red-500 text-white cursor-pointer">
          <Delete02Icon size={22} />
        </div>
      </div>
      <SwipeableItem isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <div className="p-4 bg-white">
          <div className="flex items-center gap-3">
            <img src={getCategoriesImg(categoryName)} className="w-10 h-10" />
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex items-center">
                {getAccountDisplay(row, accountMap).map((name: string, i: number, arr: string[]) => (
                  <span key={i} className="flex items-center">
                    <span className={`flex items-center px-2 py-1 gap-1 rounded-full ${getAccountStyle(name)}`}>
                      <img src={getAccountsImg(name)} className="w-4 h-4" />
                      <span className="text-xs">{name}</span>
                    </span>
                    {i < arr.length - 1 && <ArrowRight01Icon size={14} />}
                  </span>
                ))}
              </div>

              <div className="flex justify-between">
                <div className="max-w-56">
                  <div className="font-medium">{row.remark || "-"}</div>
                  <div className="text-sm text-slate-400">{categoryName}</div>
                </div>
                <div className={amountConfig.className}>
                  {formatBalance(amountConfig.label, hideBalance)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwipeableItem>
    </div>
  );
}