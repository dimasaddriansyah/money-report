import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@boxicons/react";

type HeaderProps = {
  title?: React.ReactNode;
  showBack?: boolean;
  textColor?: string;
};

export default function Header({
  title,
  showBack = false,
  textColor = "text-slate-900",
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="top-0 z-40 flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-200 p-1 active:scale-95"
          >
            <ArrowLeft className={`h-5 w-5 ${textColor ?? ""}`} />
          </button>
        )}
        <h1 className={`text-lg font-bold ${textColor ?? ""}`}>{title}</h1>
      </div>
    </header>
  );
}
