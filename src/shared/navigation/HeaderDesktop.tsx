import { ArrowDown01Icon, Logout02Icon, Menu01Icon, Notification01Icon, Settings01Icon, UserIcon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { logout } from "../../features/auth/services/AuthService";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { toast } from "sonner";

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
}: Props) {
  const location = useLocation();
  const SHOW_BALANCE_ROUTES = ["/dashboard", "/transactions", "/budgets"];
  const isShowBalancePage = SHOW_BALANCE_ROUTES.some((path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/dashboard")
  );

  const { user } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div className="px-6 h-18 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="cursor-pointer">
        <Menu01Icon className="text-black" size={20} />
      </button>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6">
          {isShowBalancePage && hideBalance !== undefined && setHideBalance && (
            hideBalance ? (
              <ViewIcon
                onClick={() => setHideBalance(false)}
                className="text-black hover:text-slate-600 cursor-pointer" size={20} />
            ) : (
              <ViewOffSlashIcon
                onClick={() => setHideBalance(true)}
                className="text-black hover:text-slate-600 cursor-pointer" size={20} />
            )
          )}
          {/* <Search01Icon className="text-black hover:text-slate-600 cursor-pointer" size={20} /> */}
          <Notification01Icon className="text-black hover:text-slate-600 cursor-pointer" size={20} />
        </div>

        <div className="w-px h-8 bg-neutral-100"></div>
        <div
          ref={profileRef}
          className="relative">
          <div
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer">
            <div className="relative w-fit">
              <div className="bg-slate-50/40 p-2 rounded-xl"><UserIcon className="text-black" /></div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user?.displayName}</span>
              <span className="text-xs text-slate-400">{user?.email}</span>
            </div>

            <ArrowDown01Icon className={`text-neutral-400 transition-transform ${openProfile ? "rotate-180" : ""}`} size={20} />
          </div>

          {openProfile && (
            <div className="absolute right-0 mt-6 w-52 p-1 rounded-xl border border-slate-100 bg-white divide-y divide-slate-100 shadow-lg overflow-hidden z-50">
              <div className="w-full flex items-center gap-4 p-4 text-left text-sm hover:bg-slate-50 rounded-lg cursor-pointer">
                <UserIcon size={16} />
                <span>Profile</span>
              </div>
              <div className="w-full flex items-center gap-4 p-4 text-left text-sm hover:bg-slate-50 rounded-lg cursor-pointer">
                <Settings01Icon size={16} />
                <span>Setting</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                <Logout02Icon size={16} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}