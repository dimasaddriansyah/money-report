import { useSwipeable } from "react-swipeable";
import { Edit, Trash } from "@boxicons/react";
import {
  getCategoriesImg,
  getPaymentClass,
  getTypeClass,
  getTypeDesc,
} from "../../helpers/UI";
import type { Transaction } from "../../types/Transactions";
import { formatRupiah } from "../../helpers/Format";

interface Props {
  trx: Transaction;
  openSwipe: string | null;
  setOpenSwipe: (id: string | null) => void;
}

export default function TransactionItem({
  trx,
  openSwipe,
  setOpenSwipe,
}: Props) {
  const isOpen = openSwipe === trx.transaction_id;

  const handlers = useSwipeable({
    onSwipedLeft: () => setOpenSwipe(trx.transaction_id),
    onSwipedRight: () => setOpenSwipe(null),
    delta: 60,
  });

  return (
    <li className="relative overflow-hidden">
      {/* ACTIONS */}
      <div className="absolute inset-y-0 right-0 flex">
        <button className="w-16 flex justify-center items-center bg-yellow-50 text-yellow-500">
          <Edit />
        </button>
        <button className="w-16 flex justify-center items-center bg-red-50 text-red-500">
          <Trash />
        </button>
      </div>

      <div
        {...handlers}
        className={`flex items-center px-6 py-4 gap-4 bg-white transition-transform ${
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
            className={`px-2 py-1 rounded-full text-xs ${getPaymentClass(trx.payment)}`}
          >
            {trx.payment}
          </span>

          <div className="mt-1">
            <div className="text-base font-medium">{trx.remark}</div>
            <div className="text-sm text-slate-500">{trx.category}</div>
          </div>
        </div>

        <div className={`text-sm font-semibold ${getTypeClass(trx.type)}`}>
          {getTypeDesc(trx.type) + " " + formatRupiah(trx.nominal)}
        </div>
      </div>
    </li>
  );
}
