import type { InputHTMLAttributes, ReactNode } from "react";

type TextFieldProps = {
  label: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function TextField({
  label,
  leftIcon,
  rightIcon,
  error,
  className = "",
  ...props
}: TextFieldProps) {
  return (
    <div className="space-y-1">
      <label className={`block text-sm font-medium  ${error ? "text-red-500" : "text-black"}`}>{label}</label>
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">{leftIcon}</div>
        )}

        <input
          {...props}
          className={`block w-full pe-4 py-3 rounded-xl border bg-white transition focus:outline-none
            ${leftIcon ? "ps-13" : "px-4"}
            ${rightIcon ? "pe-13" : "pe-4"}
            ${error
              ? "text-red-500 border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-300 focus:ring-2 focus:ring-black"
            }
            ${className}`} />

        {rightIcon && (
          <div className="absolute inset-y-0 right-4 flex items-center text-slate-400">{rightIcon}</div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}