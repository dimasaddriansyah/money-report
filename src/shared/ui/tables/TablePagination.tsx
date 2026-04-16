interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  pages: (number | string)[];
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  startItem,
  endItem,
  pages,
  onPageChange,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
      <div className="text-slate-500">
        {totalItems === 0
          ? "No data"
          : `Showing ${startItem} to ${endItem} of ${totalItems} entries`}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-slate-100 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          Prev
        </button>
        {pages.map((p, index) => (
          <button
            key={index}
            disabled={p === "..."}
            onClick={() => typeof p === "number" && onPageChange(p)}
            className={`px-3 py-1 border border-slate-100 rounded-lg transition cursor-pointer
              ${p === currentPage
                ? "bg-slate-900 text-white font-semibold"
                : "hover:bg-slate-100"}
              ${p === "..." ? "cursor-default opacity-50" : ""}`}>
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 border border-slate-100 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          Next
        </button>
      </div>
    </div>
  );
}