import { useState } from "react";
import Sidebar from "../navigation/Sidebar";
import HeaderDesktop from "../navigation/HeaderDesktop";
import FooterDesktop from "../navigation/FooterDesktop";
import Modal from "../ui/Modal";
import { Xls02Icon } from "hugeicons-react";
import { ExportSpreedsheet } from "../utils/export.helper";
import { useBalance } from "../context/BalanceContext";

export default function DesktopShell({ children }: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { hideBalance, setHideBalance } = useBalance();

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
    <div className="flex h-screen bg-slate-50">
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        onOpenModal={() => setOpenModal(true)} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderDesktop
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          hideBalance={hideBalance}
          setHideBalance={setHideBalance}
          showBalanceToggle />
        <main className="flex-1 overflow-auto">{children}</main>
        <FooterDesktop />
      </div>

      {/* MODAL */}
      {openModal && (
        <Modal
          title="Export Data Transactions"
          textButton="Export Data"
          loading={LoadingExport}
          onSubmit={handleExport}
          onClose={() => setOpenModal(false)}>
          <div className="flex flex-col gap-2 p-4">
            <span className="text-slate-600">Apakah anda ingin export semua data transaksi?</span>
            <div className="flex items-center p-4 bg-green-50 border border-green-200 gap-2 rounded-lg">
              <Xls02Icon className="text-green-600" size={20} />
              <span className="text-sm text-green-600 font-medium">Cashflow_{year}.xlsx</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}