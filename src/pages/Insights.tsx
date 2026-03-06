import { useMonthNavigation } from "../hooks/utils/useMonthNavigation";
import Header from "../components/navigation/Header";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import { formatRupiah, MONTHS } from "../helpers/Format";
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useLocalStorage } from "../hooks/utils/useLocalStorage";
import ExpensesChart from "../components/insights/ExpensesChart";
import CategoriesChart from "../components/insights/CategoriesChart";
import { useMemo, useState } from "react";
import FilterAccounts from "../components/insights/FilterAccounts";

export default function Insight() {
  const { monthIndex, prev, next, startDate, endDate } = useMonthNavigation();
  const selectedMonth = MONTHS[monthIndex];

  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // transaksi sesuai periode bulan
  const { transactions } = useTransactions(startDate, endDate);

  // filter account
  const filteredTransactions = useMemo(() => {
    if (!selectedAccount) return transactions;

    return transactions.filter((trx) => {
      if (trx.type === "income") {
        return trx.to_account === selectedAccount;
      }

      if (trx.type === "expenses") {
        return trx.from_account === selectedAccount;
      }

      if (trx.type === "transfer") {
        return (
          trx.from_account === selectedAccount ||
          trx.to_account === selectedAccount
        );
      }

      return false;
    });
  }, [transactions, selectedAccount]);

  // summary
  const { income, expenses, balance } = useMemo(() => {
    let income = 0;
    let expenses = 0;

    filteredTransactions.forEach((trx) => {
      const amount = Number(trx.nominal);

      if (trx.type === "income") income += amount;
      if (trx.type === "expenses") expenses += amount;
    });

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [filteredTransactions]);

  // hanya expenses untuk chart
  const expenseTransactions = useMemo(() => {
    return filteredTransactions.filter((trx) => trx.type === "expenses");
  }, [filteredTransactions]);

  return (
    <div className="bg-slate-700 flex flex-col">
      <Header title="Insight" textColor="text-white" />

      <MonthNavigator
        selectedMonth={selectedMonth}
        onPrev={prev}
        onNext={next}
        startDate={startDate}
        endDate={endDate}
      />

      <section className="p-4 flex flex-col gap-4">
        <div className="flex flex-1 justify-between items-center bg-white/20 rounded-xl p-4">
          <div className="flex flex-col">
            <span className="text-sm text-white/60">Balance</span>
            <span className="text-2xl text-white font-semibold">
              {hideBalance ? "Rp •••••••••••" : formatRupiah(balance)}
            </span>
          </div>

          <button
            onClick={() => setHideBalance((prev) => !prev)}
            className="cursor-pointer"
          >
            {hideBalance ? (
              <ViewIcon strokeWidth={2} className="text-white" />
            ) : (
              <ViewOffSlashIcon strokeWidth={2} className="text-white" />
            )}
          </button>
        </div>

        <div className="flex gap-4 py-2">
          <div className="flex-1">
            <span className="text-sm text-white/60">Income</span>
            <div className="text-base text-white font-medium">
              {hideBalance ? "Rp •••••••••••" : formatRupiah(income)}
            </div>
          </div>

          <div className="flex-1">
            <span className="text-sm text-white/60">Expenses</span>
            <div className="text-base text-white font-medium">
              {hideBalance ? "Rp •••••••••••" : formatRupiah(expenses)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 min-h-dvh p-4 space-y-4">
        {/* 🔥 IMPORTANT */}
        {/* pakai transactions (periode bulan) */}
        <FilterAccounts
          transactions={transactions}
          selectedAccount={selectedAccount}
          onSelectAccount={setSelectedAccount}
        />

        <section className="bg-white rounded-2xl p-4">
          <span className="text-base font-medium">
            Grafik Pengeluaran Harian
          </span>
          <ExpensesChart transactions={expenseTransactions} />
        </section>

        <section className="bg-white rounded-2xl p-4">
          <span className="text-base font-medium">
            Grafik Pengeluaran Kategori
          </span>
          <CategoriesChart transactions={expenseTransactions} />
        </section>
      </section>
    </div>
  );
}
