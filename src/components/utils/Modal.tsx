import { Cancel01Icon } from "hugeicons-react";
import { useEffect, useState } from "react";

interface Props {
  title: string;
  textButton: string;
  children?: React.ReactNode;
  loading?: boolean;
  onSubmit?: () => void;
  onClose: () => void;
  size?: "base" | "large";
}

export default function Modal({ title, textButton, children, loading = false, onSubmit, onClose, size = "base" }: Props) {
  const sizeClass =
    size === "large"
      ? "max-w-3xl"
      : "max-w-md";
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // tunggu animasi selesai
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-lg transition-opacity duration-300 
          ${show ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Content */}
      <div
        className={`relative bg-white rounded-2xl w-full ${sizeClass} shadow-lg transform transition-all duration-300 overflow-hidden
          ${show
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100/60">
          <h1 className="text-lg font-semibold">{title}</h1>
          <Cancel01Icon
            onClick={handleClose}
            className="text-slate-400 cursor-pointer"
            size={20} />
        </div>

        {/* Modal Body */}
        <div className="p-4">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end bg-slate-50 gap-2 px-4 py-2 border-t border-slate-100/60">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-slate-500 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer">
            {loading ? (
              <span>Processing...</span>
            ) : (
              textButton
            )}
          </button>
        </div>
      </div>
    </div>
  );
}