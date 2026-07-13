import { useEffect, useRef, useState, type ReactNode } from "react";

type DropdownRenderProps = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

type Props = {
  trigger: (props: DropdownRenderProps) => ReactNode;
  children: (props: DropdownRenderProps) => ReactNode;
  width?: string;
};

export default function Dropdown({
  trigger,
  children,
  width = "w-60",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative">
      {trigger({ open, toggle, close })}

      {open && (
        <div className={`absolute z-20 mt-2 ${width} rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden`}>
          {children({ open, toggle, close })}
        </div>
      )}
    </div>
  );
}