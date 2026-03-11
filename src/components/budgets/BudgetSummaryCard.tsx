import { DollarCircleIcon, NoteEditIcon, Target02Icon } from "hugeicons-react";
import {
  formatMonthYear,
  formatNumber,
  formatRupiah,
} from "../../helpers/Format";
import type { Budgets } from "../../types/Budgets";
import { toast } from "sonner";
import { useState } from "react";
import BottomSheet from "../utils/BottomSheet";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../services/APIServices";

interface Props {
  balance: number;
  totalBudget: number;
  totalAllocated: number;
  percentage: number;
  styles: {
    bar: string;
    badge: string;
  };
  budget?: Budgets;
  selectedPeriod: string;
}

export default function BudgetSummaryCard({
  balance,
  totalBudget,
  totalAllocated,
  percentage,
  styles,
  budget,
  selectedPeriod,
}: Props) {
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);

  const [form, setForm] = useState({
    nominal: 0,
  });

  const [formattedNominal, setFormattedNominal] = useState("");

  const isDisabled = form.nominal <= 0;

  const handleNominalChange = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    const numberValue = Number(numeric);

    setForm((prev) => ({
      ...prev,
      nominal: numberValue,
    }));

    setFormattedNominal(numberValue ? formatNumber(numberValue) : "");
  };

  const handleEditBudget = () => {
    if (!budget) {
      toast.error("Budget belum dibuat untuk periode ini", {
        duration: 2000,
      });
      return;
    }

    setForm({
      nominal: budget.nominal ?? 0,
    });

    setFormattedNominal(budget.nominal ? formatNumber(budget.nominal) : "");

    setOpenEdit(true);
  };

  const onSubmit = async () => {
    if (!budget) return;

    const updatedBudget = {
      module: "budgets",
      action: "edit",
      ...budget,
      nominal: form.nominal,
      period: selectedPeriod,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(updatedBudget),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Success", {
          description: result.message,
          duration: 2000,
          onAutoClose: () => navigate("/budgets"),
        });
      } else {
        toast.error("Failed to save budget", { duration: 2000 });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong!", {
        duration: 2000,
      });
    }

    setOpenEdit(false);
  };

  return (
    <div>
      <section className="mx-4 mt-4 mb-6">
        <div className="bg-white p-4 rounded-2xl flex flex-col gap-5">
          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
              <div className="flex justify-center items-center bg-slate-50 rounded-lg p-2">
                <Target02Icon className="w-5 h-5 text-slate-900" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-base text-slate-900">
                  Total Budget
                </span>
                <span className="text-xs text-slate-400">
                  Pantau penggunaan budget
                </span>
              </div>
            </div>
            <div
              onClick={handleEditBudget}
              className="px-2 text-sm bg-amber-50 font-medium flex items-center rounded-lg gap-2 border text-amber-500 hover:bg-amber-100/70 cursor-pointer"
            >
              <NoteEditIcon className="w-4 h-4" />
              <span>Edit</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold">{formatRupiah(balance)}</span>
            <span className="text-xs text-slate-400">
              dari total {formatRupiah(totalBudget)}
            </span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-indigo-50 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${styles.bar} rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between">
              <div className="text-xs space-x-1">
                <span className="text-slate-900 font-medium">
                  {formatRupiah(totalAllocated)}
                </span>
                <span className="text-slate-400">terpakai</span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}
              >
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      </section>

      <BottomSheet
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        title={`Budget ${formatMonthYear(selectedPeriod)}`}
      >
        <div className="pb-6">
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Nominal
          </label>
          <div className="relative flex items-center justify-center">
            <div className="absolute left-4 pointer-events-none">
              <DollarCircleIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input
              value={formattedNominal}
              onChange={(e) => handleNominalChange(e.target.value)}
              inputMode="numeric"
              className="block w-full ps-11 pe-3 py-2.5 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>
        <button
          onClick={onSubmit}
          disabled={isDisabled}
          className="w-full rounded-full bg-slate-900 py-3 text-sm font-medium
            text-white hover:bg-slate-800 active:scale-95 transition
            disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          Edit Budget
        </button>
      </BottomSheet>
    </div>
  );
}
