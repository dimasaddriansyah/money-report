import { useEffect, useRef, useState } from "react";

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
  const sheetRef = useRef<HTMLDivElement>(null);

  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    if (translateY > 80) { onClose() }
    setTranslateY(0);
  };

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
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`} />

      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{ transform: `translateY(${open ? translateY : 100}%)` }}
        className={`fixed inset-x-0 bottom-0 z-50 bg-white flex flex-col rounded-t-3xl overflow-hidden
          ${dragging ? "" : "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"}
          ${open ? "translate-y-0" : "translate-y-full"}`}>

        {/* HEADER */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="sticky top-0 bg-white px-4 pt-4 pb-3 z-10 border-b border-slate-100">
          {!hideDragHandle && (<div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200" />)}
          {title && (<h3 className="text-base font-semibold text-slate-900">{title}</h3>)}
        </div>

        {/* CONTENT */}
        <div className="pb-8 max-h-[60vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
}
