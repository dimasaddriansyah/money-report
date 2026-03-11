import { useEffect, useState } from "react";
import Header from "../../components/navigation/Header";
import {
  ArrowDown01Icon,
  CreditCardIcon,
  DollarCircleIcon,
} from "hugeicons-react";
import BottomSheet from "../../components/utils/BottomSheet";
import { useAccounts } from "../../hooks/accounts/useAccounts";
import { getAccountsImg } from "../../helpers/UI";
import { useNavigate, useParams } from "react-router-dom";
import { useBudgets } from "../../hooks/budgets/useBudgets";
import {
  formatISODatetoID,
  formatRupiahInput,
  getTodayISO,
} from "../../helpers/Format";
import { API_URL } from "../../services/APIServices";
import { toast } from "sonner";

interface BudgetForm {
  account: string;
  nominal: number;
  remark: string;
}

export default function BudgetFormPages() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { accounts } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState("");
  const [openAccountSheet, setOpenAccountSheet] = useState(false);

  const { budgets } = useBudgets();

  const budget = budgets.find((b) => b.budget_id === id);

  const [form, setForm] = useState<BudgetForm>({
    account: "",
    nominal: 0,
    remark: "",
  });

  useEffect(() => {
    if (!budget) return;

    setForm({
      account: budget.account,
      nominal: budget.nominal,
      remark: budget.remark,
    });

    setSelectedAccount(budget.account);
  }, [budget]);

  const handleSubmit = async () => {
    const payload = {
      module: "budgets",
      action: isEdit ? "edit" : "create",
      budget_id: id,
      ...form,
      date: formatISODatetoID(getTodayISO()),
    };

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Success", {
          description: result.message,
          duration: 2000,
          onAutoClose: () => navigate("/budgets"),
        });
      } else {
        toast.error("Failed to save transaction", { duration: 2000 });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong!", {
        duration: 2000,
      });
    }
  };

  const formattedNominal = formatRupiahInput(form.nominal.toString());
  const handleNominalChange = (value: string) => {
    const raw = Number(value.replace(/\D/g, ""));
    return raw;
  };

  return (
    <main className="min-h-dvh flex flex-col">
      <Header title={isEdit ? "Edit Budget" : "Create Budget"} showBack />

      <section className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Account
          </label>
          <div className="relative flex items-center justify-center">
            <div className="absolute left-4 pointer-events-none">
              <CreditCardIcon className="w-5 h-5 text-slate-400" />
            </div>
            <span
              onClick={() => setOpenAccountSheet(true)}
              className={`block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border ${form.account ? "text-slate-900" : "text-slate-400"} border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none`}
            >
              {selectedAccount || "Select account"}
            </span>
            <ArrowDown01Icon className="absolute right-4 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Nominal
          </label>
          <div className="relative flex items-center justify-center">
            <div className="absolute left-4 pointer-events-none">
              <DollarCircleIcon className="w-5 h-5 text-slate-400" />
            </div>
            <input
              placeholder="Input nominal"
              value={formattedNominal}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  nominal: handleNominalChange(e.target.value),
                }))
              }
              className="block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border text-slate-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Remark
          </label>
          <textarea
            rows={3}
            value={form.remark}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                remark: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-gray-300 p-3"
          />
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
          <button
            onClick={handleSubmit}
            className="mt-auto w-full rounded-xl bg-slate-900 py-3 text-sm font-medium
            text-white hover:bg-slate-800 active:scale-95 transition
            disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading
              ? "Processing..."
              : isEdit
                ? "Update Budget"
                : "Add Budget"}
          </button>
        </div>
      </section>

      <BottomSheet
        open={openAccountSheet}
        onClose={() => setOpenAccountSheet(false)}
        title="Select Account"
      >
        <div className="divide-y divide-slate-100/60">
          {accounts.map((data) => (
            <div
              key={data.account_id}
              onClick={() => {
                setSelectedAccount(data.name);
                setForm((prev) => ({
                  ...prev,
                  account: data.name,
                }));
                setOpenAccountSheet(false);
              }}
              className={`w-full flex items-center gap-3 text-left px-2 py-3 rounded-2xl transition cursor-pointer
                ${
                  form.account === data.name
                    ? "bg-slate-900 font-medium text-white"
                    : "hover:bg-slate-100"
                }`}
            >
              <img
                src={getAccountsImg(data.name)}
                alt={data.name}
                className="w-8 h-8"
              />
              <span>{data.name}</span>
            </div>
          ))}
        </div>
      </BottomSheet>
    </main>
  );
}
