import {
  ArrowRight01Icon, CreditCardIcon, LicenseIcon, Logout02Icon, Male02Icon
  //FileExportIcon, //Xls01Icon 
} from "hugeicons-react";
// import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import BottomSheet from "../shared/ui/BottomSheet";
// import { ExportSpreedsheet } from "../shared/utils/export.helper";
import { getGreeting } from "../shared/utils/style.helper";
import { logout } from "../features/auth/services/AuthService";
import { toast } from "sonner";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const greeting = getGreeting();

  // const [openExport, setOpenExport] = useState(false);
  // const [LoadingExport, setLoadingExport] = useState(false);

  // const handleExport = async () => {
  //   setLoadingExport(true);

  //   setTimeout(() => {
  //     const url = ExportSpreedsheet("xlsx");
  //     const link = document.createElement("a");
  //     const year = new Date().getFullYear();

  //     link.href = url;
  //     link.download = `Cashflow_${year}.xlsx`;
  //     link.click();

  //     setLoadingExport(false);
  //   }, 300);
  // };

  async function handleLogout() {
    try {
      await logout();
      toast.success("Success", {
        description: "You have been logged out.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Something went wrong!",
      });
    }
  }

  return (
    <div className="bg-black flex flex-col">
      <section className="flex flex-col items-center gap-4 py-10">
        <div className="p-4 bg-white rounded-full flex items-center justify-center">
          <Male02Icon size={32} />
        </div>
        <div className="flex flex-col items-center text-white">
          <span className="text-sm text-white/60">{greeting},</span>
          <span className="text-xl font-semibold">{user?.displayName}</span>
        </div>
      </section>

      <section className="bg-slate-50 p-4 space-y-6 pb-24">
        <section className="flex flex-col gap-2">
          <span className="">Master Data</span>
          <div className="flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden">
            <div
              onClick={() => navigate("/accounts")}
              className="flex justify-between items-center p-4 hover:bg-slate-100 transition cursor-pointer">
              <div className="flex items-center gap-4">
                <CreditCardIcon size={20} className="text-slate-400" />
                <span className="text-black">Accounts</span>
              </div>
              <ArrowRight01Icon size={20} className="text-slate-400" />
            </div>
            <div className="h-px bg-slate-100" />
            <div
              onClick={() => navigate("/categories")}
              className="flex justify-between items-center p-4 hover:bg-slate-100 transition cursor-pointer">
              <div className="flex items-center gap-4">
                <LicenseIcon size={20} className="text-slate-400" />
                <span className="text-black">Categories</span>
              </div>
              <ArrowRight01Icon size={20} className="text-slate-400" />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <span className="">Others</span>
          <div className="flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden">
            {/* <div
              onClick={() => setOpenExport(true)}
              className="flex justify-between items-center p-4 hover:bg-slate-100 transition cursor-pointer">
              <div className="flex items-center gap-4">
                <FileExportIcon size={20} className="text-slate-400" />
                <span className="text-black">Backup Data</span>
              </div>
              <ArrowRight01Icon size={20} className="text-slate-400" />
            </div>
            <div className="h-px bg-slate-100" /> */}
            <div
              onClick={handleLogout}
              className="flex justify-between items-center p-4 bg-red-600 hover:bg-red-700 transition cursor-pointer">
              <div className="flex items-center gap-4">
                <Logout02Icon size={20} className="text-white" />
                <span className="text-white font-medium">Logout</span>
              </div>
              <ArrowRight01Icon size={20} className="text-white" />
            </div>
          </div>
        </section>
      </section>
      {/* <BottomSheet
        open={openExport}
        onClose={() => setOpenExport(false)}
        title="Backup Data"
      >
        <div className="flex flex-col gap-5">
          <span>Apakah anda ingin backup semua data transaksi?</span>

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
                  <span>Backup Data Spreadsheet</span>
                </>
              )}
            </div>
          </button>
        </div>
      </BottomSheet> */}
    </div>
  );
}
