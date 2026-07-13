import { useNavigate } from "react-router-dom";
import { PlusSignIcon } from "hugeicons-react";

export default function BudgetCreateButton() {
  const navigate = useNavigate();

  return (
    <div className="px-4 flex">
      <button
        onClick={() => navigate("/budget/create")}
        className="flex w-full items-center justify-center gap-2 p-3 text-sm font-semibold text-white bg-black hover:bg-black/90 rounded-xl transition cursor-pointer">
        <PlusSignIcon size={16} />
        Create Budget
      </button>
    </div>
  );
}