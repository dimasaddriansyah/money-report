import { Cancel01Icon } from "hugeicons-react";
import { useEffect, useState } from "react";

type Props = {
  title?: string;
  description?: string;
  onClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
  children: React.ReactNode;
};

export default function Modal({
  title,
  description,
  onClose,
  onSubmit,
  loading,
  children
}: Props) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-lg transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`} onClick={handleClose} />

      <div
        className={`relative bg-white rounded-2xl w-full max-w-md shadow-lg transform transition-all duration-300 overflow-hidden
          ${show
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
          }`}
        onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100/60">
          <h1 className="text-lg font-semibold">{title}</h1>
          <Cancel01Icon
            onClick={handleClose}
            className="text-slate-400 cursor-pointer"
            size={20} />
        </div>

        {/* MODAL BODY */}
        <div className="p-4">
          {children}
        </div>

        {/* MODAL FOOTER */}
        <div className="flex justify-end bg-slate-50 gap-2 px-4 py-2 border-t border-slate-100/60">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-slate-500 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer">
            {loading ? (
              <span>Processing...</span>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}