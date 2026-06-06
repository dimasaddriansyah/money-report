import { Cancel01Icon } from "hugeicons-react";
import { useEffect, useState } from "react";

type ModalSize = "default" | "lg" | "xl";
type Props = {
  size?: ModalSize;
  title?: string;
  textButton?: string;
  showFooter?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  children: React.ReactNode;
};

export default function Modal({
  size,
  title,
  textButton,
  showFooter,
  onClose,
  onSubmit,
  loading,
  children
}: Props) {
  const [show, setShow] = useState(false);

  const sizeClass = {
    default: "max-w-md",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-lg transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`} onClick={handleClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white rounded-2xl w-full ${sizeClass[size ?? "default"]} shadow-lg transform transition-all duration-300 overflow-hidden
          ${show
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
          }`}>
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h1 className="text-base font-semibold">{title}</h1>
          <Cancel01Icon
            onClick={handleClose}
            className="text-slate-400 cursor-pointer"
            size={20} />
        </div>

        <div>
          {children}
        </div>

        {(showFooter ?? onSubmit) && (
          <div className="flex justify-end bg-slate-50 gap-2 px-4 py-2 border-t border-slate-100/60">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm text-slate-500 cursor-pointer">
              Cancel
            </button>
            {onSubmit && (
              <button
                onClick={onSubmit}
                disabled={loading}
                className={`px-4 py-2 text-sm rounded-lg text-white font-semibold cursor-pointer
                  ${textButton === "Delete" ? "bg-red-500 hover:bg-red-600" : "bg-black hover:bg-slate-800"}`}>
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <span>{textButton}</span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div >
  );
}