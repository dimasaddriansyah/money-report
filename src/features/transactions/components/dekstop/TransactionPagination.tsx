import TablePagination from "../../../../shared/ui/tables/TablePagination";

type Props = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  pages: (number | string)[];
  onPageChange: (page: number) => void;
};

export default function TransactionPagination({
  currentPage,
  totalPages,
  totalItems,
  startItem,
  endItem,
  pages,
  onPageChange,
}: Props) {
  return (
    <TablePagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      startItem={startItem}
      endItem={endItem}
      pages={pages}
      onPageChange={onPageChange}
    />
  );
}