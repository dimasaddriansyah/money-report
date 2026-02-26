import { ArrowDown01Icon, Edit01Icon, Wallet01Icon } from "hugeicons-react";
import Header from "../components/Header";

export default function Budgets() {
  return (
    <div className="min-h-screen bg-indigo-700">
      <Header title="Budgeting" textColor="text-white" />

      {/* CARD */}
      <section className="m-4">
        <div className="bg-white p-4 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="flex justify-center items-center bg-indigo-50 rounded-lg p-2">
                <Wallet01Icon className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-base text-slate-900 p-0">
                  Total Budget
                </span>
                <span className="text-xs text-slate-400">
                  untuk bulan Februari
                </span>
              </div>
            </div>
            <div className="px-2 text-sm bg-amber-50 font-medium flex items-center rounded-lg gap-2 text-amber-500 cursor-pointer">
              <Edit01Icon className="w-5 h-5" />
              <span>Edit</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold">Rp 5.000.000</span>
            <span className="text-xs text-slate-400">
              dari total Rp 7.000.000
            </span>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-indigo-50 py-1.5 rounded-full"></div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Rp 0 terpakai</span>
              <span className="bg-indigo-50 px-2 py-1 rounded-full text-xs">
                0%
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-t-3xl overflow-hidden">
        {/* Header / Drag Handle */}
        <div className="h-8 flex items-center justify-center">
          <div className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>

        {/* Content */}
        <ul>
          <li className="relative overflow-hidden">
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-indigo-50 rounded-lg p-2">
                    <Wallet01Icon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-base text-slate-900 p-0">
                      Foods and Beverages
                    </span>
                    <span className="text-xs text-slate-400">
                      untuk makan sehari-hari
                    </span>
                  </div>
                </div>
                <ArrowDown01Icon className="w-5 h-5 text-indigo-500 transition-transform group-open:rotate-180" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-semibold text-slate-900">
                  Rp 0
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Rp 2.000.000
                </span>
              </div>
              <div className="w-full bg-indigo-50 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: "50%" }} // dynamic nanti
                />
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">
                  Rp 1.000.000 tersisa
                </span>
                <span className="text-xs text-slate-400">50%</span>
              </div>
            </div>
            <div className="mx-4 h-px bg-slate-100" />
          </li>
          <li className="relative overflow-hidden">
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-indigo-50 rounded-lg p-2">
                    <Wallet01Icon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <span className="font-medium text-base text-slate-900">
                    Foods and Beverages
                  </span>
                </div>
                <ArrowDown01Icon className="w-5 h-5 text-indigo-500 transition-transform group-open:rotate-180" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-semibold text-slate-900">
                  Rp 0
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Rp 2.000.000
                </span>
              </div>
              <div className="w-full bg-indigo-50 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: "50%" }} // dynamic nanti
                />
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">
                  Rp 1.000.000 tersisa
                </span>
                <span className="text-xs text-slate-400">50%</span>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}
