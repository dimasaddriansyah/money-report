import { formatRupiah } from "../../helpers/Format";

export default function ListTransactions() {
  return (
    <section>
      <div className="px-4 py-3 flex justify-between items-center text-sm font-semibold text-slate-500 bg-slate-50">
        <span>Minggu, 16 Maret 2026</span>
        <span className="text-red-500">{formatRupiah(200000)}</span>
      </div>
      <div className="divide-y divide-slate-100/60">
        <div className="flex items-center px-4 py-4 gap-4 touch-pan-y">
          <img
            alt="Gasoline"
            className="w-12 h-12"
            src="/money-report/src/assets/categories/Gasoline.png"
          />
          <div className="flex-1">
            <span className="px-2 py-1 rounded-full text-xs bg-[#FCA3111A] border-[#FCA31133] text-[#FCA311]">
              Jago
            </span>
            <div className="mt-1">
              <div className="text-base font-medium">Bensin MX King</div>
              <div className="text-sm text-slate-500">Gasoline</div>
            </div>
          </div>
          <div className="text-sm font-semibold text-red-500">
            - Rp&nbsp;30.000
          </div>
        </div>
      </div>
    </section>
  );
}
