/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add01Icon, ArrowRight01Icon } from "hugeicons-react";
import Header from "../../components/navigation/Header";
import { useAccounts } from "../../hooks/accounts/useAccounts";
import { getAccountsImg } from "../../helpers/UI";

export default function Accounts() {
  const { accounts } = useAccounts();

  return (
    <div className="bg-slate-50 flex flex-col">
      <Header title="Accounts" textColor="text-slate-900" showBack />
      <div className="p-4 pb-24 space-y-4">
        <div className="flex justify-center items-center font-semibold border border-dashed border-slate-300 rounded-lg py-2.5 gap-2 hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
          <Add01Icon className="w-5 h-5"/>
          <span>Add Account</span>
        </div>
        <div className="bg-white rounded-xl overflow-hidden cursor-pointer">
          {accounts?.map((account: any) => (
            <div key={account.account_id}>
              <div className="flex items-center justify-between p-4 hover:bg-slate-100">
                <div className="flex gap-4 items-center">
                  <img
                    src={`${getAccountsImg(account.name)}`}
                    alt={account.name}
                    className="w-8 h-8"
                  />
                  <span className="font-medium text-slate-800">
                    {account.name}
                  </span>
                </div>
                <ArrowRight01Icon className="text-slate-400 w-5 h-5" />
              </div>
              <div className="h-px bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
