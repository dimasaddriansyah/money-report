import { type ReactNode, isValidElement, cloneElement } from "react";

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export default function EmptyState({ title, subtitle, icon }: Props) {
  const finalIcon =
    isValidElement(icon)
      ? cloneElement(icon as React.ReactElement<any>, {
          size: 40,
          className: `opacity-40 ${(icon as any).props?.className || ""}`,
        })
      : icon;

  return (
    <div className="flex flex-col items-center gap-4 py-8 px-4 text-slate-400">
      {finalIcon}

      <div className="text-center max-w-xs">
        <p className="text-lg font-medium text-slate-900">
          {title}
        </p>

        {subtitle && (
          <p className="text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}