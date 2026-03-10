import { useEffect } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  hideDragHandle?: boolean;
}

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  hideDragHandle = false,
}: BottomSheetProps) {
  // lock scroll saat sheet terbuka
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white 
          flex flex-col transition-transform duration-300 ease-out rounded-t-3xl overflow-hidden
          ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-white px-4 pt-4 pb-3 z-10 border-b border-slate-100">
          {!hideDragHandle && (
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200" />
          )}

          {title && (
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          )}
        </div>

        {/* CONTENT */}
        <div className="px-4 py-4 pb-8 max-h-[60vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
}
