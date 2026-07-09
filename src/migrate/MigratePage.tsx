// import { useAccounts } from "../features/accounts/hooks/useAccounts";
// import { useBudgets } from "../features/budgets/hooks/useBudgets";
// import { useCategories } from "../features/categories/hooks/useCategories";
// import { useTransactions } from "../features/transactions/hooks/useTransactions";
// import { migrateAccounts } from "./accounts.migrate";
// import { migrateBudgets } from "./budgets.migrate";
// import { migrateCategories } from "./categories.migrate";
// import { migrateTransactions } from "./transactions.migrate";

export default function MigratePage() {
  // const { accounts } = useAccounts();
  // const { categories } = useCategories();
  // const { budgets } = useBudgets();
  // const { transactions } = useTransactions();
  // const transactionsWithoutDay = transactions.map(({ day, ...rest }) => rest);

  // const handleMigrateAccounts = async () => {
  //   if (!accounts.length) {
  //     alert("Account data belum tersedia.");
  //     return;
  //   }
  //   await migrateAccounts(accounts);
  //   alert("Migration selesai!");
  // };

  // const handleMigrateCategories = async () => {
  //   if (!categories.length) {
  //     alert("Category data belum tersedia.");
  //     return;
  //   }
  //   await migrateCategories(categories);
  //   alert("Migration selesai!");
  // };

  // const handleMigrateBudgets = async () => {
  //   if (!budgets.length) {
  //     alert("Budget data belum tersedia.");
  //     return;
  //   }
  //   await migrateBudgets(budgets);
  //   alert("Migration selesai!");
  // };

  // const handleMigrateTransactions = async () => {
  //   if (!transactionsWithoutDay.length) {
  //     alert("Transaction data belum tersedia.");
  //     return;
  //   }
  //   await migrateTransactions(transactionsWithoutDay);
  //   alert("Migration selesai!");
  // };

  return (
    // <div className="p-6 grid grid-cols-2 gap-4">
    //   <button
    //     onClick={handleMigrateAccounts}
    //     className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-black/80 cursor-pointer">
    //     <span className="text-sm">Migrate Accounts</span>
    //   </button>
    //   <button
    //     onClick={handleMigrateCategories}
    //     className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-black/80 cursor-pointer">
    //     <span className="text-sm">Migrate Categories</span>
    //   </button>
    //   <button
    //     onClick={handleMigrateBudgets}
    //     className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-black/80 cursor-pointer">
    //     <span className="text-sm">Migrate Budgets</span>
    //   </button>
    //   <button
    //     onClick={handleMigrateTransactions}
    //     className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-black/80 cursor-pointer">
    //     <span className="text-sm">Migrate Transactions</span>
    //   </button>
    // </div>
    "s"
  );
}