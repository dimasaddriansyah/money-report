import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  TaskEdit01Icon,
  Settings02Icon,
  PlusSignIcon,
  AiContentGenerator01Icon,
  MoneySavingJarIcon,
  Invoice01Icon,
  ArrowRight01Icon,
  Home03Icon,
} from "hugeicons-react";
import BottomSheet from "../ui/BottomSheet";

const menus = [
  { path: "/", Icon: Home03Icon },
  { path: "/transactions", Icon: Invoice01Icon },
  { path: "/budgets", Icon: MoneySavingJarIcon },
  { path: "/settings", Icon: Settings02Icon },
];

export default function NavigationBottomMobile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openFab, setOpenFab] = useState(false);

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setOpenFab(false)}
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all duration-300
          ${openFab ? "opacity-100" : "opacity-0 pointer-events-none"}`} />

      {/* BOTTOM NAV */}
      <nav
        className={`fixed inset-x-0 bottom-0 z-30 flex justify-center pb-3 transition-all duration-300
          ${openFab ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div className="inline-flex items-center p-2.5 gap-2 rounded-full bg-white/70 backdrop-blur-lg saturate-150 border border-slate-100/40 ring-1 ring-white/20">
          {/* HOME */}
          <NavItem
            {...menus[0]}
            active={location.pathname === menus[0].path} />

          {/* TRANSACTIONS */}
          <NavItem
            {...menus[1]}
            active={location.pathname === menus[1].path} />

          {/* ADD */}
          <button
            onClick={() => setOpenFab(true)}
            className="flex items-center justify-center px-5 py-3 rounded-full bg-black text-white transition-transform active:scale-95 cursor-pointer">
            <PlusSignIcon strokeWidth={2} className="w-5 h-5" />
          </button>

          {/* BUDGETS */}
          <NavItem
            {...menus[2]}
            active={location.pathname === menus[2].path} />

          {/* SETTINGS */}
          <NavItem
            {...menus[3]}
            active={location.pathname === menus[3].path} />
        </div>
      </nav>

      <BottomSheet
        open={openFab}
        onClose={() => setOpenFab(false)}
        title="Add Transaction">
        <div>
          <button
            onClick={() => {
              setOpenFab(false);
              setTimeout(() => navigate("/transaction/create"), 150);
            }}
            className="flex items-center justify-between w-full gap-4 p-4 text-left border-b border-slate-50 hover:bg-slate-100 cursor-pointer">
            <div className="flex items-center gap-4">
              <TaskEdit01Icon className="text-blue-900" size={20} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Manual Input</span>
                <span className="text-xs text-slate-500">Input transaksi secara manual</span>
              </div>
            </div>
            <ArrowRight01Icon className="text-slate-400" size={20} />
          </button>

          <button
            onClick={() => {
              setOpenFab(false);
              setTimeout(() => navigate("/transaction/generate/form"), 150);
            }}
            className="flex items-center justify-between w-full gap-4 p-4 text-left border-b border-slate-50 hover:bg-slate-100 cursor-pointer">
            <div className="flex items-center gap-4">
              <AiContentGenerator01Icon className="text-amber-500" size={20} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Generate Input</span>
                <span className="text-xs text-slate-500">Generate otomatis dari template</span>
              </div>
            </div>
            <ArrowRight01Icon className="text-slate-400" size={20} />
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

function NavItem({
  path,
  Icon,
  active,
}: {
  path: string;
  Icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      to={path}
      className={`px-5 py-3 rounded-full text-xs transition ${active ? "bg-slate-100 font-semibold text-black" : "text-slate-700"}`}>
      <Icon size={24} />
    </Link>
  );
}
