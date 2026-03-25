import { useMonthNavigation } from "../hooks/utils/useMonthNavigation";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import { formatRupiah, MONTHS } from "../helpers/Format";
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useLocalStorage } from "../hooks/utils/useLocalStorage";
import ExpensesChart from "../components/insights/ExpensesChart";
import CategoriesChart from "../components/insights/CategoriesChart";
import { useMemo, useState } from "react";
import FilterAccounts from "../components/insights/FilterAccounts";
import TopExpensesChart from "../components/insights/TopExpensesChart";
import InsightSkeleton from "../components/skeletons/InsightSkeleton";
import TransactionGroup from "../components/dashboards/TransactionGroup";
import { useGroupedTransactions } from "../hooks/transactions/useGroupedTransactions";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/utils/EmptyState";

const COLORS = ["#5070DD", "#B6D634", "#FF994D", "#0CA8DF", "#505372"];

export default function Insight() {
  const navigate = useNavigate();
  const { monthIndex, prev, next, startDate, endDate } = useMonthNavigation();
  const selectedMonth = MONTHS[monthIndex];

  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const PAGE_SIZE = 5;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const isExpanded = visibleCount > PAGE_SIZE;

  const { transactions, loading, deleteTransaction } = useTransactions(
    startDate,
    endDate,
  );
  const { flatTransactions, visibleGrouped, visibleDates } =
    useGroupedTransactions(transactions, visibleCount);
  const [openSwipe, setOpenSwipe] = useState<string | null>(null);
  const isEmpty = flatTransactions.length === 0;

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

  const expenseTransactions = useMemo(() => {
    return filteredTransactions.filter((trx) => trx.type === "expenses");
  }, [filteredTransactions]);

  // 🔥 PIE DATA
  const pieData = useMemo(() => {
    const grouped: Record<string, number> = {};

    expenseTransactions.forEach((trx) => {
      const category = trx.category;

      if (!grouped[category]) grouped[category] = 0;

      grouped[category] += Number(trx.nominal);
    });

    const sorted = Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const top4 = sorted.slice(0, 4);
    const rest = sorted.slice(4);

    const othersValue = rest.reduce((sum, item) => sum + item.value, 0);

    if (othersValue > 0) {
      top4.push({
        name: "Others",
        value: othersValue,
      });
    }

    return top4;
  }, [expenseTransactions]);

  const categorySummary = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {};

    expenseTransactions.forEach((trx) => {
      const category = trx.category;

      if (!grouped[category]) {
        grouped[category] = {
          total: 0,
          count: 0,
        };
      }

      grouped[category].total += Number(trx.nominal);
      grouped[category].count += 1;
    });

    return Object.entries(grouped)
      .map(([name, data]) => ({
        name,
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenseTransactions]);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = showAllCategories
    ? categorySummary
    : categorySummary.slice(0, 4);

  if (loading) {
    return <InsightSkeleton />;
  }

  return (
    <div className="bg-slate-900 flex flex-col">
      <MonthNavigator
        selectedMonth={selectedMonth}
        onPrev={prev}
        onNext={next}
        startDate={startDate}
        endDate={endDate}
      />

      <section className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
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

      <section className="bg-slate-50 min-h-dvh p-4 space-y-4 pb-24">
        {isEmpty ? (
          ""
        ) : (
          <FilterAccounts
            transactions={transactions}
            selectedAccount={selectedAccount}
            onSelectAccount={setSelectedAccount}
          />
        )}

        <section className="bg-white rounded-2xl p-4">
          <span className="text-base font-medium">Daily Expenses</span>
          <div className="h-px bg-slate-100/60 my-3" />
          {isEmpty ? (
            <EmptyState />
          ) : (
            <ExpensesChart transactions={expenseTransactions} />
          )}
        </section>

        <section className="bg-white rounded-2xl p-4">
          <span className="text-base font-medium">Top 5 Expenses</span>
          <div className="h-px bg-slate-100/60 my-3" />
          {isEmpty ? (
            <EmptyState />
          ) : (
            <TopExpensesChart transactions={expenseTransactions} />
          )}
        </section>

        <section className="bg-white rounded-2xl p-4">
          <span className="text-base font-medium">Expenses by Category</span>
          <div className="h-px bg-slate-100/60 my-3" />
          {isEmpty ? (
            <EmptyState />
          ) : (
            <>
              <CategoriesChart data={pieData} colors={COLORS} />
              {/* LEGEND CategoriesChart */}
              <div className="space-y-3 -mt-15">
                {visibleCategories.map((item, i) => {
                  const color = COLORS[i] || COLORS[COLORS.length - 1];

                  return (
                    <div
                      key={item.name}
                      className="flex justify-between items-center border border-slate-200/60 rounded-2xl px-4 py-3 hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="w-5 h-2 mt-2 rounded-sm"
                          style={{ background: color }}
                        />

                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {item.name}
                          </span>

                          <span className="text-xs text-slate-400">
                            {item.count} transaksi
                          </span>
                        </div>
                      </div>

                      <span className="text-sm font-semibold">
                        {formatRupiah(item.total)}
                      </span>
                    </div>
                  );
                })}
                {categorySummary.length > 4 && (
                  <button
                    onClick={() => setShowAllCategories((prev) => !prev)}
                    className="w-full border border-slate-200/60 rounded-2xl px-4 py-3 text-sm font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    {showAllCategories ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </>
          )}
        </section>

        <section className="bg-white rounded-2xl py-4">
          <div className="flex justify-between px-4">
            <span className="text-base font-medium">List Transactions</span>
            {isEmpty ? (
              ""
            ) : (
              <span className="text-sm text-slate-400 cursor-pointer">
                Show All
              </span>
            )}
          </div>
          <div className="h-px bg-slate-100/60 mt-3" />
          {isEmpty ? (
            <EmptyState />
          ) : (
            <>
              {visibleDates.map((date) => (
                <TransactionGroup
                  key={date}
                  date={date}
                  transactions={visibleGrouped[date]}
                  openSwipe={openSwipe}
                  setOpenSwipe={setOpenSwipe}
                  onDeleteConfirm={deleteTransaction}
                />
              ))}
            </>
          )}

          {!loading && flatTransactions.length > PAGE_SIZE && (
            <div className="my-4 px-4">
              <button
                className="w-full border border-slate-200 text-slate-900 py-3 rounded-lg cursor-pointer hover:bg-slate-200 text-sm font-medium transition-all"
                onClick={() => {
                  if (!isExpanded) {
                    setVisibleCount(PAGE_SIZE * 2);
                  } else {
                    navigate("/transactions");
                  }
                }}
              >
                {isExpanded ? "Show all transactions" : "Load more"}
              </button>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
