import { ArrowDown01Icon, Calendar03Icon, Delete02Icon, NoteEditIcon } from "hugeicons-react";
import { useEffect, useRef, useState } from "react";
import type { Budget } from "../types/budget";
import { formatDateFull, formatNumber } from "../../../shared/utils/format.helper";
import type { Account } from "../../accounts/types/account";
import { useBudgetForm } from "../hooks/useBudgetForm";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import BottomSheet from "../../../shared/ui/BottomSheet";
import { useBudgetActions } from "../hooks/useBudgetActions";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { FormData } from "../utils/budget.form.helper";

type Props = {
  defaultValues?: Budget;
  accounts: Account[];
  onSubmit: (data: FormData) => void;
  loading?: boolean;
};

export default function BudgetFormMobile({
  defaultValues,
  accounts,
  onSubmit,
  loading
}: Props) {
  const navigate = useNavigate();
  const { deleteBudget } = useBudgetActions();
  const { form, setField, getPayload } = useBudgetForm(defaultValues);
  const { date, accountId, remark, amount } = form;
  
  const [openDeleteBudget, setOpenDeleteBudget] = useState(false);
  
  const accountContainerRef = useRef<HTMLDivElement | null>(null);
  const accountItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dateRef = useRef<HTMLInputElement | null>(null);
  
  const isEdit = !!defaultValues;

  const amountInput = amount ? formatNumber(amount) : "";

  const isAmountValid = amount > 0;
  const isAccountValid = !!accountId;
  const isRemarkValid = remark.trim().length > 0;
  const isFormValid = isAmountValid && isAccountValid && isRemarkValid;

  const isReady = !!accountId;

  useEffect(() => {
    if (!isReady) return;

    const container = accountContainerRef.current;
    const el = accountItemRefs.current[accountId];

    if (!container || !el) return;

    container.scrollTo({
      left: el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [accountId, isReady]);

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    const numberValue = Number(raw || 0);
    setField("amount", numberValue);
  }

  async function handleDelete() {
    if (!defaultValues) return;

    try {
      const result = await deleteBudget(defaultValues.id)
      toast.success("Deleted", { description: result.message })
      navigate("/budgets");
    } catch (error: unknown) {
      let message = "Failed to delete budget";
      if (error instanceof Error) { message = error.message }
      toast.error("Failed to delete", { description: message })
    }
  }

  return (
    <>
      <form>
        <div className="flex flex-col gap-3 p-4">
          {/* AMOUNT */}
          <div id="amount" className="flex justify-center bg-slate-50 border border-slate-100 py-6 rounded-2xl">
            <input
              inputMode="numeric"
              value={amountInput}
              onChange={handleAmountChange}
              placeholder="10,000"
              className="w-full bg-transparent border-none outline-none text-center text-4xl font-extrabold text-black placeholder:text-neutral-300 focus:ring-0" />
          </div>

          {/* ACCOUNT */}
          <div
            ref={accountContainerRef}
            className="flex gap-3 overflow-x-auto no-scrollbar">
            {accounts.map((acc) => {
              const active = accountId === acc.id;

              return (
                <button
                  key={acc.id}
                  ref={(el) => { accountItemRefs.current[acc.id] = el }}
                  type="button"
                  onClick={() => setField("accountId", active ? "" : acc.id)}
                  className={`shrink-0 w-22 flex flex-col items-center gap-2 p-3 rounded-2xl transition cursor-pointer
                    ${active
                      ? "bg-black/90 text-white font-medium"
                      : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"}`}>
                  <img src={getAccountsImg(acc.name)} alt={acc.name} className="w-8 h-8" />
                  <span className="text-xs text-center leading-4">{acc.name}</span>
                </button>
              )
            })}
          </div>

          {/* DATE */}
          <div id="date" className="flex-1">
            <label className="block text-sm text-slate-500 mb-1">Date</label>
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

          {/* REMARK */}
          <div id="remark" className="flex-1">
            <label className="block text-sm text-slate-500 mb-1">Remark</label>
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
      </form>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-4 py-3 space-y-2">
        {isEdit && (
          <button
            type="button"
            onClick={() => setOpenDeleteBudget(true)}
            className="w-full px-5 py-3 text-sm border border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition rounded-xl cursor-pointer">
            <div className="flex items-center justify-center gap-2">
              <Delete02Icon size={16} />
              Delete Budget
            </div>
          </button>
        )}
        <button
          type="submit"
          onClick={() => { onSubmit(getPayload()) }}
          disabled={loading || !isFormValid}
          className={`w-full px-5 py-3 text-sm font-semibold text-white rounded-xl
            ${loading || !isFormValid ? "bg-slate-400 cursor-not-allowed" : "bg-black hover:bg-slate-800 cursor-pointer"}`}>
          {loading ? "Saving..." : isEdit ? "Update Budget" : "Create Budget"}
        </button>
      </div>
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

