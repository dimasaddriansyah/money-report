import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  TaskEdit01Icon,
  FireIcon,
  Settings02Icon,
  PlusSignIcon,
  AiContentGenerator01Icon,
  MoneySavingJarIcon,
  Invoice01Icon,
} from "hugeicons-react";
import BottomSheet from "../ui/BottomSheet";

const menus = [
  { label: "Home", path: "/", Icon: FireIcon },
  { label: "Transactions", path: "/transactions", Icon: Invoice01Icon },
  { label: "Budgets", path: "/budgets", Icon: MoneySavingJarIcon },
  { label: "Settings", path: "/settings", Icon: Settings02Icon },
];

export default function BottomNavigationMobile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openFab, setOpenFab] = useState(false);

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={() => setOpenFab(false)}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${openFab ? "opacity-100" : "opacity-0 pointer-events-none"
          }`} />

      {/* BOTTOM NAV */}
      <nav
        className={`fixed inset-x-0 bottom-0 z-30 shadow-blue-950 transition-opacity duration-200 ${openFab ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}>
        <div className="relative flex items-center justify-between px-6 py-3 bg-white pb-[calc(env(safe-area-inset-bottom)+12px)]">
          {/* LEFT */}
          <div className="flex justify-between flex-1 pr-13">
            {menus.slice(0, 2).map((menu) => (
              <NavItem
                key={menu.path}
                {...menu}
                active={location.pathname === menu.path}
              />
            ))}
          </div>

          {/* CENTER FAB */}
          <div className="absolute z-50 -translate-x-1/2 left-1/2 -top-7">
            <button
              onClick={() => setOpenFab(true)}
              className="flex items-center justify-center text-white rounded-full shadow-lg cursor-pointer h-14 w-14 bg-slate-900 active:scale-95">
              <PlusSignIcon strokeWidth={2} className="w-6 h-6" />
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex justify-between flex-1 pl-13">
            {menus.slice(2).map((menu) => (
              <NavItem
                key={menu.path}
                {...menu}
                active={location.pathname === menu.path} />
            ))}
          </div>
        </div>
      </nav>

      <BottomSheet
        open={openFab}
        onClose={() => setOpenFab(false)}
        title="Add Transaction">
        <div className="space-y-2">
          <button
            onClick={() => {
              setOpenFab(false);
              setTimeout(() => navigate("/transaction/create"), 150);
            }}
            className="flex items-center w-full gap-3 p-3 text-left border rounded-lg border-slate-200 hover:bg-slate-100 cursor-pointer">
            <TaskEdit01Icon className="w-5 h-5 text-blue-900" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Manual Input</span>
              <span className="text-xs text-slate-500">Input transaksi secara manual</span>
            </div>
          </button>

          <button
            onClick={() => {
              setOpenFab(false);
              setTimeout(() => navigate("/generate-form"), 150);
            }}
            className="flex items-center w-full gap-3 p-3 text-left border rounded-lg border-slate-200 hover:bg-slate-50 cursor-pointer">
            <AiContentGenerator01Icon className="w-5 h-5 text-amber-500" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Generate Input</span>
              <span className="text-xs text-slate-500">Generate otomatis dari template</span>
            </div>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}

function NavItem({
  label,
  path,
  Icon,
  active,
}: {
  label: string;
  path: string;
  Icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      to={path}
      className={`flex flex-col items-center gap-1 text-xs transition ${active ? "font-semibold text-black" : "text-gray-400"}`}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}
