import { useState } from "react";
import { toast } from "sonner";
import { formatNumber, normalizeDate } from "../../../shared/utils/format.helper";
import { useBudgetActions } from "./useBudgetActions";
import type { Budget } from "../types/budget";

export function useBudgetEdit(
  refetch?: () => Promise<void>
) {
  const { updateBudget, loading } = useBudgetActions(refetch);

  const [amount, setAmount] = useState(0);
  const [amountInput, setAmountInput] = useState("");

  function handleAmountChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const raw = e.target.value.replace(/\D/g, "");

    const numeric = Number(raw);

    setAmount(numeric);
    setAmountInput(formatNumber(numeric));
  }

  function reset() {
    setAmount(0);
    setAmountInput("");
  }

  function open(budget: Budget) {
    setAmount(budget.amount);
    setAmountInput(formatNumber(budget.amount));
  }

  async function save(budget: Budget) {
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return false;
    }

    await updateBudget({
      id: budget.id,
      date: normalizeDate(budget.date),
      accountId: budget.accountId,
      remark: budget.remark,
      amount,
    });

    toast.success("Budget updated");

    reset();

    return true;
  }

  return {
    loading,
    amount,
    amountInput,
    handleAmountChange,
    save,
    open,
    reset,
  };
}