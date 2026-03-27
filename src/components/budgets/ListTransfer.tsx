import { formatRupiah } from "../../helpers/Format";

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
              className="flex-1 flex flex-col items-center gap-1.5 relative group hover:cursor-pointer">
              <span className="text-xs text-white font-medium">
                {item.account}
              </span>
              <div className={`h-2 w-full ${bgClass(item.account)} rounded-full`}/>
              <div className="text-xs text-white/70 font-medium">
                {formatRupiah(item.total)}
              </div>

              {/* 🔥 TOOLTIP BREAKDOWN */}
              <div className="absolute z-50 bottom-full mb-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 bg-black text-white text-xs px-4 py-3 rounded-xl shadow-lg min-w-52">

              {/* Header */}
              <div className="font-semibold text-sm mb-2">{item.account}</div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-2" />

              {/* Detail */}
              <div className="space-y-1.5">
                {item.details?.map((d, i) => (
                  <div key={i} className="flex justify-between gap-6">
                    <span className="text-white/70">{d.name}</span>
                    <span className="text-right min-w-[90px]">
                      {formatRupiah(d.total)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-2" />

              {/* Total */}
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-right min-w-[90px]">
                  {formatRupiah(item.total)}
                </span>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
