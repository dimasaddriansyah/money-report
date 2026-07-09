import { useEffect, useRef, useState } from "react";
import { ArrowDown01Icon } from "hugeicons-react";

interface Props {
	pageSize: number;
	onChange: (value: number) => void;
	options?: number[];
}

export default function TablePageSize({
	pageSize,
	onChange,
	options = [10, 25, 50, 100],
}: Props) {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => { document.removeEventListener("mousedown", handleClickOutside) }
	}, []);

	return (
		<div className="flex flex-col gap-1">
			<span className="text-slate-500 text-xs">Show entries</span>

			<div className="relative" ref={dropdownRef}>
				<button
					onClick={() => setOpen(!open)}
					className="flex items-center justify-between w-24 p-3 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
					<span>{pageSize}</span>
					<ArrowDown01Icon size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
				</button>

				{open && (
					<div className="absolute z-10 mt-2 w-24 p-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
						{options.map((opt) => {
							const isSelected = pageSize === opt;
							return (
								<div
									key={opt}
									onClick={() => {
										onChange(opt);
										setOpen(false);
									}}
									className={`p-3 text-sm border-b border-slate-50 rounded-lg cursor-pointer
                    ${isSelected ? "bg-slate-100 font-semibold" : "hover:bg-slate-50"}`}>
									{opt}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}