import { useState } from "react";
import type { Transaction } from "../types/transaction";

type FormState = {
  typeId: string;
  date: string;
  fromAccountId: string;
  toAccountId: string;
  categoryId: string;
  remark: string;
  amount: number;
};

export function useTransactionForm(defaultValues?: Transaction) {
  const [form, setForm] = useState<FormState>(() => ({
    typeId: defaultValues?.typeId || "TP002",
    date: defaultValues?.date || new Date().toISOString().split("T")[0],
    fromAccountId: defaultValues?.fromAccountId || "",
    toAccountId: defaultValues?.toAccountId || "",
    categoryId: defaultValues?.categoryId || "",
    remark: defaultValues?.remark || "",
    amount: defaultValues?.amount || 0,
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
      typeId: form.typeId,
      categoryId:
        form.typeId === "TP001" || form.typeId === "TP002"
          ? form.categoryId || undefined
          : undefined,
      fromAccountId:
        form.typeId === "TP002" || form.typeId === "TP003"
          ? form.fromAccountId || undefined
          : undefined,
      toAccountId:
        form.typeId === "TP001" || form.typeId === "TP003"
          ? form.toAccountId || undefined
          : undefined,
      remark: form.remark,
      amount: form.amount,
    };
  }

  function handleTypeChange(newType: string) {
    setForm((prev) => ({
      ...prev,
      typeId: newType,
      fromAccountId: "",
      toAccountId: "",
    }));
  }

  function reset() {
    setForm({
      typeId: defaultValues?.typeId || "TP002",
      date: defaultValues?.date || new Date().toISOString().split("T")[0],
      fromAccountId: defaultValues?.fromAccountId || "",
      toAccountId: defaultValues?.toAccountId || "",
      categoryId: defaultValues?.categoryId || "",
      remark: defaultValues?.remark || "",
      amount: defaultValues?.amount || 0,
    });
  }

  return {
    form,
    setForm,
    setField,
    handleTypeChange,
    getPayload,
    reset,
  }
}