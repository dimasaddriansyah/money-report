export default function TransactionTable() {
  <div className="overflow-x-auto">
    <table className="w-full text-sm [&_th]:px-4 [&_th]:py-2 [&_td]:px-4 [&_td]:py-3">
      <thead className="bg-slate-50">
        <tr className="text-left text-slate-500 border-b border-slate-100">
          <th className="w-12">#</th>
          <th className="">Date</th>
          <th className="">Account</th>
          <th className="">Category</th>
          <th className="w-40 text-right">Nominal</th>
          <th className="w-12 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedTransactions.map((row, index) => {
          const typeConfig = getTypeDisplay(row.typeId);
          const amountConfig = getAmountDisplay(row);
          const categoryName = getCategoryName(row.categoryId, categoryLookup);
          const isSpecialRemark = /\[.*?\]/.test(row.remark || "");

          return (
            <tr
              key={`${row.id}-${index}`}
              className={`${isSpecialRemark ? "bg-red-50" : "bg-white"} border-b border-slate-50 hover:bg-slate-50 transition`}>
              <td className="text-slate-500 font-medium">{(page - 1) * limit + index + 1}</td>
              <td>
                <div className="flex flex-col">
                  <span className="text-black font-medium">{formatDateDay(row.date)}</span>
                  <span className="text-slate-400">{formatDateTime(row.date) || "-"}</span>
                </div>
              </td>
              <td className="">
                <div className="flex flex-col gap-1.5">
                  {getAccountDisplay(row, accountLookup).map((name, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      {index > 0 && (<span className="text-slate-400">→</span>)}
                      <img src={getAccountsImg(name)} alt={name} className="w-8 h-8" />
                      <span className="font-medium">{name}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="flex items-center gap-3.5">
                <img src={getCategoriesImg(categoryName)} alt={categoryName} className="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="text-black font-medium">{row.remark || "-"}</span>
                  <span className="text-slate-400">{categoryName}</span>
                </div>
              </td>
              <td className={`text-right ${amountConfig.className}`}>
                <span className="">{formatBalance(amountConfig.label, hideBalance)}</span>
                <div className={`text-xs capitalize gap-1 ${typeConfig.className}`}>
                  <span>{typeConfig.label}</span>
                </div>
              </td>
              <td>
                <div className="flex gap-2">
                  <div
                    onClick={() => navigate(`/transaction/edit/${row.id}`)}
                    className="bg-amber-50 hover:bg-amber-200 p-2 rounded-xl cursor-pointer">
                    <NoteEditIcon className="w-5 h-5 text-amber-500" />
                  </div>
                  <div
                    onClick={() => {
                      setSelectedTransaction(row);
                      setOpen(true);
                    }}
                    className="bg-red-50 hover:bg-red-200 p-2 rounded-xl cursor-pointer">
                    <Delete02Icon className="w-5 h-5 text-red-500" />
                  </div>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
}
