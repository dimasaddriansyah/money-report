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
                Showing {startItem} to {endItem} of {totalItems} entires
            </div>
            <div className="flex items-center gap-1">

                {/* PREV */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Prev
                </button>

                {/* PAGE NUMBERS */}
                {pages.map((page, index) => (
                    <button
                        key={index}
                        disabled={page === "..."}
                        onClick={() => typeof page === "number" && onPageChange(page)}
                        className={`px-3 py-1 border border-slate-100 rounded-lg transition cursor-pointer
                                ${page === currentPage
                                ? "bg-slate-900 text-white font-semibold"
                                : "hover:bg-slate-100"}
                                ${page === "..." ? "cursor-default opacity-50" : ""}
                              `}
                    >
                        {page}
                    </button>
                ))}

                {/* NEXT */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>

            </div>
        </div>
    );
}