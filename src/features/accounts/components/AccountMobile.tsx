import { useNavigate } from "react-router-dom";
import type { Account } from "../types/account";
import { useState } from "react";
import { useAccountActions } from "../hooks/useAccountActions";
import { toast } from "sonner";
import EmptyState from "../../../shared/ui/EmptyState";
import BottomSheet from "../../../shared/ui/BottomSheet";
import ComponentAccountItem from "./ComponentAccountItem";
import { ArrowLeft01Icon, Delete02Icon } from "hugeicons-react";
import ComponentAccountItemSkeleton from "./ComponentAccountItemSkeleton";

type Props = {
  accounts: Account[];
  loading: boolean;
  refetch: () => Promise<void>;
};

export default function AccountMobile({
  accounts, loading, refetch
}: Props) {
  const navigate = useNavigate();

  const isEmpty = accounts.length === 0;

  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [activeSwipeId, setActiveSwipeId] = useState<string | null>(null);

  const { deleteAccount, loading: deleting } = useAccountActions(refetch);
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

  if (loading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, index) => (
          <ComponentAccountItemSkeleton key={index} />
        ))}
      </>
    );
  }

  return (
    <>
      <div className="relative flex items-center p-5 border-b border-slate-100">
        <div
          onClick={() => navigate(-1)}
          className="flex p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full cursor-pointer">
          <ArrowLeft01Icon size={20} />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 font-semibold">Account List</span>
      </div>
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
        }}>
        <div className="flex flex-col p-4 gap-4">
          <div className="text-slate-500">
            {selectedAccount
              ?
              <div className="flex flex-col items-center pt-2 gap-4">
                <Delete02Icon className="text-red-500" size={40} />
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-black text-base">Delete "{selectedAccount.name}"?</span>
                  <span className="text-sm text-center w-70">Are you sure? Once deleted, this category and its data cannot be recovered.</span>
                </div>
              </div>
              : ""}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-sm text-white font-medium disabled:opacity-50 cursor-pointer">
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
