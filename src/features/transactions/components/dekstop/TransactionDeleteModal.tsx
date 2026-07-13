import Modal from "../../../../shared/ui/Modal";
import type { Transaction } from "../../types/transaction";

type Props = {
  open: boolean;
  loading: boolean;
  transaction: Transaction | null;
  onDelete: () => void;
  onClose: () => void;
};

export default function TransactionDeleteModal({
  open,
  loading,
  transaction,
  onDelete,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <Modal
      title="Delete Transaction"
      textButton="Delete"
      loading={loading}
      onSubmit={onDelete}
      onClose={onClose}>
      <p className="p-4 text-sm text-slate-500">
        Delete{" "}
        <span className="font-semibold text-black">"{transaction?.remark}"</span>
        ? This cannot be undone.
      </p>
    </Modal>
  );
}