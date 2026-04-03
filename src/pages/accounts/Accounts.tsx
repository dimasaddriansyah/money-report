/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
  Add01Icon,
  CreditCardIcon,
  Delete02Icon,
  NoteEditIcon,
  CreditCardNotAcceptIcon,
  PlusSignIcon,
  Search02Icon,
} from "hugeicons-react";
import Header from "../../components/navigation/Header";
import { useAccounts } from "../../hooks/accounts/useAccounts";
import { getAccountsImg } from "../../helpers/UI";
import BottomSheet from "../../components/utils/BottomSheet";
import DesktopLayout from "../../components/utils/DesktopLayout";
import MobileLayout from "../../components/utils/MobileLayout";
import Breadcrumbs from "../../components/utils/Breadcrumbs";
import EmptyState from "../../components/utils/EmptyState";
import FooterDesktop from "../../components/utils/FooterDesktop";
import HeaderDesktop from "../../components/utils/HeaderDesktop";
import { usePagination } from "../../hooks/utils/usePagination";
import TablePagination from "../../components/tables/TablePagination";
import TablePageSize from "../../components/tables/TablePageSize";

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

  const isEmpty = accounts.length === 0;

  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    paginatedData,
    startItem,
    endItem,
    pages,
  } = usePagination({ data: accounts });

  return (
    <div>
      {/* DESKTOP */}
      <DesktopLayout>
        {/* HEADER */}
        {({ collapsed, setCollapsed }: any) => (
          <>
            {/* HEADER */}
            <HeaderDesktop
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />

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
                <div className="flex flex-col bg-white p-4 rounded-lg gap-4">
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-lg">List of Account</h1>
                    <button className="flex items-center px-4 py-2 gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg cursor-pointer">
                      <PlusSignIcon size={16} />
                      <span>Add Account</span>
                    </button>
                  </div>
                  <div className="h-px bg-slate-100/60" />
                  {isEmpty ? (
                    <EmptyState icon={<CreditCardNotAcceptIcon />} title="No accounts yet" subtitle="Add your first account to start tracking your cash flow." />
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <TablePageSize
                          pageSize={pageSize}
                          onChange={(value) => {
                            setPageSize(value);
                            setCurrentPage(1);
                          }}
                        />
                        <div>
                          <div className="relative flex items-center justify-center">
                            <div className="absolute left-4 pointer-events-none">
                              <Search02Icon className="text-slate-400" size={16} />
                            </div>
                            <span
                              className="block w-full ps-10 pe-20 py-2 text-sm rounded-xl border text-slate-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer appearance-none"
                            >
                              Search account
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
                          <thead className="bg-slate-50">
                            <tr className="text-left text-slate-500 border-b border-slate-100">
                              <th className="w-12">#</th>
                              <th>Account Name</th>
                              <th className="w-12 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedData.map((row, index) => (
                              <tr
                                key={row.account_id}
                                className="border-b border-slate-50 hover:bg-slate-50 transition"
                              >
                                <td className="text-slate-500 font-medium">{(currentPage - 1) * pageSize + index + 1}</td>
                                <td className="text-slate-500">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={getAccountsImg(row.name)}
                                      alt={row.name}
                                      className="w-8 h-8"
                                    />
                                    <span className="text-slate-900">{row.name || "-"}</span>
                                  </div>
                                </td>
                                <td>
                                  <div className="flex gap-2">
                                    <div className="bg-amber-50 hover:bg-amber-200 p-2 rounded-xl cursor-pointer">
                                      <NoteEditIcon className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="bg-red-50 hover:bg-red-200 p-2 rounded-xl cursor-pointer">
                                      <Delete02Icon className="w-5 h-5 text-red-500" />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        startItem={startItem}
                        endItem={endItem}
                        pages={pages}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <FooterDesktop />
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
