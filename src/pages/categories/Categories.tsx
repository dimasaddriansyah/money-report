/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add01Icon, ArrowRight01Icon, Delete02Icon, NoteEditIcon, NoteRemoveIcon, PlusSignIcon } from "hugeicons-react";
import Header from "../../components/navigation/Header";
import { useCategories } from "../../hooks/categories/useCategories";
import { getCategoriesImg } from "../../helpers/UI";
import MobileLayout from "../../components/utils/MobileLayout";
import DesktopLayout from "../../components/utils/DesktopLayout";
import FooterDesktop from "../../components/utils/FooterDesktop";
import HeaderDesktop from "../../components/utils/HeaderDesktop";
import EmptyState from "../../components/utils/EmptyState";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import TablePageSize from "../../components/tables/TablePageSize";
import { usePagination } from "../../hooks/utils/usePagination";
import TablePagination from "../../components/tables/TablePagination";

export default function Categories() {
  const { categories } = useCategories();
  const isEmpty = categories.length === 0;

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    paginatedData,
    startItem,
    endItem,
    pages,
  } = usePagination({ data: categories });

  return (
    <div>
      {/* DESKTOP */}
      <DesktopLayout>
        {/* HEADER */}
        {({ collapsed, setCollapsed }: any) => (
          <>
            {/* HEADER */}
            <HeaderDesktop
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />

            {/* CONTENT */}
            <div className="flex flex-col flex-1 overflow-y-auto px-6 py-8 gap-6">
              {/* ROW 1 */}
              <Breadcrumbs
                items={[
                  { label: "Dashboard", path: "/" },
                  { label: "Categories" },
                ]} />

              {/* ROW 2 */}
              <div className="flex-1">
                <div className="flex flex-col bg-white p-4 rounded-lg gap-4">
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-lg">List of Category</h1>
                    <button className="flex items-center px-4 py-2 gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg cursor-pointer">
                      <PlusSignIcon size={16} />
                      <span>Add Category</span>
                    </button>
                  </div>
                  <div className="h-px bg-slate-100/60" />
                  {isEmpty ? (
                    <EmptyState icon={<NoteRemoveIcon />} title="No categories yet" subtitle="Add your first category to start tracking your cash flow." />
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <TablePageSize
                          pageSize={pageSize}
                          onChange={(value) => {
                            setPageSize(value);
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
                          <thead className="bg-slate-50">
                            <tr className="text-left text-slate-500 border-b border-slate-100">
                              <th className="w-12">#</th>
                              <th>Category Name</th>
                              <th className="w-12 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedData.map((row, index) => (
                              <tr
                                key={row.category_id}
                                className="border-b border-slate-50 hover:bg-slate-50 transition"
                              >
                                <td className="text-slate-500 font-medium">{(currentPage - 1) * pageSize + index + 1}</td>
                                <td className="text-slate-500">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={getCategoriesImg(row.name)}
                                      alt={row.name}
                                      className="w-8 h-8"
                                    />
                                    <span className="text-slate-900">{row.name || "-"}</span>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex gap-2">
                                    <div className="bg-amber-50 hover:bg-amber-200 p-2 rounded-xl cursor-pointer">
                                      <NoteEditIcon className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="bg-red-50 hover:bg-red-200 p-2 rounded-xl cursor-pointer">
                                      <Delete02Icon className="w-5 h-5 text-red-500" />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        startItem={startItem}
                        endItem={endItem}
                        pages={pages}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <FooterDesktop />
          </>
        )}
      </DesktopLayout>

      {/* MOBILE */}
      <MobileLayout>
        <div className="bg-slate-50 flex flex-col">
          <Header title="Categories" textColor="text-slate-900" showBack />
          <div className="p-4 pb-24 space-y-4">
            <div className="flex justify-center items-center font-semibold border border-dashed border-slate-300 rounded-lg py-2.5 gap-2 hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
              <Add01Icon className="w-5 h-5" />
              <span>Add Category</span>
            </div>
            <div className="bg-white rounded-xl overflow-hidden cursor-pointer">
              {categories?.map((row: any) => (
                <div key={row.category_id}>
                  <div className="flex items-center justify-between p-4 hover:bg-slate-100">
                    <div className="flex gap-4 items-center">
                      <img
                        src={`${getCategoriesImg(row.name)}`}
                        alt={row.name}
                        className="w-8 h-8"
                      />
                      <span className="font-medium text-slate-800">
                        {row.name}
                      </span>
                    </div>
                    <ArrowRight01Icon className="text-slate-400 w-5 h-5" />
                  </div>
                  <div className="h-px bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
    </div>
  );
}
