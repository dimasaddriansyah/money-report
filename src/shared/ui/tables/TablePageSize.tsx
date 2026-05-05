import { useState } from "react";
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

	return (
		<div className="flex flex-col gap-1">
			<span className="text-slate-500 text-xs">Show entries</span>

			<div className="relative">
				<button
					onClick={() => setOpen((prev) => !prev)}
					className="flex items-center justify-between w-24 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
					<span>{pageSize}</span>
					<ArrowDown01Icon className="text-slate-400" size={16} />
				</button>

				{open && (
					<div className="absolute z-10 mt-2 w-24 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
						{options.map((opt) => {
							const isSelected = pageSize === opt;
							return (
								<div
									key={opt}
									onClick={() => {
										onChange(opt);
										setOpen(false);
									}}
									className={`px-4 py-2 text-sm border-b border-slate-50 cursor-pointer
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