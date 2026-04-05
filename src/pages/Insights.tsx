import { useMonthNavigation } from "../hooks/utils/useMonthNavigation";
import MonthNavigator from "../components/dashboards/MonthNavigator";
import { formatRupiah, MONTHS } from "../helpers/Format";
import { useTransactions } from "../hooks/transactions/useTransactions";
import { useLocalStorage } from "../hooks/utils/useLocalStorage";
import { useMemo, useState } from "react";
import FilterAccounts from "../components/insights/FilterAccounts";
import TopExpensesChart from "../components/insights/TopExpensesChart";
import InsightSkeleton from "../components/skeletons/InsightSkeleton";
import TransactionGroup from "../components/dashboards/TransactionGroup";
import { useGroupedTransactions } from "../hooks/transactions/useGroupedTransactions";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/utils/EmptyState";
import BalanceSummary from "../components/insights/BalanceSummary";
import CategoryExpensesSection from "../components/insights/CategoryExpensesSection";
import ExpensesChart from "../components/insights/ExpensesChart";
import { InvoiceIcon } from "hugeicons-react";

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

  const { flatTransactions, visibleGrouped, visibleDates } =
    useGroupedTransactions(filteredTransactions, visibleCount);

  const [openSwipe, setOpenSwipe] = useState<string | null>(null);
  const isEmptyTransaction = flatTransactions.length === 0;

  // summary
  const { income, expenses, balance, transfer } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let transfer = 0;

    filteredTransactions.forEach((trx) => {
      const amount = Number(trx.nominal);

      if (trx.type === "income") income += amount;
      else if (trx.type === "expenses") expenses += amount;
      else if (trx.type === "transfer") transfer += amount;
    });

    return {
      income,
      expenses,
      transfer,
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

      <BalanceSummary
        balance={balance}
        income={income}
        expenses={expenses}
        transfer={transfer}
        hideBalance={hideBalance}
        setHideBalance={setHideBalance}
        formatRupiah={formatRupiah}
      />

      <section className="bg-slate-50 min-h-dvh p-4 space-y-4 pb-24">
        {!isEmptyTransaction && (
          <FilterAccounts
            transactions={transactions}
            selectedAccount={selectedAccount}
            onSelectAccount={setSelectedAccount}
          />
        )}

        <section className="bg-white rounded-2xl p-4">
          <span className="text-base font-medium">Daily Expenses</span>
          <div className="h-px bg-slate-100/60 my-3" />
          {isEmptyTransaction ? (
            <EmptyState icon={<InvoiceIcon/>} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow." />
          ) : (
            <ExpensesChart transactions={expenseTransactions} hideBalance={hideBalance}/>
          )}
        </section>

        <section className="bg-white rounded-2xl p-4">
          <span className="text-base font-medium">Top 5 Expenses</span>
          <div className="h-px bg-slate-100/60 my-3" />
          {isEmptyTransaction ? (
            <EmptyState icon={<InvoiceIcon/>} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow." />
          ) : (
            <TopExpensesChart
              transactions={expenseTransactions}
              data={5}
              labelLength={20}
              hideBalance={hideBalance} />
          )}
        </section>

        <CategoryExpensesSection
          isEmpty={isEmptyTransaction}
          pieData={pieData}
          COLORS={COLORS}
          visibleCategories={visibleCategories}
          categorySummary={categorySummary}
          showAllCategories={showAllCategories}
          setShowAllCategories={setShowAllCategories}
          formatRupiah={formatRupiah}
          hideBalance={hideBalance}
        />

        <section className="bg-white rounded-2xl py-4">
          <div className="flex justify-between px-4">
            <span className="text-base font-medium">List Transactions</span>
            {isEmptyTransaction ? (
              ""
            ) : (
              <span className="text-sm text-slate-400 cursor-pointer">
                Show All
              </span>
            )}
          </div>
          <div className="h-px bg-slate-100/60 mt-3" />
          {isEmptyTransaction ? (
            <EmptyState icon={<InvoiceIcon/>} title="No transactions yet" subtitle="Add your first income or expense to start tracking your cash flow." />
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
