import type { Account } from "../types/account";

export default function AccountMobile({ accounts }: { accounts: Account[]; }) {
  return (
    <div className="space-y-2">
      {accounts.map((row, index) => (
        <div
          key={`${row.id}-${index}`}
          className="p-4 bg-white rounded-xl border"
        >
          <p className="text-sm text-slate-500">Account</p>
          <p className="font-medium text-slate-900">
            {row.name}
          </p>
        </div>
      ))}
    </div>
  );
}