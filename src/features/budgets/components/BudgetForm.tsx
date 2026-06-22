import { ArrowDown01Icon, CreditCardIcon, Calendar03Icon, DollarCircleIcon, NoteEditIcon, Delete02Icon } from "hugeicons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Budget } from "../types/budget";
import { formatDateFull, formatNumber } from "../../../shared/utils/format.helper";
import type { Account } from "../../accounts/types/account";
import { useBudgetForm } from "../hooks/useBudgetForm";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import { createPortal } from "react-dom";
import BottomSheet from "../../../shared/ui/BottomSheet";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Props = {
  defaultValues?: Budget;
  accounts: Account[];
  onSubmit: (
    data: {
      id?: string;
      date: string;
      accountId?: string;
      remark: string;
      amount: number;
    }) => void;
  loading?: boolean;
};

export default function BudgetForm({
  defaultValues,
  accounts,
  onSubmit,
  loading
}: Props) {
  const navigate = useNavigate();
  const { form, setField, getPayload, reset } = useBudgetForm(defaultValues);
  const { date, accountId, remark, amount } = form;

  const isEdit = !!defaultValues;

  const accountRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);

  const [openAccount, setOpenAccount] = useState(false);
  const [openDeleteBudget, setOpenDeleteBudget] = useState(false);
  const amountInput = amount ? formatNumber(amount) : "";

  const { deleteBudget } = useBudgetActions();

  const [dropdownStyle, setDropdownStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const accountMap = useMemo(
    () => Object.fromEntries(accounts.map((a) => [a.id, a.name])),
    [accounts]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (
        accountRef.current &&
        !accountRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpenAccount(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (openAccount && accountRef.current) {
      const rect = accountRef.current.getBoundingClientRect();

      setDropdownStyle({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [openAccount]);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    const numberValue = Number(raw || 0);
    setField("amount", numberValue);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(getPayload());
  }

  async function handleDelete() {
    if (!defaultValues) return;

    try {
      const result = await deleteBudget(defaultValues.id);

      toast.success("Deleted", {
        description: result.message,
      });

      navigate("/budgets");
    } catch (error: unknown) {
      let message = "Failed to delete budget";

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error("Failed to delete", {
        description: message,
      });
    }
  }

  function handleReset() {
    reset();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 md:p-0">
        <div className="flex flex-col gap-3 md:gap-4 md:p-0">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div id="date" className="flex-1">
              <label className="block text-sm font-medium text-black mb-1">Date</label>
              <div
                onClick={() => dateRef.current?.showPicker()}
                className="flex items-center justify-between w-full ps-3 pe-3 py-2.5 text-base rounded-xl border border-slate-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Calendar03Icon className="text-slate-400" size={20} />
                  <input
                    ref={dateRef}
                    type="date"
                    value={date}
                    onChange={(e) => setField("date", e.target.value)}
                    className="absolute opacity-0 pointer-events-none" />
                  <span className="capitalize">{formatDateFull(date) || "Select date"}</span>
                </div>
                <ArrowDown01Icon className="text-slate-400" size={20} />
              </div>
            </div>
            <div id="accountId" className="flex-1">
              <label className="block text-sm font-medium text-black mb-1">Account Name</label>
              <div className="relative" ref={accountRef}>
                <div
                  onClick={() => setOpenAccount((prev) => !prev)}
                  className="flex items-center justify-between w-full ps-3 pe-3 py-2.5 text-base rounded-xl border border-slate-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <CreditCardIcon className="text-slate-400" size={20} />
                    <span className={accountId ? "text-black" : "text-slate-400"}>
                      {accountId ? accountMap[accountId] : "Select account"}
                    </span>
                  </div>
                  <ArrowDown01Icon className="text-slate-400" size={20} />
                </div>
                {openAccount && dropdownStyle &&
                  createPortal(
                    <div
                      ref={dropdownRef}
                      className="fixed z-10 bg-white border border-slate-300 rounded-xl max-h-60 overflow-y-auto scrollbar-thin shadow"
                      style={dropdownStyle}>
                      {accounts.map((acc) => (
                        <div
                          key={acc.id}
                          onClick={() => {
                            setField("accountId", acc.id);
                            setOpenAccount(false);
                          }}
                          className={`flex items-center px-4 py-3 gap-4 cursor-pointer
                          ${accountId === acc.id
                              ? "bg-slate-50 text-black font-medium"
                              : "text-slate-400 hover:bg-slate-50 hover:text-black"}`}>
                          <img src={getAccountsImg(acc.name)} className="w-8 h-8" />
                          <span>{acc.name}</span>
                        </div>
                      ))}
                    </div>,
                    document.body
                  )}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div id="amount" className="flex-1">
              <label className="block text-sm font-medium text-black mb-1">Amount</label>
              <div className="relative flex items-center justify-center">
                <div className="absolute left-4 pointer-events-none">
                  <DollarCircleIcon className="text-slate-400" size={20} />
                </div>
                <input
                  inputMode="numeric"
                  value={amountInput}
                  onChange={handleAmountChange}
                  className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${amount ? "text-black" : "text-slate-400"} border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none`}
                  placeholder="Input amount" />
              </div>
            </div>
            <div id="remark" className="flex-1">
              <label className="block text-sm font-medium text-gray-900 mb-1">Remark</label>
              <div className="relative flex items-center justify-center">
                <div className="absolute left-4 pointer-events-none">
                  <NoteEditIcon className="text-slate-400" size={20} />
                </div>
                <input
                  inputMode="numeric"
                  value={remark}
                  onChange={(e) => setField("remark", e.target.value)}
                  className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${remark ? "text-black" : "text-slate-400"} border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none`}
                  placeholder="Input remark" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse mt-4 gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="order-3 hidden md:flex px-5 py-2.5 text-sm text-slate-400 rounded-lg cursor-pointer">Reset
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={() => setOpenDeleteBudget(true)}
              className="order-2 md:hidden px-5 py-2.5 text-sm border border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition rounded-lg cursor-pointer">
              <div className="flex items-center justify-center gap-2">
                <Delete02Icon size={16} />
                Delete Budget
              </div>
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`order-1 px-5 py-2.5 text-sm font-semibold text-white rounded-lg cursor-pointer
            ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"}`}>
            {loading ? "Saving..." : isEdit ? "Update Budget" : "Create Budget"}
          </button>
        </div>
      </form>
      {isEdit && (
        <BottomSheet
          title="Delete Budget"
          open={openDeleteBudget}
          onClose={() => { setOpenDeleteBudget(false) }}>
          <div className="flex flex-col p-4 gap-4">
            <p className="text-sm text-slate-500">Delete "<span className="text-black font-semibold">{remark}</span>"? This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-sm text-white font-semibold disabled:opacity-50 cursor-pointer">
                <div className="flex items-center justify-center gap-2">
                  <Delete02Icon size={16} />
                  {loading ? "Deleting..." : "Delete Budget"}
                </div>
              </button>
            </div>
          </div>
        </BottomSheet >
      )}
    </>
  )
}

