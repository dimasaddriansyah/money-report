import { ArrowLeft01Icon } from "hugeicons-react";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  showBack?: boolean;
  rightIcon?: React.ReactNode;
};

export default function NavigationHeaderMobile({
  title,
  showBack = false,
  rightIcon,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="px-4 h-20 flex items-center justify-between border-b border-slate-50">
      <div>
        {showBack ? (
          <div
            onClick={() => navigate(-1)}
            className="flex p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full cursor-pointer">
            <ArrowLeft01Icon size={20} />
          </div>
        ) : (
          <div className="w-10" />
        )}
      </div>

      <span className="font-medium">{title}</span>

      <div>
        {rightIcon ? (
          <div className="flex p-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full cursor-pointer">
            {rightIcon}
          </div>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </div>
  );
}