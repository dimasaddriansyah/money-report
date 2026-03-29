/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_MENUS } from "../../helpers/Navigation";
import CashflowLogo from "../../assets/cashflow.png";

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-slate-100 transition-[width] duration-300 ease-in-out
        ${collapsed ? "w-19" : "w-66"}
      `}
    >
      {/* HEADER */}
      <div className="px-4.5 h-18 flex items-center border-b border-slate-100 space-x-3">
        <img src={CashflowLogo} alt="Logo" className="w-8 h-8" />
        {!collapsed && (
          <span className="text-base font-semibold">CASHFLOW</span>
        )}
      </div>

      {/* NAVIGATION */}
      <nav
        className={`flex-1 flex flex-col py-6 gap-2 transition-all duration-300 
          ${collapsed ? "px-3.5 items-center" : "px-4.5"}
        `}
      >
        {NAV_MENUS.map((menu) => {
          const active = location.pathname === menu.path;

          return (
            <button
              key={menu.path}
              onClick={() => navigate(menu.path)}
              className={`flex items-center transition cursor-pointer rounded-xl font-medium
                ${collapsed ? "w-full h-12 justify-center" : "gap-4 p-3"}
                ${
                  active
                    ? "bg-slate-900 text-white font-semibold hover:bg-slate-800"
                    : "text-gray-500 hover:bg-slate-200"
                }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <menu.Icon size={24} />
              </div>
              <span
                className={`whitespace-nowrap transition-all duration-200 ease-in-out
                ${
                  collapsed
                    ? "opacity-0 -translate-x-2 w-0 overflow-hidden"
                    : "opacity-100 translate-x-0 w-auto"
                }`}
              >
                {menu.labelDesktop}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
