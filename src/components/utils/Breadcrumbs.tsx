import { useNavigate } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  const navigate = useNavigate();

  return (
    <nav className="text-sm text-slate-400">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.path ? (
              <span
                className="hover:text-slate-900 cursor-pointer"
                onClick={() => navigate(item.path!)}
              >
                {item.label}
              </span>
            ) : (
              <span className="text-slate-900 font-medium">
                {item.label}
              </span>
            )}

            {index < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}