import {
  ArrowRight01Icon,
  CreditCardIcon,
  FileExportIcon,
  LicenseIcon,
  Male02Icon,
  Xls01Icon,
} from "hugeicons-react";
import { getGreeting } from "../helpers/UI";
import BottomSheet from "../components/utils/BottomSheet";
import { useState } from "react";
import { ExportSpreedsheet } from "../helpers/ExportSpreedsheet";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const greeting = getGreeting();

  const [openExport, setOpenExport] = useState(false);
  const [LoadingExport, setLoadingExport] = useState(false);

  const handleExport = async () => {
    setLoadingExport(true);

    setTimeout(() => {
      const url = ExportSpreedsheet("xlsx");
      const link = document.createElement("a");
      const year = new Date().getFullYear();

      link.href = url;
      link.download = `Cashflow_${year}.xlsx`;
      link.click();

      setLoadingExport(false);
    }, 300);
  };

  return (
    <div className="bg-slate-900 flex flex-col">
      <section className="flex flex-col items-center gap-4 pt-20 pb-6">
        <div className="p-4 bg-white rounded-full flex items-center justify-center">
          <Male02Icon className="w-8 h-8" />
        </div>
        <div className="flex flex-col items-center text-white">
          <span className="text-sm text-white/60">{greeting},</span>
          <span className="text-xl font-semibold">Dimas Addriansyah</span>
        </div>
      </section>

      <section className="bg-slate-50 min-h-dvh p-4 space-y-6 pb-24">
        <section className="flex flex-col gap-2">
          <span className="">Master Data</span>
          <div className="flex flex-col bg-white rounded-xl overflow-hidden">
            <div
              onClick={() => navigate("/accounts")}
              className="flex justify-between items-center p-4 hover:bg-slate-100 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <CreditCardIcon className="h-5 w-5 text-slate-400" />
                <span className="">Accounts</span>
              </div>
              <ArrowRight01Icon className="h-5 w-5 text-slate-400" />
            </div>
            <div className="h-px bg-slate-100" />
            <div
              onClick={() => navigate("/categories")}
              className="flex justify-between items-center p-4 hover:bg-slate-100 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <LicenseIcon className="h-5 w-5 text-slate-400" />
                <span className="">Categories</span>
              </div>
              <ArrowRight01Icon className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <span className="">Others</span>
          <div className="flex flex-col bg-white rounded-xl overflow-hidden">
            <div
              onClick={() => setOpenExport(true)}
              className="flex justify-between items-center p-4 hover:bg-slate-100 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <FileExportIcon className="h-5 w-5 text-slate-400" />
                <span className="">Export Data</span>
              </div>
              <ArrowRight01Icon className="h-5 w-5 text-slate-400" />
            </div>
          </div>
        </section>
      </section>

      <BottomSheet
        open={openExport}
        onClose={() => setOpenExport(false)}
        title="Export Data"
      >
        <div className="flex flex-col gap-5">
          <span>Apakah anda ingin export semua data transaksi?</span>

          <button
            onClick={handleExport}
            disabled={LoadingExport}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-full flex items-center justify-center min-h-12 cursor-pointer"
          >
            <div className="flex gap-3 items-center">
              {LoadingExport ? (
                <span className="animate-pulse">Exporting...</span>
              ) : (
                <>
                  <Xls01Icon />
                  <span>Export Data Spreadsheet</span>
                </>
              )}
            </div>
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
