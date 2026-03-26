import { formatRupiah } from "../../helpers/Format";

interface Props {
  data: {
    account: string;
    total: number;
  }[];
}

export default function ListTransfer({ data }: Props) {
  const bgClass = (account: string) => {
    const map: Record<string, string> = {
      jago: "bg-amber-500",
      gopay: "bg-cyan-500",
      bca: "bg-blue-700",
      "blu by bca": "bg-sky-400",
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
              className="flex-1 flex flex-col items-center gap-1.5"
            >
              <span className="text-xs text-white font-medium">
                {item.account}
              </span>
              <div
                className={`h-2 w-full ${bgClass(item.account)} rounded-full`}
              />
              <div className="text-xs text-white/70 font-medium">
                {formatRupiah(item.total)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
