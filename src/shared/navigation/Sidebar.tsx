/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_MENUS_DESKTOP } from "../utils/navigation.sidebar.helper";
import CashflowLogo from "../../assets/cashflow.png";
import { FileExportIcon } from "hugeicons-react";

interface SidebarProps {
  collapsed: boolean;
  onOpenModal: () => void;
}

export default function Sidebar({ collapsed, onOpenModal }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-slate-100 transition-[width] duration-300 ease-in-out
        ${collapsed ? "w-19" : "w-66"}`}>
      {/* HEADER */}
      <div className="px-4.5 h-18 flex items-center border-b border-slate-100 space-x-3">
        <img src={CashflowLogo} alt="Logo" className="w-8 h-8" />
        {!collapsed && (
          <span className="text-base font-semibold">CASHFLOW</span>
        )}
      </div>

      {/* NAVIGATION */}
      <nav
        className={`flex-1 flex flex-col py-6 gap-1 transition-all duration-300 
          ${collapsed ? "px-3.5 items-center" : "px-4.5"}`}>
        {NAV_MENUS_DESKTOP.map((item, index) => {
          // LABEL SECTION
          if (item.type === "label") {
            return (
              !collapsed && (
                <p
                  key={index}
                  className="text-xs text-gray-400 px-3 mt-6 mb-2 tracking-wider">
                  {item.label}
                </p>
              )
            );
          }

          // MENU ITEM
          const active =
            item.matchPaths?.some((p: string) =>
              location.pathname === p || location.pathname.startsWith(p + "/")
            );

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center transition cursor-pointer rounded-xl font-medium relative
                ${collapsed ? "w-full h-12 justify-center" : "gap-4 p-3"}
                ${active
                  ? "bg-slate-900 text-white font-semibold hover:bg-slate-800"
                  : "text-slate-900 hover:bg-slate-50"
                }`}>
              {/* ICON (optional) */}
              <div className="w-6 h-6 flex items-center justify-center">
                {item.icon ? <item.icon size={20} /> : null}
              </div>
              {/* TEXT */}
              <span
                className={`text-sm whitespace-nowrap transition-all duration-200 ease-in-out
                ${collapsed
                    ? "opacity-0 -translate-x-2 w-0 overflow-hidden"
                    : "opacity-100 translate-x-0 w-auto"
                  }`}>
                {item.labelDesktop}
              </span>
            </button>
          );
        })}
      </nav>

      {/* BUTTON EXPORT */}
      <div
        className={`border-t border-slate-100 py-4
          ${collapsed ? "flex justify-center px-3.5" : "px-4.5"}`}>
        <button
          onClick={() => onOpenModal()}
          className={`flex items-center w-full rounded-xl text-sm font-medium transition border border-dashed border-slate-400 text-slate-900 hover:bg-slate-900 hover:text-white cursor-pointer
            ${collapsed ? "justify-center h-12" : "gap-3 p-3"}`}>
          {/* ICON */}
          <div className="w-6 h-6 flex items-center justify-center">
            <FileExportIcon size={20} />
          </div>
          {/* TEXT */}
          {!collapsed && <span>Export Data</span>}
        </button>
      </div>
    </aside>

  );
}