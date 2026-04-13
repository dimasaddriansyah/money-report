import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  button?: { label: string; url: string; };
  children: React.ReactNode;
};

export default function DashboardSectionLayout({ title, button, children }: Props) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col p-4 bg-white border border-slate-100 rounded-lg gap-4">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">{title}</h1>
        {button && (
          <button
            onClick={() => navigate(button.url)}
            className="flex px-4 py-2.5 gap-2 border border-slate-200 hover:bg-slate-900 text-slate-400 hover:text-white text-sm font-medium rounded-lg transition cursor-pointer">
            <span>{button.label}</span>
          </button>
        )}
      </div>
      <div className="h-px bg-slate-100/60" />
      {children}
    </section>
  );
}