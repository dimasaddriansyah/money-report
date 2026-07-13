export default function TransactionDeleteModal() {
  <Modal
    title="Delete Transaction"
    textButton="Delete"
    loading={loading}
    onSubmit={handleDelete}
    onClose={() => {
      setOpen(false);
      setSelectedTransaction(null);
    }}>
    <p className="p-4 text-sm text-slate-500">
      Delete "<span className="text-black font-semibold">{selectedTransaction?.remark}</span>"? This cannot be undone.
    </p>
  </Modal>
}