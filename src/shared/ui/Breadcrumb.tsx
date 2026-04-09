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
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-slate-400"
    >
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li
            key={item.path ?? item.label}
            className="flex items-center gap-2"
          >
            {item.path ? (
              <span
                onClick={() => navigate(item.path!)}
                className="cursor-pointer hover:text-slate-900"
              >
                {item.label}
              </span>
            ) : (
              <span className="font-medium text-slate-900">
                {item.label}
              </span>
            )}

            {index < items.length - 1 && (
              <span className="text-slate-300">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}