import { useState } from "react";
import type { Transaction } from "../types/transaction";
import { normalizeDate } from "../../../shared/utils/format.helper";
import type { FormData } from "../utils/transaction.form.helper";

type FormState = {
  typeId: string;
  date: string;
  fromAccountId: string;
  toAccountId: string;
  categoryId: string;
  remark: string;
  amount: number;
};

function getInitialForm(defaultValues?: Transaction): FormState {
  return {
    typeId: defaultValues?.typeId || "TP002",
    date:
      normalizeDate(defaultValues?.date) ||
      normalizeDate(new Date()),
    fromAccountId:
      defaultValues?.fromAccountId || "",
    toAccountId:
      defaultValues?.toAccountId || "",
    categoryId:
      defaultValues?.categoryId || "",
    remark:
      defaultValues?.remark || "",
    amount:
      defaultValues?.amount || 0,
  };
}


export function useTransactionForm(defaultValues?: Transaction) {
  const [form, setForm] = useState<FormState>(() =>
    getInitialForm(defaultValues)
  );

  function setField<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function getPayload(): FormData {
    return {
      id: defaultValues?.id,
      date: form.date,
      typeId: form.typeId,
      categoryId:
        form.typeId === "TP001" || form.typeId === "TP002"
          ? form.categoryId || null
          : null,
      fromAccountId:
        form.typeId === "TP002" || form.typeId === "TP003"
          ? form.fromAccountId || null
          : null,
      toAccountId:
        form.typeId === "TP001" || form.typeId === "TP003"
          ? form.toAccountId || null
          : null,
      amount: form.amount,
      remark: form.remark
    };
  }

  function handleTypeChange(newType: string) {
    setForm((prev) => ({
      ...prev,
      typeId: newType,
      fromAccountId: "",
      toAccountId: "",
      categoryId: "",
    }));
  }

  function reset() {
    setForm(getInitialForm(defaultValues))
  }

  return {
    form,
    setForm,
    setField,
    handleTypeChange,
    getPayload,
    reset,
  };
}