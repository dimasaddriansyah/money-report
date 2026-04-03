import { ArrowDown01Icon, Menu01Icon, Notification01Icon, Search01Icon, UserIcon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";

interface Props {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;

  hideBalance?: boolean;
  setHideBalance?: (val: boolean) => void;
  showBalanceToggle?: boolean;
}

export default function HeaderDesktop({
  collapsed,
  setCollapsed,
  hideBalance,
  setHideBalance,
  showBalanceToggle = false,
}: Props) {
  return (
    <div className="px-6 h-18 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="cursor-pointer"
      >
        <Menu01Icon size={20} className="text-slate-900" />
      </button>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6">

          {/* 🔥 OPTIONAL */}
          {showBalanceToggle && hideBalance !== undefined && setHideBalance && (
            hideBalance ? (
              <ViewIcon
                onClick={() => setHideBalance(false)}
                className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer"
              />
            ) : (
              <ViewOffSlashIcon
                onClick={() => setHideBalance(true)}
                className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer"
              />
            )
          )}
          <Search01Icon className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer" />
          <Notification01Icon className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer" />
        </div>

        <div className="w-px h-8 bg-neutral-100"></div>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative w-fit">
            <div className="bg-slate-50/40 p-2 rounded-xl">
              <UserIcon className="text-slate-900" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              Dimas Addriansyah
            </span>
            <span className="text-xs text-slate-400">Owner</span>
          </div>
          <ArrowDown01Icon className="h-5 w-5 text-neutral-400" />
        </div>
      </div>
    </div>
  );
}