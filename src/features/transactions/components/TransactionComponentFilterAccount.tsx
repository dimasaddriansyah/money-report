import { getAccountsImg } from "../../../helpers/UI";
import type { Account } from "../../accounts/types/account";

type Props = {
  accounts: Account[];
  selectedAccountId: string | null;
  onSelect: (id: string | null) => void;
};

export default function TransactionComponentFilterAccount({ accounts, selectedAccountId, onSelect }: Props) {
  return (
    <section className="flex gap-2 px-4 py-3 overflow-x-auto whitespace-nowrap no-scrollbar">
      <div
        onClick={() => onSelect(null)}
        className={`flex items-center pl-2 pr-4 py-2 border rounded-full shrink-0 cursor-pointer gap-2
          ${selectedAccountId === null
            ? "bg-slate-900 text-white"
            : "hover:bg-slate-50 text-black border-slate-200"
          }`}>
        <img src={getAccountsImg("default")} className="w-5 h-5" />
        <span className="text-sm font-medium">All Account</span>
      </div>

      {accounts.map((row) => {
        const isActive = selectedAccountId === row.id;

        return (
          <div
            key={row.id}
            onClick={() => onSelect(row.id)}
            className={`flex items-center pl-2 pr-4 py-2 border rounded-full shrink-0 cursor-pointer gap-2
              ${isActive
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-50 text-black border-slate-200"
              }`}
          >
            <img src={getAccountsImg(row.name)} className="w-5 h-5" />
            <span className="text-sm">{row.name}</span>
          </div>
        );
      })}
    </section>
  );
}