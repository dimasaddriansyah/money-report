import { useMonthNavigation } from "../hooks/utils/useMonthNavigation";
import Header from "../components/navigation/Header";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import { formatRupiah, MONTHS } from "../helpers/Format";
import ExpensesChart from "../components/insights/expensesChart";
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import AccountBalances from "../components/dashboards/AccountBalances";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useLocalStorage } from "../hooks/utils/useLocalStorage";

export default function Insight() {
  const { monthIndex, prev, next, startDate, endDate } = useMonthNavigation();
  const selectedMonth = MONTHS[monthIndex];
  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false);
  const { allTransactions } = useTransactions(startDate, endDate);

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
              {hideBalance ? "Rp •••••••••••" : formatRupiah(120000)}
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
          <div className="flex-1 rounded-xl">
            <div className="flex flex-col">
              <span className="text-sm text-white/60">Income</span>
              <span className="text-base text-white font-medium">
                {hideBalance ? "Rp •••••••••••" : formatRupiah(1400000)}
              </span>
            </div>
          </div>

          <div className="flex-1 rounded-xl">
            <div className="flex flex-col">
              <span className="text-sm text-white/60">Expenses</span>
              <span className="text-base text-white font-medium">
                {hideBalance ? "Rp •••••••••••" : formatRupiah(1400000)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 min-h-dvh p-4 space-y-4">
        <AccountBalances
          transactions={allTransactions}
          hide={hideBalance}
          cardStyle="border border-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
          accountTextColor="text-slate-400! group-hover:text-white/70!"
          balanceTextColor="text-slate-900! group-hover:text-white!"
        />

        <section className="bg-white rounded-2xl p-4">
          <span className="text-base font-medium">
            Grafik Pengeluaran Harian
          </span>
          <ExpensesChart />
        </section>
      </section>
    </div>
  );
}
