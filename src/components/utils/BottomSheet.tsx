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
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white p-4 pb-6 transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {!hideDragHandle && (
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300" />
        )}

        {title && (
          <h3 className="mb-4 text-sm font-semibold text-slate-700">{title}</h3>
        )}

        {children}
      </div>
    </>
  );
}
