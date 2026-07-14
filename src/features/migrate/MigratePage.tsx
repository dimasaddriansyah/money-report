import { toast } from "sonner";
import { useAuth } from "../auth/hooks/useAuth";
import { migrateAccounts } from "./accounts.migrate";
import { migrateCategories } from "./categories.migrate";
import { migrateBudgets } from "./budgets.migrate";
import { migrateTransactions } from "./transactions.migrate";

export default function MigratePage() {
  const { user } = useAuth();

  async function handleMigrateAccounts() {
    if (!user) return;
    try {
      await migrateAccounts(user.uid);
      toast.success("Accounts migrated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Migration failed");
    }
  }

  async function handleMigrateCategories() {
    if (!user) return;
    try {
      await migrateCategories(user.uid);
      toast.success("Categories migrated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Migration failed");
    }
  }

  async function handleMigrateBudgets() {
    if (!user) return;
    try {
      await migrateBudgets(user.uid);
      toast.success("Budgets migrated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Migration failed");
    }
  }

  async function handleMigrateTransactions() {
    if (!user) return;
    try {
      await migrateTransactions(user.uid);
      toast.success("Transactions migrated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Migration failed");
    }
  }

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      <button
        disabled={!user}
        onClick={handleMigrateAccounts}
        className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-black/80 cursor-pointer">
        <span className="text-sm">Migrate Accounts</span>
      </button>
      <button
        onClick={handleMigrateCategories}
        className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-black/80 cursor-pointer">
        <span className="text-sm">Migrate Categories</span>
      </button>
      <button
        onClick={handleMigrateBudgets}
        className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-black/80 cursor-pointer">
        <span className="text-sm">Migrate Budgets</span>
      </button>
      <button
        onClick={handleMigrateTransactions}
        className="rounded-xl bg-black p-3 font-semibold text-white hover:bg-black/80 cursor-pointer">
        <span className="text-sm">Migrate Transactions</span>
      </button>
    </div>
  );
}