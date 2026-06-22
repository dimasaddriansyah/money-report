import { ArrowDown01Icon } from "hugeicons-react";
import { getAccountsImg, getCategoriesImg } from "../../../shared/utils/style.helper";
import BottomSheet from "../../../shared/ui/BottomSheet";
import { useMemo, useState } from "react";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";

type Props = {
  accounts: Account[];
  categories: Category[];
  selectedType: string;
  selectedAccount: string;
  selectedCategory: string;
  onChangeType: (val: string) => void;
  onChangeAccount: (val: string) => void;
  onChangeCategory: (val: string) => void;
};

export default function TransactionComponentFilter({
  accounts, categories, selectedType, selectedAccount, selectedCategory, onChangeAccount, onChangeType, onChangeCategory
}: Props) {
  const TYPES = [
    { id: "ALL", label: "All Types" },
    { id: "TP001", label: "Income" },
    { id: "TP002", label: "Expenses" },
    { id: "TP003", label: "Transfer" },
  ];

  const accountMap = useMemo(
    () => Object.fromEntries(accounts.map(row => [row.id, row.name])),
    [accounts]
  );

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map(row => [row.id, row.name])),
    [categories]
  );

  const ACCOUNT_OPTIONS = [
    { id: "ALL", name: "All Accounts" },
    ...Object.entries(accountMap).map(([id, name]) => ({
      id,
      name,
    })),
  ];

  const CATEGORY_OPTIONS = [
    { id: "ALL", name: "All Categories" },
    ...Object.entries(categoryMap).map(([id, name]) => ({
      id,
      name,
    })),
  ];

  const [openType, setOpenType] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  return (
    <>
      <section className="flex gap-2 px-4 py-3 overflow-x-auto whitespace-nowrap no-scrollbar">
        <div
          onClick={() => setOpenType(true)}
          className={`flex items-center pl-2 pr-4 py-2 rounded-full shrink-0 cursor-pointer gap-2
            ${selectedType === "ALL" ? "bg-white border border-slate-200" : "bg-blue-50 border border-blue-200"}`}>
          <img src={getAccountsImg("default")} className="w-5 h-5" />
          <span className={`text-sm ${selectedType === "ALL" ? "text-slate-400" : "text-blue-500 font-medium"}`}>
            {TYPES.find(t => t.id === selectedType)?.label}
          </span>
          <ArrowDown01Icon size={12} className={`${selectedType === "ALL" ? "text-slate-400" : "text-blue-500"}`} />
        </div>

        <div
          onClick={() => setOpenAccount(true)}
          className={`flex items-center pl-2 pr-4 py-2 rounded-full shrink-0 cursor-pointer gap-2
            ${selectedAccount === "ALL" ? "bg-white border border-slate-200" : "bg-blue-50 border border-blue-200"}`}>
          <img src={getAccountsImg("default")} className="w-5 h-5" />
          <span className={`text-sm ${selectedAccount === "ALL" ? "text-slate-400" : "text-blue-500 font-medium"}`}>
            {selectedAccount === "ALL"
              ? "All Accounts"
              : accountMap[selectedAccount]}
          </span>
          <ArrowDown01Icon size={12} className={`${selectedAccount === "ALL" ? "text-slate-400" : "text-blue-500"}`} />
        </div>

        <div
          onClick={() => setOpenCategory(true)}
          className={`flex items-center pl-2 pr-4 py-2 rounded-full shrink-0 cursor-pointer gap-2
            ${selectedCategory === "ALL" ? "bg-white border border-slate-200" : "bg-blue-50 border border-blue-200"}`}>
          <img src={getAccountsImg("default")} className="w-5 h-5" />
          <span className={`text-sm ${selectedCategory === "ALL" ? "text-slate-400" : "text-blue-500 font-medium"}`}>
            {selectedCategory === "ALL"
              ? "All Categories"
              : categoryMap[selectedCategory]}
          </span>
          <ArrowDown01Icon size={12} className={`${selectedCategory === "ALL" ? "text-slate-400" : "text-blue-500"}`} />
        </div>
      </section>
      <BottomSheet
        open={openType}
        onClose={() => setOpenType(false)}
        title="Select Type Transaction">
        <div className="flex flex-col">
          {TYPES.map((type) => {
            const active = selectedType === type.id;

            return (
              <button
                key={type.id}
                onClick={() => {
                  onChangeType(type.id);
                  setOpenType(false);
                }}
                className={`flex items-center justify-between p-4 border-b border-slate-100 transition cursor-pointer
                  ${active
                    ? "bg-slate-100 text-black font-semibold"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}>
                <span className="text-sm">{type.label}</span>
                {active && (
                  <span className="text-xs text-slate-400">Selected</span>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>
      <BottomSheet
        open={openAccount}
        onClose={() => setOpenAccount(false)}
        title="Select Account Transaction">
        <div className="flex flex-col">
          {ACCOUNT_OPTIONS.map((account) => {
            const active = selectedAccount === account.id;

            return (
              <button
                key={account.id}
                onClick={() => {
                  onChangeAccount(account.id);
                  setOpenAccount(false);
                }}
                className={`flex items-center justify-between p-4 border-b border-slate-100 transition cursor-pointer
                  ${active
                    ? "bg-slate-100 text-black font-semibold"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}>
                <div className="flex item-center gap-4">
                  <img src={getAccountsImg(account.name)} className="w-5 h-5" />
                  <span className="text-sm font-medium">{account.name}</span>
                </div>
                {active && (
                  <span className="text-xs text-slate-400">Selected</span>
                )}
              </button>
            )
          })}
        </div>
      </BottomSheet>
      <BottomSheet
        open={openCategory}
        onClose={() => setOpenCategory(false)}
        title="Select Category Transaction">
        <div className="flex flex-col">
          {CATEGORY_OPTIONS.map((category) => {
            const active = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => {
                  onChangeCategory(category.id);
                  setOpenCategory(false);
                }}
                className={`flex items-center justify-between p-4 border-b border-slate-100 transition cursor-pointer
                  ${active
                    ? "bg-slate-100 text-black font-semibold"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}>
                <div className="flex item-center gap-4">
                  <img src={getCategoriesImg(category.name)} className="w-5 h-5" />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                {active && (
                  <span className="text-xs text-slate-400">Selected</span>
                )}
              </button>
            )
          })}
        </div>
      </BottomSheet>
    </>
  );
}