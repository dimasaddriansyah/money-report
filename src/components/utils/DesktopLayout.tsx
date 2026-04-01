import { useState } from "react";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import { Xls02Icon } from "hugeicons-react";
import { ExportSpreedsheet } from "../../helpers/ExportSpreedsheet";

export default function DesktopLayout({ children }: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const year = new Date().getFullYear();
  const [LoadingExport, setLoadingExport] = useState(false);
  const handleExport = async () => {
    setLoadingExport(true);

    setTimeout(() => {
      const url = ExportSpreedsheet("xlsx");
      const link = document.createElement("a");

      link.href = url;
      link.download = `Cashflow_${year}.xlsx`;
      link.click();

      setLoadingExport(false);
      setOpenModal(false);
    }, 300);
  }

  return (
    <div className="hidden md:flex h-screen">
      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} onOpenModal={() => setOpenModal(true)} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {children({ collapsed, setCollapsed })}
      </div>

      {/* MODAL */}
      {openModal && (
        <Modal
          title="Export Data Transactions"
          textButton="Export Data"
          loading={LoadingExport}
          onSubmit={handleExport}
          onClose={() => setOpenModal(false)}
        >
          <div className="flex flex-col gap-2">
            <span className="text-slate-600">Apakah anda ingin export semua data transaksi?</span>
            <div className="flex flex-col bg-green-50 p-3 gap-1 rounded-lg">
              <span className="text-sm text-slate-500">File Name</span>
              <div className="flex items-center px-4 py-2 w-fit border border-slate-200 gap-2 rounded-lg">
                <Xls02Icon className="text-green-600" size={20} />
                <span className="text-sm text-green-600 font-medium">Cashflow_{year}.xlsx</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}