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

export default function TransactionLayout({ title, breadcrumb, button, showBack = false, children }: Props) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col flex-1 px-6 py-8 gap-6">
      <Breadcrumb items={breadcrumb} />
      <section className="flex flex-col p-4 bg-white rounded-lg gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft01Icon size={20} />
              </button>
            )}
            <h1 className="font-semibold text-lg">{title}</h1>
          </div>
          {button && (
            <button
              onClick={() => navigate(button.url)}
              className="flex items-center px-5 py-2.5 gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg cursor-pointer">
              <PlusSignIcon size={16} />
              <span>{button.label}</span>
            </button>
          )}
        </div>
        <div className="h-px bg-slate-100/60" />
        {children}
      </section>
    </section>
  );
}