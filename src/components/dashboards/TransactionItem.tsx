import { useSwipeable } from "react-swipeable";
import {
  getCategoriesImg,
  getAccountClass,
  getTransactionUtils,
} from "../../helpers/UI";
import type { Transactions } from "../../types/Transactions";
import { formatRupiah } from "../../helpers/Format";
import { getDisplayAccount } from "../../helpers/GetDisplayAccount";
import { Delete01Icon, Edit01Icon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";

interface Props {
  trx: Transactions;
  openSwipe: string | null;
  setOpenSwipe: (id: string | null) => void;
  currentAccount?: string;
  onDeleteRequest: (trx: Transactions) => void;
}

export default function TransactionItem({
  trx,
  openSwipe,
  setOpenSwipe,
  currentAccount,
  onDeleteRequest,
}: Props) {
  const navigate = useNavigate();
  const isOpen = openSwipe === trx.transaction_id;
  const displayAccount = getDisplayAccount(trx, currentAccount);
  const { sign, textColor } = getTransactionUtils(trx, currentAccount);

  const handlers = useSwipeable({
    onSwipedLeft: () => setOpenSwipe(trx.transaction_id),
    onSwipedRight: () => setOpenSwipe(null),
    delta: 60,
  });

  return (
    <li className="relative overflow-hidden">
      {/* ACTIONS */}
      <div className="absolute inset-y-0 right-0 flex">
        <button
          onClick={() =>
            navigate(`/transaction/edit/${trx.transaction_id}`, {
              state: { transaction: trx },
            })
          }
          className="w-16 flex justify-center items-center bg-yellow-50 text-yellow-500"
        >
          <Edit01Icon />
        </button>
        <button
          onClick={() => onDeleteRequest(trx)}
          className="w-16 flex justify-center items-center bg-red-50 text-red-500"
        >
          <Delete01Icon />
        </button>
      </div>

      <div
        {...handlers}
        className={`flex items-center px-4 py-4 gap-4 bg-white transition-transform ${
          isOpen ? "-translate-x-32" : "translate-x-0"
        }`}
      >
        <img
          src={getCategoriesImg(trx.category)}
          alt={trx.category}
          className="w-12 h-12"
        />

        <div className="flex-1">
          <span
            className={`px-2 py-1 rounded-full text-xs ${getAccountClass(displayAccount)}`}
          >
            {displayAccount}
          </span>

          <div className="mt-1">
            <div className="text-base font-medium">{trx.remark}</div>
            <div className="text-sm text-slate-500">{trx.category}</div>
          </div>
        </div>

        <div className={`text-sm font-semibold ${textColor}`}>
          {sign} {formatRupiah(trx.nominal)}
        </div>
      </div>
    </li>
  );
}
