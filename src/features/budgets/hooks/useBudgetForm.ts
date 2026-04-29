import { useState } from "react";
import type { Budget } from "../types/budget";
import { normalizeDate } from "../../../shared/utils/format.helper";

type FormState = {
  id: string;
  date: string;
  accountId: string;
  remark: string;
  amount: number;
};

export function useBudgetForm(defaultValues?: Budget) {
  const [form, setForm] = useState<FormState>(() => ({
    id: defaultValues?.id || "",
    date: normalizeDate(defaultValues?.date),
    accountId: defaultValues?.accountId || "",
    remark: defaultValues?.remark || "",
    amount: defaultValues?.amount || 0
  }));

  function setField<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function getPayload() {
    return {
      id: defaultValues?.id,
      date: form.date,
      accountId: form.accountId,
      remark: form.remark,
      amount: form.amount,
    };
  }

  function reset() {
    setForm({
      id: defaultValues?.id || "",
      date: normalizeDate(defaultValues?.date),
      accountId: defaultValues?.accountId || "",
      remark: defaultValues?.remark || "",
      amount: defaultValues?.amount || 0
    });
  }

  return {
    form,
    setForm,
    setField,
    getPayload,
    reset,
  }
}