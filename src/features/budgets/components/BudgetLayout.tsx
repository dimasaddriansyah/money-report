import { ArrowLeft01Icon, PlusSignIcon } from "hugeicons-react";
import Breadcrumb from "../../../shared/ui/Breadcrumb";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  showBack?: boolean;
  button?: { label: string; url: string; };
  breadcrumb: { label: string; path?: string }[];
  children: React.ReactNode;
};

export default function BudgetLayout({ title, breadcrumb, button, showBack = false, children }: Props) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col flex-1 px-6 py-8 gap-6 overflow-y-auto">
      <div className="flex justify-between">
        <Breadcrumb items={breadcrumb} />
        <button
          className="flex items-center px-5 py-2.5 gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg cursor-pointer">
          <PlusSignIcon size={16} />
          <span>Create Budget</span>
        </button>
      </div>
    </section>
  );
}