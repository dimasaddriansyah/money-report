import { useState } from "react";
import { formatRupiah } from "../../helpers/Format";
import BottomSheet from "../utils/BottomSheet";
import { getAccountsImg } from "../../helpers/UI";

interface Props {
  data: {
    account: string;
    total: number;
    details?: {
      name: string;
      total: number;
    }[];
  }[];
}

export default function ListTransfer({ data }: Props) {
  const [selectedItem, setSelectedItem] = useState<null | typeof data[0]>(null);

  const bgClass = (account: string) => {
    const map: Record<string, string> = {
      jago: "bg-yellow-400",
      bca: "bg-blue-700",
      "blu by bca": "bg-sky-400",
      seabank: "bg-amber-600"
    };

    return map[account.toLowerCase()] || "bg-slate-400";
  };

  return (
    <section className="px-4 pb-6">
      <div className="bg-white/10 rounded-2xl p-4 flex flex-col gap-5">
        <span className="text-white font-medium">List Transfer</span>
        <div className="flex gap-1">
          {data.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedItem(item)}
              className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer">
              <span className="text-xs text-white font-medium">
                {item.account}
              </span>
              <div className={`h-2 w-full ${bgClass(item.account)} rounded-full`}/>
              <div className="text-xs text-white/70 font-medium">
                {formatRupiah(item.total)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomSheet
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={`List Transfer ${selectedItem?.account || ""}`}
      >
        {selectedItem && (
          <div className="pb-6">
            {/* Detail */}
            <div className="space-y-3">
              {selectedItem.details?.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img src={getAccountsImg(item.name)} alt={item.name} className="w-8 h-8" />
                    <span className="text-slate-500">{item.name}</span>
                  </div>
                  <span className="font-medium">
                    {formatRupiah(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200 my-4" />

            {/* Total */}
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatRupiah(selectedItem.total)}</span>
            </div>
          </div>
        )}
      </BottomSheet>
    </section>
  );
}
