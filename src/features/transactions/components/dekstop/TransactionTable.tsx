import { Delete02Icon, NoteEditIcon } from "hugeicons-react";
import { formatBalance, formatDateDay, formatDateTime } from "../../../../shared/utils/format.helper";
import { getAccountsImg, getCategoriesImg } from "../../../../shared/utils/style.helper";
import type { Transaction } from "../../types/transaction";
import { getAccountDisplay, getAmountDisplay, getCategoryName, getTypeDisplay } from "../../utils/ui.helpers";

type Props = {
  transactions: Transaction[];
  page: number;
  limit: number;
  accountLookup: Record<string, string>;
  categoryLookup: Record<string, string>;
  hideBalance: boolean;
  onEdit: (id: string) => void;
  onDelete: (transaction: Transaction) => void;
};

export default function TransactionTable({
  transactions,
  page,
  limit,
  accountLookup,
  categoryLookup,
  hideBalance,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
        <thead className="bg-slate-50">
          <tr className="text-left text-slate-500 border-b border-slate-100">
            <th className="w-12">#</th>
            <th>Date</th>
            <th>Account</th>
            <th>Category</th>
            <th className="w-40 text-right">Nominal</th>
            <th className="w-12 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((row, index) => {
            const typeConfig = getTypeDisplay(row.typeId);
            const amountConfig = getAmountDisplay(row);
            const categoryName = getCategoryName(row.categoryId, categoryLookup);
            const isSpecialRemark = /\[.*?\]/.test(row.remark || "");

            return (
              <tr
                key={row.id}
                className={`border-b border-slate-50 hover:bg-slate-50 transition
                  ${isSpecialRemark ? "bg-red-50" : "bg-white"}`}>
                <td className="text-slate-500 font-medium">{(page - 1) * limit + index + 1}</td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-medium text-black">{formatDateDay(row.date)}</span>
                    <span className="text-slate-400">{formatDateTime(row.date)}</span>
                  </div>
                </td>

                <td>
                  <div className="flex flex-col gap-1.5">
                    {getAccountDisplay(row, accountLookup).map(
                      (name, index) => (
                        <div
                          key={`${row.id}-${name}-${index}`}
                          className="flex items-center gap-1.5">
                          {index > 0 && (<span className="text-slate-400">→</span>)}
                          <img src={getAccountsImg(name)} alt={name} className="w-8 h-8" />
                          <span className="font-medium">{name}</span>
                        </div>
                      )
                    )}
                  </div>
                </td>

                <td>
                  <div className="flex items-center gap-3.5">
                    <img src={getCategoriesImg(categoryName)} alt={categoryName} className="w-8 h-8" />
                    <div className="flex flex-col">
                      <span className="font-medium text-black">{row.remark || "-"}</span>
                      <span className="text-slate-400">{categoryName}</span>
                    </div>
                  </div>
                </td>

                <td className={`text-right ${amountConfig.className}`}>
                  <span>{formatBalance(amountConfig.label, hideBalance)}</span>
                  <div className={`text-xs capitalize ${typeConfig.className}`}>{typeConfig.label}</div>
                </td>

                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(row.id)}
                      className="p-2 cursor-pointer rounded-xl bg-amber-50 hover:bg-amber-200">
                      <NoteEditIcon className="h-5 w-5 text-amber-500" />
                    </button>

                    <button
                      onClick={() => onDelete(row)}
                      className="p-2 cursor-pointer rounded-xl bg-red-50 hover:bg-red-200">
                      <Delete02Icon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div >
  );
}