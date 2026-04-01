/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
  Add01Icon,
  ArrowDown01Icon,
  CreditCardIcon,
  Delete02Icon,
  Menu01Icon,
  NoteEditIcon,
  Notification01Icon,
  PlusSignIcon,
  Search01Icon,
  UserIcon,
} from "hugeicons-react";
import Header from "../../components/navigation/Header";
import { useAccounts } from "../../hooks/accounts/useAccounts";
import { getAccountsImg } from "../../helpers/UI";
import BottomSheet from "../../components/utils/BottomSheet";
import DesktopLayout from "../../components/utils/DesktopLayout";
import MobileLayout from "../../components/utils/MobileLayout";
import Breadcrumbs from "../../components/utils/Breadcrumbs";

type ActionType = "create" | "edit" | "delete";

export default function Accounts() {
  const { accounts } = useAccounts();

  const [swipe, setSwipe] = useState<Record<string, number>>({});
  const [startX, setStartX] = useState(0);

  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [action, setAction] = useState<ActionType>("create");
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [accountName, setAccountName] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!openBottomSheet || action === "delete") return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [openBottomSheet, action]);

  const openCreate = () => {
    setAction("create");
    setAccountName("");
    setSelectedAccount(null);
    setOpenBottomSheet(true);
  };

  const openEdit = (account: any) => {
    setAction("edit");
    setSelectedAccount(account);
    setAccountName(account.name);
    setOpenBottomSheet(true);
  };

  const openDelete = (account: any) => {
    setAction("delete");
    setSelectedAccount(account);
    setOpenBottomSheet(true);
  };

  const onSubmit = () => {
    if (action === "create") {
      console.log("create account", accountName);
    }

    if (action === "edit") {
      console.log("edit account", selectedAccount.account_id, accountName);
    }

    if (action === "delete") {
      console.log("delete account", selectedAccount.account_id);
    }

    setOpenBottomSheet(false);
  };

  const isDisabled = action !== "delete" && accountName.trim().length === 0;

  return (
    <div>
      {/* DESKTOP */}
      <DesktopLayout>
        {/* HEADER */}
        {({ collapsed, setCollapsed }: any) => (
          <>
            {/* HEADER */}
            <div className="px-6 h-18 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="cursor-pointer"
              >
                <Menu01Icon size={20} className="text-slate-900" />
              </button>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-6">
                  <Search01Icon className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer" />
                  <Notification01Icon className="w-5 h-5 text-slate-900 hover:text-slate-500 cursor-pointer" />
                </div>
                <div className="w-px h-8 bg-neutral-100"></div>
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="relative w-fit">
                    <div className="bg-slate-50/40 p-2 rounded-xl">
                      <UserIcon className="text-slate-900" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-1 border-white rounded-full"></span>
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

            {/* CONTENT */}
            <div className="flex flex-col flex-1 overflow-y-auto px-6 py-8 gap-6">
              {/* ROW 1 */}
              <Breadcrumbs
                items={[
                  { label: "Dashboard", path: "/" },
                  { label: "Accounts" },
                ]} />

              {/* ROW 2 */}
              <div className="flex-1">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-lg">List of Account</h1>
                    <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg cursor-pointer">Add Account</button>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 h-10 flex items-center justify-between text-xs text-slate-400 bg-white border-t border-slate-100 shrink-0">
              <span>CASHFLOW v1.0</span>
            </div>
          </>
        )}
      </DesktopLayout>

      {/* MOBILE */}
      <MobileLayout>
        <div className="bg-slate-50 flex flex-col">
          <Header title="Accounts" textColor="text-slate-900" showBack />

          <div className="p-4 pb-24 space-y-4">
            {/* ADD ACCOUNT */}
            <div
              onClick={openCreate}
              className="flex justify-center items-center font-semibold border border-dashed border-slate-300 rounded-lg py-2.5 gap-2 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
            >
              <Add01Icon className="w-5 h-5" />
              <span>Add Account</span>
            </div>

            {/* ACCOUNT LIST */}
            <div className="rounded-xl overflow-hidden">
              {accounts?.map((account: any) => {
                return (
                  <div
                    key={account.account_id}
                    className="relative overflow-hidden"
                  >
                    {/* ACTION BUTTONS */}
                    <div className="absolute inset-y-0 right-0 flex">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(account);
                        }}
                        className="w-16 flex justify-center items-center bg-amber-50 text-amber-600"
                      >
                        <NoteEditIcon />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDelete(account);
                        }}
                        className="w-16 flex justify-center items-center bg-red-50 text-red-600"
                      >
                        <Delete02Icon />
                      </button>
                    </div>

                    {/* CONTENT */}
                    <div
                      onTouchStart={(e) => {
                        setStartX(e.touches[0].clientX);
                      }}
                      onTouchMove={(e) => {
                        const currentX = e.touches[0].clientX;
                        const deltaX = currentX - startX;

                        let newTranslate =
                          (swipe[account.account_id] || 0) - deltaX;

                        if (newTranslate < 0) newTranslate = 0;
                        if (newTranslate > 128) newTranslate = 128;

                        setSwipe((prev) => ({
                          ...prev,
                          [account.account_id]: newTranslate,
                        }));

                        setStartX(currentX);
                      }}
                      onTouchEnd={() => {
                        const current = swipe[account.account_id] || 0;

                        setSwipe((prev) => ({
                          ...prev,
                          [account.account_id]: current > 64 ? 128 : 0,
                        }));
                      }}
                      style={{
                        transform: `translateX(-${swipe[account.account_id] || 0
                          }px)`,
                      }}
                      className="flex items-center p-4 gap-4 bg-white hover:bg-slate-100 relative z-10 transition-transform duration-200 touch-pan-y select-none"
                    >
                      <img
                        src={getAccountsImg(account.name)}
                        alt={account.name}
                        className="w-8 h-8"
                      />
                      <span className="font-medium text-slate-800">
                        {account.name}
                      </span>
                    </div>

                    <div className="h-px bg-slate-100" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM SHEET */}
          <BottomSheet
            open={openBottomSheet}
            onClose={() => setOpenBottomSheet(false)}
            title={
              action === "create"
                ? "Add Account"
                : action === "edit"
                  ? "Edit Account"
                  : "Delete Account"
            }
          >
            {action !== "delete" && (
              <div className="pb-6">
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Account Name
                </label>

                <div className="relative flex items-center">
                  <div className="absolute left-4 pointer-events-none">
                    <CreditCardIcon className="w-5 h-5 text-slate-400" />
                  </div>

                  <input
                    ref={inputRef}
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="block w-full ps-13 pe-3 py-2.5 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>
            )}

            {action === "delete" && (
              <p className="text-slate-900 pb-6">
                Delete account{" "}
                <span className="font-semibold">{selectedAccount?.name}</span>?
              </p>
            )}

            <button
              onClick={onSubmit}
              disabled={isDisabled}
              className={`w-full rounded-full py-3 text-sm font-medium
          text-white hover:bg-slate-800 active:scale-95 transition
          disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer`}
            >
              {action === "create"
                ? "Create Account"
                : action === "edit"
                  ? "Save Changes"
                  : "Delete Account"}
            </button>
          </BottomSheet>
        </div>
      </MobileLayout>
    </div>

  );
}
