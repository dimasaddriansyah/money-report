/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu02Icon } from "hugeicons-react";
import { NAV_MENUS } from "../../helpers/Navigation";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-white transition-all duration-300 border-r border-slate-100
      ${collapsed ? "w-18" : "w-56"}`}
    >
      {/* HEADER */}
      <div className="px-4 h-14 flex items-center justify-between border-b border-slate-100">
        {!collapsed && (
          <span className="text-base font-semibold">CASHFLOW</span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer"
        >
          <Menu02Icon size={20} className="text-slate-400" />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 flex flex-col">
        {NAV_MENUS.map((menu) => {
          const active = location.pathname === menu.path;

          return (
            <button
              key={menu.path}
              onClick={() => navigate(menu.path)}
              className={`flex items-center gap-4 px-4 py-3 transition cursor-pointer
              ${
                active
                  ? "bg-slate-900 text-white font-medium"
                  : "text-gray-500 hover:bg-slate-100"
              }`}
            >
              <menu.Icon size={20} />
              {!collapsed && <span>{menu.labelDesktop}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
