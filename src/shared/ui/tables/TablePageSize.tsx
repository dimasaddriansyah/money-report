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
	return (
		<div className="flex items-center text-sm gap-3">
			<span className="text-slate-500">Show</span>
			<select
				value={pageSize}
				onChange={(e) => onChange(Number(e.target.value))}
				className="border border-slate-200 hover:border-slate-900 transition rounded-lg px-2 py-1 cursor-pointer"
			>
				{options.map((opt) => (
					<option key={opt} value={opt}>
						{opt}
					</option>
				))}
			</select>
			<span className="text-slate-500">entries</span>
		</div>
	);
}