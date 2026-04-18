export function TransactionFormGenerate() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Describe Transaction</label>
          <textarea
            rows={3}
            // value={remark}
            // onChange={(e) => setField("remark", e.target.value)}
            className={`block w-full p-3 text-base rounded-xl border  border-slate-300 focus:outline-none focus:ring-2 focus:ring-black placeholder:text-slate-400 transition appearance-none`}
            placeholder="Input transaction remark" />
        </div>
        <button className="w-full py-3 bg-black hover:bg-black/90 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer">Submit</button>
      </div>
    </div >
  )
}