import DashboardLayout from "./DashboardLayout";
import type { Transaction } from "../../transactions/types/transaction";
import type { Account } from "../../accounts/types/account";
import type { Category } from "../../categories/types/category";
import { getAccountsImg, getCategoriesImg } from "../../../shared/utils/style.helper";
import { useDashboardFilter } from "../hooks/useDashboardFilter";
import Dropdown from "../../../shared/ui/dropdowns";
import { ArrowDown01Icon, Calendar03Icon, CreditCardIcon, Note05Icon } from "hugeicons-react";
import { PERIOD_OPTIONS } from "../../../shared/constants/period.constant";
import DashboardSectionSummary from "./DashboardSectionSummary";
import { useDashboardData } from "../hooks/useDashboardData";
import DashboardSectionAccountBalanceSummary from "./DashboardSectionAccountBalanceSummary";
import DashboardSectionLayout from "./DashboardSectionLayout";
import DashboardComponentChartDailyExpense from "./DashboardComponentChartDailyExpense";
import DashboardComponentChartTopExpense from "./DashboardComponentChartTopExpense";
import DashboardSectionLayoutCategoryExpense from "./DashboardSectionLayoutCategoryExpense";
import DashboardSectionRecentTransactions from "./DashboardSectionRecentTransactions";

type Props = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  refetch: () => Promise<void>;
}

export default function DashboardDesktop({ transactions, accounts, categories, refetch }: Props) {
  const { period, setPeriod, selectedAccount, setSelectedAccount, selectedCategory, setSelectedCategory, filteredTransactions } = useDashboardFilter({ transactions });

  const selectedAccountData = accounts.find(
    (acc) => acc.id === selectedAccount
  );

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  const dashboardFiltered = useDashboardData({
    transactions: filteredTransactions,
    accounts,
    categories,
    refetch,
  });

  const dashboardAll = useDashboardData({
    transactions,
    accounts,
    categories,
    refetch,
  });

  return (
    <DashboardLayout>
      <DashboardSectionSummary summary={dashboardAll.summary} />
      <DashboardSectionAccountBalanceSummary accounts={dashboardAll.accountsWithBalance} autoScroll={true} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1 flex-1 min-w-60">
          <span className="text-slate-500 text-xs">
            Period
          </span>

          <Dropdown
            width="w-60"
            trigger={({ toggle }) => (
              <button
                onClick={toggle}
                className="flex items-center justify-between w-full p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer gap-4"
              >
                <div className="flex items-center gap-3">
                  <Calendar03Icon
                    className="text-slate-400"
                    size={16}
                  />

                  <span className="text-sm text-black">
                    {
                      PERIOD_OPTIONS.find(
                        (item) => item.value === period
                      )?.label
                    }
                  </span>
                </div>

                <ArrowDown01Icon
                  className="text-slate-400"
                  size={16}
                />
              </button>
            )}
          >
            {({ close }) => (
              <>
                {PERIOD_OPTIONS.map((item) => {
                  const isSelected =
                    period === item.value;

                  return (
                    <div
                      key={item.value}
                      onClick={() => {
                        setPeriod(item.value);
                        close();
                      }}
                      className={`px-4 py-3 text-sm border-b border-slate-50 cursor-pointer ${isSelected
                        ? "bg-slate-100 font-medium"
                        : "text-slate-400 hover:bg-slate-50"
                        }`}
                    >
                      {item.label}
                    </div>
                  );
                })}
              </>
            )}
          </Dropdown>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-60">
          <span className="text-slate-500 text-xs">Accounts</span>
          <Dropdown
            width="w-60"
            trigger={({ toggle }) => (
              <button
                onClick={toggle}
                className="flex items-center justify-between w-full p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer gap-4">
                <div className="flex items-center gap-3">
                  <CreditCardIcon
                    className="text-slate-400"
                    size={16} />
                  <span className={`text-sm ${selectedAccountData ? "text-black" : "text-slate-400"}`}>
                    {selectedAccountData?.name ?? "All Accounts"}
                  </span>
                </div>
                <ArrowDown01Icon className="text-slate-400" size={16} />
              </button>
            )}>
            {({ close }) => (
              <div className="h-60 overflow-y-auto">
                <div
                  onClick={() => {
                    setSelectedAccount(null);
                    close();
                  }}
                  className={`p-4 text-sm border-b border-slate-50 cursor-pointer ${!selectedAccount
                    ? "bg-slate-100 font-medium"
                    : "text-slate-400 hover:bg-slate-50"}`}>
                  All Accounts
                </div>
                {accounts.map((acc) => {
                  const isSelected = selectedAccount === acc.id;

                  return (
                    <div
                      key={acc.id}
                      onClick={() => {
                        setSelectedAccount(acc.id);
                        close();
                      }}
                      className={`flex items-center gap-4 px-4 py-3 text-sm border-b border-slate-50 cursor-pointer ${isSelected
                        ? "bg-slate-100 font-medium"
                        : "text-slate-400 hover:bg-slate-50"}`}>
                      <img src={getAccountsImg(acc.name)} className="w-6 h-6" />
                      <span>{acc.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Dropdown>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-60">
          <span className="text-slate-500 text-xs">Categories</span>
          <Dropdown
            width="w-60"
            trigger={({ toggle }) => (
              <button
                onClick={toggle}
                className="flex items-center justify-between w-full p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer gap-4">
                <div className="flex items-center gap-3">
                  <Note05Icon
                    className="text-slate-400"
                    size={16} />
                  <span className={`text-sm ${selectedCategoryData ? "text-black" : "text-slate-400"}`}>
                    {selectedCategoryData?.name ?? "All Categories"}
                  </span>
                </div>
                <ArrowDown01Icon className="text-slate-400" size={16} />
              </button>
            )}>
            {({ close }) => (
              <div className="h-60 overflow-y-auto">
                <div
                  onClick={() => {
                    setSelectedCategory(null);
                    close();
                  }}
                  className={`p-4 text-sm border-b border-slate-50 cursor-pointer ${!selectedCategory
                    ? "bg-slate-100 font-medium"
                    : "text-slate-400 hover:bg-slate-50"}`}>
                  All Categories
                </div>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        close();
                      }}
                      className={`flex items-center gap-4 px-4 py-3 text-sm border-b border-slate-50 cursor-pointer ${isSelected
                        ? "bg-slate-100 font-medium"
                        : "text-slate-400 hover:bg-slate-50"}`}>
                      <img src={getCategoriesImg(cat.name)} className="w-6 h-6" />
                      <span>{cat.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Dropdown>
        </div>
      </div>
      <DashboardSectionLayout title="Daily Expense">
        <DashboardComponentChartDailyExpense data={dashboardFiltered.dailyExpense} />
      </DashboardSectionLayout>

      <div className="grid grid-cols-12 items-stretch gap-4">
        <div className="col-span-12 lg:col-span-8">
          <DashboardSectionLayout title="Top Expense">
            <DashboardComponentChartTopExpense data={dashboardFiltered.topExpenses} />
          </DashboardSectionLayout>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <DashboardSectionLayout title="Category Expense">
            <DashboardSectionLayoutCategoryExpense transactions={filteredTransactions} categories={categories} />
          </DashboardSectionLayout>
        </div>
      </div>

      <DashboardSectionLayout title="Recently Transactions" button={{ label: "View more", url: "/transactions" }}>
        <DashboardSectionRecentTransactions
          transactions={filteredTransactions}
          accounts={accounts}
          categories={categories}
          refetch={refetch} />
      </DashboardSectionLayout>
    </DashboardLayout >
  );
}