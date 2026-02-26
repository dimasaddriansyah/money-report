import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { formatRupiah } from "../../helpers/Format";

interface Props {
  balance: number;
  hide: boolean;
  toggle: () => void;
}

export default function CurrentBalance({ balance, hide, toggle }: Props) {
  return (
    <section className="px-4 py-8">
      <span className="text-white/70">Current Balance</span>

      <div className="flex gap-2 items-center">
        <h1 className="text-2xl font-bold text-white">
          {hide ? "Rp •••••••••••" : formatRupiah(balance)}
        </h1>

        <button onClick={toggle} className="text-white cursor-pointer">
          {hide ? <ViewIcon strokeWidth={2}/> : <ViewOffSlashIcon strokeWidth={2}/>}
        </button>
      </div>
    </section>
  );
}
