import { useMemo } from "react";
import Modal from "../../../shared/ui/Modal";
import { formatBalance, formatCurrency } from "../../../shared/utils/format.helper";
import { getAccountsImg } from "../../../shared/utils/style.helper";
import type { Account } from "../../accounts/types/account";
import { groupBudgetByOriginalAccount } from "../utils/groupBudgetByOriginalAccount.helper";
import type { GroupedBudget } from "../utils/groupBudgetByAccount.helper";

type Props = {
  open: boolean;
  budget: GroupedBudget | null;
  accounts: Account[];
  hideBalance: boolean;
  onClose: () => void;
};

export default function ComponentBudgetTransferModal({
  open,
  budget,
  accounts,
  hideBalance,
  onClose,
}: Props) {
  const breakdownAccounts = useMemo(() => {
    if (!budget) {
      return [];
    }

    return groupBudgetByOriginalAccount(budget.items, accounts);
  }, [budget, accounts]);

  if (!open || !budget) {
    return null;
  }

  return (
    <Modal
      title={`List Transfer ${budget.accountName}`}
      onClose={onClose}>
      <div className="flex flex-col">
        {breakdownAccounts.map((item) => (
          <div
            key={item.accountId}
            className="flex items-center justify-between px-4 py-3 text-sm border-b border-slate-50 hover:bg-slate-50">
            <div className="flex items-center gap-4">
              <img src={getAccountsImg(item.accountName)} alt={item.accountName} className="w-8 h-8" />
              <span className="text-slate-500">{item.accountName}</span>
            </div>
            <span className="font-medium text-slate-500">{formatBalance(formatCurrency(item.total), hideBalance)}</span>
          </div>
        ))}

        <div className="flex justify-between bg-slate-50 p-4 text-sm font-semibold">
          <span>Total</span>
          <span>{formatBalance(formatCurrency(budget.total), hideBalance)}</span>
        </div>
      </div>
    </Modal>
  )
}