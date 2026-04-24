import { useNavigate } from "react-router-dom";
import type { Account } from "../types/account";
import { useState } from "react";
import { useAccountActions } from "../hooks/useAccountActions";
import { toast } from "sonner";
import EmptyState from "../../../shared/ui/EmptyState";
import BottomSheet from "../../../shared/ui/BottomSheet";
import ComponentAccountItem from "./ComponentAccountItem";

type Props = {
  accounts: Account[];
  refetch: () => void;
};

export default function AccountMobile({
  accounts, refetch
}: Props) {
  const navigate = useNavigate();

  const isEmpty = accounts.length === 0;

  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [activeSwipeId, setActiveSwipeId] = useState<string | null>(null);

  const { deleteAccount, loading } = useAccountActions(refetch);
  async function handleDelete() {
    if (!selectedAccount) return;
    try {
      const result = await deleteAccount(selectedAccount.id);
      toast.success("Deleted", {
        description: result.message,
      });
      setOpen(false);
      setSelectedAccount(null);
    } catch (error: unknown) {
      let message = "Failed to delete account";
      if (error instanceof Error) { message = error.message }
      toast.error("Failed to delete account", {
        description: message,
        duration: 2000,
      });
    }
  }

  return (
    <>
      {isEmpty ? (
        <EmptyState
          title="No accounts yet"
          subtitle="Create your first account to start tracking"
        />
      ) : (
        <div className="bg-white">
          {accounts.map((row) => (
            <ComponentAccountItem
              key={row.id}
              row={row}
              isOpen={activeSwipeId === row.id}
              onOpen={() => setActiveSwipeId(row.id)}
              onClose={() => setActiveSwipeId(null)}
              onEdit={() => navigate(`/account/edit/${row.id}`)}
              onDelete={() => { setSelectedAccount(row); setOpen(true) }} />
          ))}
        </div>
      )}
      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedAccount(null);
        }}
        title="Delete Account">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500">
            {selectedAccount
              ? `Delete "${selectedAccount.name}"? This cannot be undone.`
              : ""}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setOpen(false);
                setSelectedAccount(null);
              }}
              className="flex-1 py-2 rounded-xl hover:bg-slate-50 border border-slate-200 text-sm text-slate-400 cursor-pointer">
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-sm text-white font-medium disabled:opacity-50 cursor-pointer">
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
